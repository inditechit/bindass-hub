import { useEffect, useState } from "react";
import { Eye, UserCog, IndianRupee, Users, MapPin, Calendar, ShieldCheck, Mail, Phone, Briefcase } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/shared/StatCard";
import StatusBadge from "@/components/shared/StatusBadge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
  zodiac_sign: string;
  date_of_birth: string;
  place_of_birth: string;
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

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch("https://astroapi.inditechit.com/api/get_users");
        const json = await response.json();
        if (json.status === 200) {
          // Filter only users where type is 'agent'
          const agentList = json.data.filter((u: UserAPIResponse) => u.type === 'agent');
          setAgents(agentList);
        }
      } catch (error) {
        console.error("Error fetching agents:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAgents();
  }, []);

  if (loading) return <div className="p-10 text-center animate-pulse">Loading Agents...</div>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Agent Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Recruiters and verification officers</p>
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
                  <th className="text-left py-3 px-2 font-medium">Zodiac</th>
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
                    <td className="py-3 px-2 text-primary font-medium">{a.zodiac_sign !== "NA" ? a.zodiac_sign : "—"}</td>
                    <td className="py-3 px-2">
                      <StatusBadge status={a.is_banned ? "banned" : a.status} />
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
                  <h3 className="text-xs font-bold uppercase text-muted-foreground tracking-widest border-b border-border pb-2">Professional & Astro</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">Zodiac</p>
                      <p className="text-sm font-medium">{selectedAgent.zodiac_sign}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">Birth Place</p>
                      <p className="text-sm font-medium">{selectedAgent.place_of_birth}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">GST Number</p>
                      <p className="text-sm font-medium text-accent">{selectedAgent.GST || "Not Registered"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">Wallet</p>
                      <p className="text-sm font-bold text-success">₹{selectedAgent.balance}</p>
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
    </DashboardLayout>
  );
};

export default Agents;