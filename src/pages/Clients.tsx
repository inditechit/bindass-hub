import { useEffect, useState } from "react";
import { Crown, IndianRupee, Coins, Trash2, Eye, Search, X, Mail, Phone, Calendar, User } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/shared/StatCard";

interface UserData {
  id: number;
  name: string;
  img_url: string;
  email: string;
  phone: string;
  balance: number;
  currency: string;
  type: string;
  zodiac_sign: string;
  date_of_birth: string;
  created_at: string;
  status: string;
}

const Clients = () => {
  const [clients, setClients] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null); // State for popup

  const fetchData = async () => {
    try {
      const response = await fetch("https://astroapi.inditechit.com/api/get_users");
      const json = await response.json();
      if (json.status === 200) {
        const filtered = json.data.filter((u: UserData) => u.type === "user");
        setClients(filtered);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const response = await fetch(`https://astroapi.inditechit.com/api/delete_users/${id}`, { method: "DELETE" });
      if (response.ok) setClients(prev => prev.filter(c => c.id !== id));
    } catch (error) { alert("Delete failed"); }
  };

  const filteredClients = clients
    .filter(c => (c.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || c.phone?.includes(searchTerm))
    .sort((a, b) => b.balance - a.balance);

  if (loading) return <div className="p-10 text-center">Loading Client Database...</div>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header and Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold">Client Records</h1>
            <p className="text-sm text-muted-foreground mt-1">Full database of registered users</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input 
              type="text" placeholder="Search..." 
              className="bg-background border border-border rounded-lg pl-10 pr-4 py-2 w-full md:w-64 outline-none"
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Total Clients" value={clients.length.toString()} icon={Crown} glow="gold" />
          <StatCard title="Avg Balance" value={`₹${(clients.reduce((s, c) => s + c.balance, 0) / (clients.length || 1)).toFixed(0)}`} icon={IndianRupee} glow="purple" />
          <StatCard title="Total Liability" value={clients.reduce((s, c) => s + c.balance, 0).toLocaleString()} icon={Coins} glow="green" />
        </div>

        {/* Table */}
        <div className="glass-card p-5">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-left">
                  <th className="py-3 px-2">Client</th>
                  <th className="py-3 px-2">Balance</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((c, i) => (
                  <tr key={c.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-2 flex items-center gap-3">
                      <img src={c.img_url} className="w-8 h-8 rounded-full object-cover" alt="" />
                      <div>
                        <p className="font-medium">{c.name}</p>
                        <p className="text-[10px] text-muted-foreground">{c.phone}</p>
                      </div>
                    </td>
                    <td className="py-3 px-2 font-bold text-accent">₹{c.balance}</td>
                    <td className="py-3 px-2 capitalize text-xs">{c.status}</td>
                    <td className="py-3 px-2 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setSelectedUser(c)} className="p-2 text-primary hover:bg-primary/10 rounded-full"><Eye size={16} /></button>
                        <button onClick={() => handleDelete(c.id)} className="p-2 text-destructive hover:bg-destructive/10 rounded-full"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- DETAILS POPUP --- */}
      {selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            {/* Modal Header/Cover */}
            <div className="relative h-24 bg-gradient-to-r from-indigo-600 to-purple-600">
              <button 
                onClick={() => setSelectedUser(null)} 
                className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-8 pb-8">
              {/* Profile Image Overlap */}
              <div className="relative -mt-12 mb-6">
                <img 
                  src={selectedUser.img_url} 
                  className="w-24 h-24 rounded-2xl border-4 border-card object-cover shadow-xl" 
                  alt={selectedUser.name} 
                />
              </div>

              {/* User Info Grid */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{selectedUser.name}</h2>
                  <p className="text-primary font-medium flex items-center gap-1">
                    <User size={14} /> ID: #{selectedUser.id} • {selectedUser.type}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                    <Mail className="text-muted-foreground" size={18} />
                    <div className="overflow-hidden">
                      <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Email</p>
                      <p className="text-sm truncate">{selectedUser.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                    <Phone className="text-muted-foreground" size={18} />
                    <div>
                      <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Phone</p>
                      <p className="text-sm">{selectedUser.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                    <Calendar className="text-muted-foreground" size={18} />
                    <div>
                      <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Birthday</p>
                      <p className="text-sm">{new Date(selectedUser.date_of_birth).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                    <div className="w-[18px] h-[18px] border-2 border-muted-foreground rounded-full flex items-center justify-center text-[10px] font-bold text-muted-foreground">Z</div>
                    <div>
                      <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Zodiac Sign</p>
                      <p className="text-sm capitalize">{selectedUser.zodiac_sign || "N/A"}</p>
                    </div>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="p-4 rounded-2xl bg-accent/10 border border-accent/20 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-accent-foreground font-medium">Current Balance</p>
                    <p className="text-2xl font-bold text-accent">₹{selectedUser.balance.toLocaleString()}</p>
                  </div>
                  <div className="text-right text-[11px] text-muted-foreground">
                    <p>Joined: {new Date(selectedUser.created_at).toLocaleDateString()}</p>
                    <p className="capitalize">Status: {selectedUser.status}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Clients;