import { useEffect, useState } from "react";
import { Eye, Ticket, MessageCircle, Clock, CheckCircle, Calendar, Hash, User, FileText, Send, Loader2 } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/shared/StatCard";
import StatusBadge from "@/components/shared/StatusBadge";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// Define the interface based on the provided JSON structure
interface SupportTicketResponse {
  id: number;
  text: string;
  reply:any;
  transaction_id: number | null;
  created_at: string;
  reply_date: string | null;
  type: string;
  astro_name: string | null;
}

const SupportTickets = () => {
  const [tickets, setTickets] = useState<SupportTicketResponse[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal & Reply States
  const [selectedTicket, setSelectedTicket] = useState<SupportTicketResponse | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch tickets on mount
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch("https://astroapi.inditechit.com/api/get_support_ticket");
        const json = await response.json();
        if (json.status === 200) {
          // Sort by newest first
          const sortedTickets = json.data.sort((a: SupportTicketResponse, b: SupportTicketResponse) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          setTickets(sortedTickets);
        }
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  // Reset reply text when a new ticket is opened
  useEffect(() => {
    setReplyText("");
  }, [selectedTicket]);

  // --- API Integration for Updating a Ticket Reply ---
  const handleReplySubmit = async () => {
    if (!selectedTicket || !replyText.trim()) return;
    
    setIsSubmitting(true);
    try {
      // Format the current date for MySQL DATETIME format (YYYY-MM-DD HH:mm:ss)
      const currentSqlDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

      // Use the update endpoint with the ticket ID in the URL
      const response = await fetch(`https://astroapi.inditechit.com/api/update_support_ticket/${selectedTicket.id}`, {
        method: "PUT", // Change to "PUT" if your Express router defines it as router.put()
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json, text/plain, */*"
        },
        body: JSON.stringify({
          reply: replyText,
          reply_date: currentSqlDate,
          type: selectedTicket.type || "admin" // Keeping type context as requested
        })
      });

      if (response.ok) {
        // Optimistically update the UI without reloading the page
        
        // Update the main table list
        setTickets(prev => prev.map(t => 
          t.id === selectedTicket.id 
            ? { ...t, reply: replyText, reply_date: currentSqlDate } 
            : t
        ));
        
        // Update the currently viewed modal state
        setSelectedTicket(prev => prev ? { ...prev, reply: replyText, reply_date: currentSqlDate } : null);
        setReplyText("");
        
        // Optional: Alert the admin that the user was notified
        alert("Reply saved successfully. The user has been notified via push notification.");
      } else {
        alert("Failed to submit reply. Please check the network tab.");
      }
    } catch (error) {
      console.error("Error submitting reply:", error);
      alert("An error occurred while submitting the reply.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-10 text-center animate-pulse">Loading Tickets...</div>;

  const pendingTickets = tickets.filter(t => !t.reply).length;
  const resolvedTickets = tickets.filter(t => t.reply).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Support Tickets</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage user and astrologer queries</p>
        </div>

        {/* --- Stats Section --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Total Tickets" value={tickets.length.toString()} icon={Ticket} glow="purple" />
          <StatCard title="Pending Replies" value={pendingTickets.toString()} icon={Clock} glow="gold" />
          <StatCard title="Resolved" value={resolvedTickets.toString()} icon={CheckCircle} glow="green" />
        </div>

        {/* --- Table Section --- */}
        <div className="glass-card p-5">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left py-3 px-2 font-medium">Ticket ID</th>
                  <th className="text-left py-3 px-2 font-medium">Sender</th>
                  <th className="text-left py-3 px-2 font-medium">Type</th>
                  <th className="text-left py-3 px-2 font-medium">Date</th>
                  <th className="text-left py-3 px-2 font-medium">Status</th>
                  <th className="text-center py-3 px-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => (
                  <tr key={t.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-2 font-medium text-foreground">
                      <div className="flex items-center gap-2">
                        <Hash size={14} className="text-muted-foreground" />
                        {t.id}
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <p className="font-semibold text-foreground">{t.astro_name || "Anonymous User"}</p>
                    </td>
                    <td className="py-3 px-2">
                      <span className="uppercase text-[10px] font-bold tracking-wider text-primary bg-primary/10 px-2 py-1 rounded-full">
                        Support Ticket
                      </span>
                    </td>
                    <td className="py-3 px-2 text-muted-foreground">
                      {new Date(t.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-2">
                      <StatusBadge status={t.reply ? "resolved" : "pending"} />
                    </td>
                    <td className="py-3 px-2 text-center">
                      <button 
                        onClick={() => setSelectedTicket(t)} 
                        className="p-2 rounded-full hover:bg-primary/10 text-primary transition-all"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                
                {tickets.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-muted-foreground">
                      No support tickets found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- Detailed Ticket Profile Popup --- */}
      <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
        <DialogContent className="bg-card border-border max-w-2xl shadow-2xl rounded-3xl overflow-hidden p-0">
          {selectedTicket && (
            <div className="flex flex-col">
              {/* Header Banner */}
              <div className="h-24 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border-b border-border flex items-end p-6">
                 <div className="flex items-center gap-4 translate-y-8">
                    <div className="w-16 h-16 rounded-2xl bg-card border-4 border-card shadow-lg flex items-center justify-center text-primary">
                      <Ticket size={28} />
                    </div>
                    <div className="mb-2">
                      <h2 className="text-2xl font-bold">Ticket #{selectedTicket.id}</h2>
                      <p className="text-sm text-primary font-medium uppercase tracking-tighter">
                        {selectedTicket.type} Query
                      </p>
                    </div>
                 </div>
              </div>

              <div className="p-8 pt-12 space-y-6">
                
                {/* Meta Information Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4 border-b border-border">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1"><User size={12}/> Sender</p>
                    <p className="text-sm font-medium">{selectedTicket.astro_name || "Anonymous"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1"><Calendar size={12}/> Created On</p>
                    <p className="text-sm font-medium">{new Date(selectedTicket.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1"><FileText size={12}/> Transaction ID</p>
                    <p className="text-sm font-medium text-accent">{selectedTicket.transaction_id || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1"><CheckCircle size={12}/> Status</p>
                    <p className={`text-sm font-bold ${selectedTicket.reply ? 'text-green-500' : 'text-yellow-500'}`}>
                      {selectedTicket.reply ? 'RESOLVED' : 'PENDING'}
                    </p>
                  </div>
                </div>

                {/* Original Message */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                    <MessageCircle size={14} /> Query Message
                  </h3>
                  <div className="bg-muted/30 p-4 rounded-xl border border-border/50 text-sm leading-relaxed">
                    {selectedTicket.text}
                  </div>
                </div>

                {/* Reply Section */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                    <CheckCircle size={14} /> Support Reply
                  </h3>
                  
                  {selectedTicket.reply ? (
                    // Display existing reply
                    <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 text-sm leading-relaxed">
                      <p className="mb-2">{selectedTicket.reply}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-4 pt-3 border-t border-primary/10">
                        <Clock size={12} /> Replied on: {new Date(selectedTicket.reply_date || Date.now()).toLocaleString()}
                      </p>
                    </div>
                  ) : (
                    // Input to create a new reply
                    <div className="bg-destructive/5 p-4 rounded-xl border border-destructive/20 flex flex-col items-center justify-center text-center">
                      <textarea
                        className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all min-h-[100px] resize-y placeholder:text-muted-foreground"
                        placeholder="Type your reply to this user..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        disabled={isSubmitting}
                      />
                      <div className="w-full flex justify-end mt-3">
                        <button
                          onClick={handleReplySubmit}
                          disabled={isSubmitting || !replyText.trim()}
                          className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-primary/20"
                        >
                          {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                          {isSubmitting ? "Sending..." : "Send Reply"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default SupportTickets;