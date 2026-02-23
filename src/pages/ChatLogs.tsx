import { MessageSquare, Phone, Eye, Search, Loader2 } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

// --- Types for Live Data ---
interface SessionMessage {
  id: number;
  from_user_id: number;
  to_user_id: number;
  msg: string;
  created_at: string;
}

interface ChatSession {
  chatSession: {
    id: number;
    user_id: string;
    astrologer_id: number;
    status: string;
    created_at: string;
    start_time: string;
    end_time: string;
  };
  astrologer: {
    id: number;
    rating: string;
  };
}

const ChatLogs = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  
  // State for Modal / Details
  const [selectedLog, setSelectedLog] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<SessionMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // 1. Fetch Master Sessions
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await fetch("https://astroapi.inditechit.com/api/get_chat_session");
        const json = await res.json();
        if (json.status === 200) setSessions(json.data);
      } catch (err) {
        console.error("Failed to fetch sessions", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  // 2. Fetch Messages for specific session
  const viewDetails = async (session: ChatSession) => {
    setSelectedLog(session);
    setLoadingMessages(true);
    setMessages([]);
    try {
      const res = await fetch(`https://astroapi.inditechit.com/api/get_session_message/${session.chatSession.id}`);
      const json = await res.json();
      if (json.status === 200) setMessages(json.data);
    } catch (err) {
      console.error("Failed to fetch messages", err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const filtered = sessions.filter(s =>
    s.chatSession.user_id.toString().includes(search) ||
    s.chatSession.astrologer_id.toString().includes(search)
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold">Live Session Logs</h1>
            <p className="text-sm text-muted-foreground mt-1">Monitor real-time interactions and message history</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by User or Astro ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-72 pl-10 bg-muted/50 border-border"
            />
          </div>
        </div>

        <div className="glass-card p-5">
          {loading ? (
            <div className="flex justify-center p-10"><Loader2 className="animate-spin text-primary" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground text-left">
                    <th className="py-3 px-2 font-medium">Session ID</th>
                    <th className="py-3 px-2 font-medium">User ID</th>
                    <th className="py-3 px-2 font-medium">Astro ID</th>
                    <th className="py-3 px-2 font-medium">Rating</th>
                    <th className="py-3 px-2 font-medium">Status</th>
                    <th className="py-3 px-2 font-medium">Date</th>
                    <th className="py-3 px-2 text-center font-medium">View History</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(s => (
                    <tr key={s.chatSession.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-2 font-mono text-xs font-bold">#{s.chatSession.id}</td>
                      <td className="py-3 px-2">User {s.chatSession.user_id}</td>
                      <td className="py-3 px-2">Astro {s.chatSession.astrologer_id}</td>
                      <td className="py-3 px-2 text-warning font-medium">⭐ {s.astrologer.rating}</td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${s.chatSession.status === 'In Progress' ? 'bg-green-500/20 text-green-500' : 'bg-muted text-muted-foreground'}`}>
                          {s.chatSession.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-muted-foreground text-xs">
                        {new Date(s.chatSession.created_at).toLocaleString()}
                      </td>
                      <td className="py-3 px-2 text-center">
                        <button 
                          onClick={() => viewDetails(s)} 
                          className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="bg-card border-border max-w-lg shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-info" />
              Session History #{selectedLog?.chatSession.id}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/30 p-3 rounded-xl border border-border">
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Client ID</p>
                <p className="font-medium">User {selectedLog?.chatSession.user_id}</p>
              </div>
              <div className="bg-muted/30 p-3 rounded-xl border border-border">
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Astrologer ID</p>
                <p className="font-medium">Astro {selectedLog?.chatSession.astrologer_id}</p>
              </div>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border">
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Conversation</p>
              
              {loadingMessages ? (
                <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                  <Loader2 className="animate-spin mb-2" />
                  <p className="text-xs">Loading messages...</p>
                </div>
              ) : messages.length > 0 ? (
                messages.map((m) => (
                  <div 
                    key={m.id} 
                    className={`p-3 rounded-2xl max-w-[85%] text-sm ${
                      m.from_user_id.toString() === selectedLog?.chatSession.user_id 
                        ? "bg-primary/10 border border-primary/20 mr-auto" 
                        : "bg-muted border border-border ml-auto"
                    }`}
                  >
                    <p className="text-foreground">{m.msg}</p>
                    <p className="text-[9px] text-muted-foreground mt-1">
                      {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 bg-muted/20 rounded-2xl border border-dashed border-border">
                  <p className="text-sm text-muted-foreground">No messages found for this session.</p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default ChatLogs;