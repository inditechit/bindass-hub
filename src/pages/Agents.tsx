import { useEffect, useState } from "react";
import { Eye, UserCog, IndianRupee, MapPin, Calendar, ShieldCheck, Mail, Phone, Plus, Loader2 } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/shared/StatCard";
import StatusBadge from "@/components/shared/StatusBadge";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface UserAPIResponse {
  id: number;
  name: string;
  img_url: string;
  email: string;
  status: any;
  type: string;
  phone: string;
  balance: number;
  currency: string;
  zodiac_sign: string; // Repurposed as Commission %
  created_at: string;
  Address1: string | null;
  City: string | null;
  Pincode: string | null;
  GST: string | null;
  is_banned: any;
}

const Agents = () => {
  const [agents, setAgents] = useState<UserAPIResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<UserAPIResponse | null>(null);

  // --- Add Agent State ---
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newAgentForm, setNewAgentForm] = useState({
    name: "",
    personality: "", // Repurposed for Agency Owner Name
    email: "",
    phone: "",
    password: "",
    zodiac_sign: "", // We use this key for the commission %
  });

  const fetchAgents = async () => {
    try {
      const response = await fetch("https://astroapi.inditechit.com/api/get_users");
      const json = await response.json();
      if (json.status === 200) {
        const agentList = json.data.filter((u: UserAPIResponse) => u.type === 'agent');
        setAgents(agentList);
      }
    } catch (error) {
      console.error("Error fetching agents:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAgentForm((prev) => ({ ...prev, [name]: value }));
  };
const toggleAgentStatus = async (agent: UserAPIResponse) => {
  const newStatus = agent.status === "active" ? "inactive" : "active";

  try {
    const res = await fetch(`https://astroapi.inditechit.com/api/update_users/${agent.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }), // sirf status
    });

    const json = await res.json();
    if (res.ok && (json.status === 200 || json.status === 201)) {
      setAgents(prev =>
        prev.map(a => (a.id === agent.id ? { ...a, status: newStatus } : a))
      );
    } else {
      alert(json.message || "Failed to update status");
    }
  } catch (error) {
    console.error("Status update error:", error);
    alert("Error updating status");
  }
};

  const handleAddAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);

    try {
      const response = await fetch("https://astroapi.inditechit.com/api/create_users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newAgentForm,
          type: "agent",
          status: "active",
          isNewUser: 1,
          img_url: "https://via.placeholder.com/150", 
        }),
      });

      const json = await response.json();

      if (json.status === 201 || json.status === 200) {
        setIsAddModalOpen(false);
        setNewAgentForm({ name: "", personality: "", email: "", phone: "", password: "", zodiac_sign: "" });
        await fetchAgents();
      } else {
        alert(json.message || "Failed to create agent");
      }
    } catch (error) {
      console.error("Error creating agent:", error);
      alert("Something went wrong while connecting to the server.");
    } finally {
      setIsAdding(false);
    }
  };

  if (loading) return <div className="p-10 text-center animate-pulse">Loading Agents...</div>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold">Agent Management</h1>
            <p className="text-sm text-muted-foreground mt-1">Recruiters and verification officers</p>
          </div>
          
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Plus size={18} />
            <span>Add Agent</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Total Agents" value={agents.length.toString()} icon={UserCog} glow="purple" />
          <StatCard title="Total Wallet Bal." value={`₹${agents.reduce((s, a) => s + a.balance, 0).toLocaleString()}`} icon={IndianRupee} glow="gold" />
          <StatCard title="Banned Agents" value={agents.filter(a => a.is_banned === 1).length.toString()} icon={ShieldCheck} glow="green" />
        </div>

        <div className="glass-card p-5">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left py-3 px-2 font-medium">Agent</th>
                  <th className="text-left py-3 px-2 font-medium">Location</th>
                  <th className="text-right py-3 px-2 font-medium">Wallet Balance</th>
                  <th className="text-center py-3 px-2 font-medium">Commission</th>
                  <th className="text-left py-3 px-2 font-medium">Status</th>
                  <th className="text-center py-3 px-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {agents.map(a => (
                  <tr key={a.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-3">
                        <img src={a.img_url} className="w-9 h-9 rounded-full object-cover border border-border" alt="" />
                        <div>
                          <p className="font-semibold text-foreground">{a.name}</p>
                          <p className="text-[10px] text-muted-foreground">{a.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin size={12} />
                        <span>{a.City || "Unknown"}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-right text-success font-bold">₹{a.balance.toLocaleString()}</td>
                    {/* Repurposed zodiac_sign as Commission percentage */}
                    <td className="py-3 px-2 text-center text-primary font-medium">
                      {a.zodiac_sign && a.zodiac_sign !== "NA" ? `${a.zodiac_sign}%` : "0%"}
                    </td>
                   <td className="py-3 px-2 text-center">
  <button
    onClick={() => toggleAgentStatus(a)}
    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all
      ${a.status === "active"
        ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
        : "bg-red-500/10 text-red-500 hover:bg-red-500/20"}`}
  >
    {a.status === "active" ? "Active" : "Block"}
  </button>
</td>
                    <td className="py-3 px-2 text-center">
                      <button onClick={() => setSelectedAgent(a)} className="p-2 rounded-full hover:bg-primary/10 text-primary transition-all">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- Detailed Agent Profile Popup --- */}
      <Dialog open={!!selectedAgent} onOpenChange={() => setSelectedAgent(null)}>
        <DialogContent className="bg-card border-border max-w-2xl shadow-2xl rounded-3xl overflow-hidden p-0">
          {selectedAgent && (
             <div className="flex flex-col">
             {/* Header Banner */}
             <div className="h-24 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-b border-border flex items-end p-6">
                <div className="flex items-center gap-4 translate-y-10">
                   <img src={selectedAgent.img_url} className="w-20 h-20 rounded-2xl object-cover border-4 border-card shadow-lg" alt="" />
                   <div className="mb-2">
                     <h2 className="text-2xl font-bold">{selectedAgent.name}</h2>
                     <p className="text-sm text-primary font-medium uppercase tracking-tighter">ID: #{selectedAgent.id} • {selectedAgent.type}</p>
                   </div>
                </div>
             </div>

             <div className="p-8 pt-14 grid grid-cols-1 md:grid-cols-2 gap-6">
               {/* Personal Info */}
               <div className="space-y-4">
                 <h3 className="text-xs font-bold uppercase text-muted-foreground tracking-widest border-b border-border pb-2">Contact Details</h3>
                 <div className="space-y-2">
                   <p className="flex items-center gap-2 text-sm"><Mail size={14} className="text-muted-foreground"/> {selectedAgent.email}</p>
                   <p className="flex items-center gap-2 text-sm"><Phone size={14} className="text-muted-foreground"/> {selectedAgent.phone}</p>
                   <p className="flex items-center gap-2 text-sm"><MapPin size={14} className="text-muted-foreground"/> {selectedAgent.Address1 || "No Address Provided"}</p>
                   <p className="flex items-center gap-2 text-sm pl-6 text-muted-foreground">{selectedAgent.City}, {selectedAgent.Pincode}</p>
                 </div>
               </div>

               {/* Account Info */}
               <div className="space-y-4">
                 <h3 className="text-xs font-bold uppercase text-muted-foreground tracking-widest border-b border-border pb-2">Professional Details</h3>
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <p className="text-[10px] text-muted-foreground uppercase font-bold">Commission Rate</p>
                     <p className="text-sm font-medium">{selectedAgent.zodiac_sign && selectedAgent.zodiac_sign !== "NA" ? `${selectedAgent.zodiac_sign}%` : "0%"}</p>
                   </div>
                   <div>
                     <p className="text-[10px] text-muted-foreground uppercase font-bold">GST Number</p>
                     <p className="text-sm font-medium text-accent">{selectedAgent.GST || "Not Registered"}</p>
                   </div>
                   <div className="col-span-2">
                     <p className="text-[10px] text-muted-foreground uppercase font-bold">Wallet</p>
                     <p className="text-xl font-bold text-success">₹{selectedAgent.balance}</p>
                   </div>
                 </div>
               </div>

               <div className="md:col-span-2 bg-muted/30 p-4 rounded-2xl flex justify-between items-center">
                 <div className="flex items-center gap-3">
                   <Calendar className="text-muted-foreground" size={18} />
                   <div>
                     <p className="text-[10px] text-muted-foreground uppercase font-bold">Joined Platform</p>
                     <p className="text-sm font-medium">{new Date(selectedAgent.created_at).toLocaleDateString()}</p>
                   </div>
                 </div>
                 <div className="text-right">
                   <p className="text-[10px] text-muted-foreground uppercase font-bold">Banned Status</p>
                   <p className={`text-sm font-bold ${selectedAgent.is_banned ? 'text-destructive' : 'text-green-500'}`}>
                     {selectedAgent.is_banned ? 'BLACKLISTED' : 'CLEAN RECORD'}
                   </p>
                 </div>
               </div>
             </div>
           </div>
          )}
        </DialogContent>
      </Dialog>

      {/* --- Add New Agent Modal --- */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="bg-card border-border max-w-md p-6 rounded-2xl">
          <div>
            <h2 className="text-xl font-bold mb-1">Add New Agent</h2>
            <p className="text-sm text-muted-foreground mb-6">Create a new agent profile and set their commission rate.</p>
            
            <form onSubmit={handleAddAgent} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Agency Name</label>
                <input 
                  type="text" 
                  name="name"
                  required
                  value={newAgentForm.name}
                  onChange={handleInputChange}
                  className="w-full p-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="MSG Agency"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Agency Owner Name</label>
                <input 
                  type="text" 
                  name="personality"
                  required
                  value={newAgentForm.personality}
                  onChange={handleInputChange}
                  className="w-full p-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Agency Email</label>
                <input 
                  type="email" 
                  name="email"
                  required
                  value={newAgentForm.email}
                  onChange={handleInputChange}
                  className="w-full p-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="agent@example.com"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Agency Phone Number</label>
                <input 
                  type="tel" 
                  name="phone"
                  required
                  value={newAgentForm.phone}
                  onChange={handleInputChange}
                  className="w-full p-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="+91 98765 43210"
                />
              </div>

              {/* Repurposed zodiac_sign input for Commission */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Agency Commission Percentage (%)</label>
                <input 
                  type="number" 
                  name="zodiac_sign"
                  required
                  min="0"
                  max="100"
                  value={newAgentForm.zodiac_sign}
                  onChange={handleInputChange}
                  className="w-full p-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="e.g. 15"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Agency Password</label>
                <input 
                  type="password" 
                  name="password"
                  required
                  value={newAgentForm.password}
                  onChange={handleInputChange}
                  className="w-full p-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="••••••••"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-muted/50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isAdding}
                  className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isAdding ? <Loader2 size={16} className="animate-spin" /> : "Create Agent"}
                </button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Agents;