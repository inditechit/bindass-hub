import { useEffect, useState } from "react";
import { Crown, IndianRupee, Coins, Trash2, Eye, Search, X, Phone, Calendar, User, MapPin, Home } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/shared/StatCard";

interface UserData {
  id: number;
  name: string;
  img_url: string;
  phone: string;
  balance: number;
  currency: string;
  type: string;
  date_of_birth: string | null;
  created_at: string;
  status: string;
  Address1: string | null;
  City: string | null;
  Pincode: string | null;
}

const Clients = () => {
  const [clients, setClients] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  const fetchData = async () => {
    try {
      const response = await fetch("https://astroapi.inditechit.com/api/get_users");
      const json = await response.json();
      if (json.status === 200) {
        // Filter out agents/admins, keep only basic users
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
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const response = await fetch(`https://astroapi.inditechit.com/api/delete_users/${id}`, { method: "DELETE" });
      if (response.ok) setClients(prev => prev.filter(c => c.id !== id));
    } catch (error) { 
      alert("Delete failed"); 
    }
  };

  // Helper to calculate age from DOB
  const calculateAge = (dob: string | null) => {
    if (!dob) return "Unknown";
    const birthDate = new Date(dob);
    if (isNaN(birthDate.getTime())) return "Unknown";
    
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return `${age} yrs`;
  };

  const filteredClients = clients
    .filter(c => (c.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || c.phone?.includes(searchTerm))
    .sort((a, b) => b.balance - a.balance);

  if (loading) return <div className="p-10 text-center animate-pulse">Loading Client Database...</div>;

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
              type="text" 
              placeholder="Search name or phone..." 
              className="bg-background border border-border rounded-lg pl-10 pr-4 py-2 w-full md:w-64 outline-none focus:border-primary transition-colors"
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Total Clients" value={clients.length.toString()} icon={Crown} glow="gold" />
          <StatCard title="Avg Balance" value={`₹${(clients.reduce((s, c) => s + c.balance, 0) / (clients.length || 1)).toFixed(0)}`} icon={IndianRupee} glow="purple" />
          <StatCard title="Total Liability" value={`₹${clients.reduce((s, c) => s + c.balance, 0).toLocaleString()}`} icon={Coins} glow="green" />
        </div>

        {/* Table */}
        <div className="glass-card p-5">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-left">
                  <th className="py-3 px-2 font-medium">Client</th>
                  <th className="py-3 px-2 font-medium">Location</th>
                  <th className="py-3 px-2 font-medium">Age</th>
                  <th className="py-3 px-2 font-medium">Balance</th>
                  <th className="py-3 px-2 font-medium">Status</th>
                  <th className="py-3 px-2 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((c) => (
                  <tr key={c.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-2 flex items-center gap-3">
                      <img 
                        src={c.img_url || "https://via.placeholder.com/150"} 
                        className="w-9 h-9 rounded-full object-cover border border-border" 
                        alt="Profile" 
                      />
                      <div>
                        <p className="font-semibold text-foreground">{c.name || "Unknown"}</p>
                        <p className="text-[10px] text-muted-foreground">{c.phone}</p>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin size={12} />
                        {c.City ? `${c.City}` : "Unknown"}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-muted-foreground">
                      {calculateAge(c.date_of_birth)}
                    </td>
                    <td className="py-3 px-2 font-bold text-success">
                      ₹{c.balance.toLocaleString()}
                    </td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${c.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => setSelectedUser(c)} className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors"><Eye size={16} /></button>
                        <button onClick={() => handleDelete(c.id)} className="p-2 text-destructive hover:bg-destructive/10 rounded-full transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {filteredClients.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-muted-foreground">
                      No clients found matching your criteria.
                    </td>
                  </tr>
                )}
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
            <div className="relative h-24 bg-gradient-to-r from-blue-600 to-cyan-600">
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
                  src={selectedUser.img_url || "https://via.placeholder.com/150"} 
                  className="w-24 h-24 rounded-2xl border-4 border-card object-cover shadow-xl bg-card" 
                  alt={selectedUser.name} 
                />
              </div>

              {/* User Info Grid */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{selectedUser.name || "Anonymous User"}</h2>
                  <p className="text-primary font-medium flex items-center gap-1 mt-1 uppercase text-xs tracking-wider">
                    <User size={14} /> ID: #{selectedUser.id} • {selectedUser.type}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/50">
                    <Phone className="text-muted-foreground" size={18} />
                    <div>
                      <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Phone</p>
                      <p className="text-sm font-medium">{selectedUser.phone || "Not Provided"}</p>
                    </div>
                  </div>

                  {/* Age & DOB */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/50">
                    <Calendar className="text-muted-foreground" size={18} />
                    <div>
                      <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Age / Born</p>
                      <p className="text-sm font-medium">
                        {calculateAge(selectedUser.date_of_birth)} 
                        <span className="text-xs text-muted-foreground font-normal ml-1">
                          ({selectedUser.date_of_birth ? new Date(selectedUser.date_of_birth).toLocaleDateString() : 'N/A'})
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Location (City/Pincode) */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/50">
                    <MapPin className="text-muted-foreground" size={18} />
                    <div className="overflow-hidden">
                      <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">City & ZIP</p>
                      <p className="text-sm font-medium truncate">
                        {selectedUser.City || "N/A"} {selectedUser.Pincode ? `- ${selectedUser.Pincode}` : ''}
                      </p>
                    </div>
                  </div>

                  {/* Full Address */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/50">
                    <Home className="text-muted-foreground" size={18} />
                    <div className="overflow-hidden">
                      <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Street Address</p>
                      <p className="text-sm font-medium truncate" title={selectedUser.Address1 || "Not Provided"}>
                        {selectedUser.Address1 || "Not Provided"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="p-4 rounded-2xl bg-accent/5 border border-accent/20 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-accent-foreground/80 font-bold uppercase tracking-wider mb-1">Wallet Balance</p>
                    <p className="text-2xl font-bold text-success">₹{selectedUser.balance.toLocaleString()}</p>
                  </div>
                  <div className="text-right text-[11px] text-muted-foreground">
                    <p className="mb-1">Joined: <span className="font-medium text-foreground">{new Date(selectedUser.created_at).toLocaleDateString()}</span></p>
                    <p>Status: <span className={`uppercase font-bold ${selectedUser.status === 'active' ? 'text-green-500' : 'text-yellow-500'}`}>{selectedUser.status}</span></p>
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