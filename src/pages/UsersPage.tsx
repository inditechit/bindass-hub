import { useEffect, useState, useMemo } from "react";
import { Users as UsersIcon, Star, IndianRupee, Eye, Trash2, X, CheckCircle, Shield, CreditCard, Save, UserPlus } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/shared/StatCard";
import StatusBadge from "@/components/shared/StatusBadge";

interface Astrologer {
  id: number;
  displayname: string;
  astrologer_name: string;
  email?: string;
  password?: string;
  img_url: string;
  skill: string;
  spirituality?: string;
  language: string;
  chat_price_m: string;
  call_price_m: string;
  chat_commission: string;
  call_commission: string;
  rating: string;
  current_status: string;
  status: string; 
  phone: string;
  wallet_balance: number;
  experience: string;
  long_bio: string;
  verified: string;
  remedies?: string;
  agent_id?: number | string; 
  bank_account_number?: string;
  ifscCode?: string;
  panCardNo?: string;
  [key: string]: any; 
}

const PerformersPage = () => {
  const [performers, setPerformers] = useState<Astrologer[]>([]);
  const [loading, setLoading] = useState(true);
  const [editAstro, setEditAstro] = useState<Astrologer | null>(null);
  const [activeTab, setActiveTab] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [agentsList, setAgentsList] = useState<any[]>([]);

  useEffect(() => {
  fetchPerformers();
  fetchAgents();
}, []);

const fetchAgents = async () => {
  try {
    const res = await fetch("https://astroapi.inditechit.com/api/get_users");
    const json = await res.json();
    if (json.status === 200) {
      const agentList = json.data.filter((u: any) => u.type === "agent");
      setAgentsList(agentList);
    }
  } catch (err) {
    console.error("Failed to fetch agents", err);
  }
};
const getAgentName = (agentId: string | number) => {
  if (Number(agentId) === 1) return "Admin"; // 1 → admin
  const agent = agentsList.find(a => a.id === Number(agentId));
  return agent ? agent.name : "Unknown Agent";
};

  const { userType, userId } = useMemo(() => {
    try {
      const storedUser = localStorage.getItem("astro_user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        return { userType: parsed?.type || "admin", userId: parsed?.id };
      }
    } catch (error) {
      console.error("Failed to parse astro_user from localStorage", error);
    }
    return { userType: "admin", userId: null };
  }, []);
  

  useEffect(() => {
    fetchPerformers();
  }, []);

  const fetchPerformers = async () => {
    try {
      const response = await fetch("https://astroapi.inditechit.com/api/get_astrologer");
      const json = await response.json();
      if (json.status === 200) {
        setPerformers(json.data);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPerformers = useMemo(() => {
    if (userType === "agent" && userId) {
      return performers.filter((p) => p.skill == userId);
    }
    return performers;
  }, [performers, userType, userId]);

  const handleAddNew = () => {
    setEditAstro({
      id: 0, 
      displayname: "",
      astrologer_name: "",
      email: "",
      password: "DefaultPassword123!", 
      img_url: "/img/no-dp.png",
      skill: String(userId), 
      spirituality: String(userId),
      language: "Hindi, English",
      chat_price_m: "0",
      call_price_m: "0",
      chat_commission: "0",
      call_commission: "0",
      rating: "0",
      current_status: "Offline",
      status: "pending",
      phone: "",
      wallet_balance: 0,
      experience: "0",
      long_bio: "",
      verified: "0",
      remedies: "newhost",
      bank_account_number: "",
      ifscCode: "",
      panCardNo: "",
      otp: "123456",
      currency: "INR",
      main_cat: "Astrology",
      sub_cat: "Vedic",
      gender: "male",
      country: "India",
      county_code: "IN",
      activate: "0",
      working_ex: "0"
    });
    setActiveTab(1);
  };

  const handleSave = async () => {
    if (!editAstro) return;
    setIsSaving(true);

    const isNew = editAstro.id === 0;
    
    const payload = {
  ...editAstro,
    astrologer_name: editAstro.astrologer_name || editAstro.displayname,
    email: editAstro.email || `user${Date.now()}@astro.com`,
  skill: String(userId),
  spirituality: String(userId),
  status: userType === "agent" ? "pending" : editAstro.status
};

    const endpoint = isNew 
      ? `https://astroapi.inditechit.com/api/create_astrologer`
      : `https://astroapi.inditechit.com/api/update_astrologer/${editAstro.id}`;
      
    const method = isNew ? "POST" : "PUT";

    try {
      const response = await fetch(endpoint, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      
      if (response.ok || result.status === 200 || result.status === 201) {
        alert(`Host ${isNew ? 'added' : 'updated'} successfully!`);
        setEditAstro(null);
        fetchPerformers();
      } else {
        alert(result.message || "Save operation failed");
      }
    } catch (error) {
      alert("Error saving performer data");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this performer? This action cannot be undone.")) return;

    try {
      const response = await fetch(`https://astroapi.inditechit.com/api/delete_astrologer/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (response.ok || result.status === 200) {
        alert("Performer deleted successfully");
        fetchPerformers(); // Refresh the list
      } else {
        alert(result.message || "Failed to delete performer");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error deleting performer");
    }
  };
const toggleStatus = async (astro: Astrologer) => {
  if (userType === "agent") return;

  const newStatus = astro.status === "active" ? "inactive" : "active";

  try {
    const response = await fetch(`https://astroapi.inditechit.com/api/update_astrologer/${astro.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...astro,
        status: newStatus
      }),
    });

    const result = await response.json();

    if (response.ok || result.status === 200) {
      fetchPerformers();
    } else {
      alert("Status update failed");
    }
  } catch (error) {
    console.error(error);
  }
};
  if (loading) return <div className="p-10 text-center animate-pulse">Loading Performers...</div>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-display font-bold">Performer Management</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage profiles, pricing, and approvals</p>
          </div>
          <button 
            onClick={handleAddNew}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-xl flex items-center gap-2 font-bold hover:opacity-90 transition-all"
          >
            <UserPlus size={18} /> Add Performer
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Total Performers" value={filteredPerformers.length.toString()} icon={UsersIcon} glow="purple" />
          <StatCard title="Pending Approvals" value={filteredPerformers.filter(p => p.status !== "active").length.toString()} icon={Shield} glow="gold" />
          <StatCard title="Total Payouts" value={`₹${filteredPerformers.reduce((s, p) => s + p.wallet_balance, 0).toLocaleString()}`} icon={IndianRupee} glow="green" />
        </div>

        <div className="glass-card p-5">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-left">
                  <th className="py-3 px-2">Performer</th>
                  <th className="py-3 px-2">Agency Name</th>
                  <th className="py-3 px-2">Chat / Call (per min)</th>
                  <th className="py-3 px-2">Comm. (%)</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPerformers.map((p) => (
                  <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-2 flex items-center gap-3">
                      <img src={p.img_url} className="w-9 h-9 rounded-full object-cover" alt="" />
                      <div>
                        <p className="font-semibold">{p.displayname}</p>
                        <p className="text-[10px] text-muted-foreground">{p.skill.split(',')[0]}</p>
                      </div>
                    </td>
                    <td className="py-3 px-2">
  {getAgentName(p.skill)}
</td>
                    <td className="py-3 px-2">
                      <span className="text-primary font-medium">₹{p.chat_price_m}</span>
                      <span className="mx-1 text-muted-foreground">/</span>
                      <span className="text-accent font-medium">₹{p.call_price_m}</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="bg-muted px-2 py-0.5 rounded text-[10px]">{p.chat_commission}% | {p.call_commission}%</span>
                    </td>
                    <td className="py-3 px-2">
  {userType === "agent" ? (
    <span
      className={`px-3 py-1 text-xs font-bold rounded-lg
      ${p.status === "active"
        ? "bg-green-500/10 text-green-500"
        : "bg-red-500/10 text-red-500"}`}
    >
      {p.status === "active" ? "Active" : "Block"}
    </span>
  ) : (
    <button
      onClick={() => toggleStatus(p)}
      className={`px-3 py-1 text-xs font-bold rounded-lg transition-all
      ${p.status === "active"
        ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
        : "bg-red-500/10 text-red-500 hover:bg-red-500/20"}`}
    >
      {p.status === "active" ? "Active" : "Block"}
    </button>
  )}
</td>
                    <td className="py-3 px-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => { setEditAstro(p); setActiveTab(1); }} className="p-2 hover:bg-primary/10 rounded-full text-primary transition-all">
                          <Eye size={16} />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="p-2 hover:bg-red-500/10 rounded-full text-red-500 transition-all">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredPerformers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-muted-foreground">
                      No performers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {editAstro && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-card border border-border w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b border-border flex justify-between items-center bg-muted/20">
              <div className="flex items-center gap-3">
                {editAstro.id !== 0 && <img src={editAstro.img_url} className="w-10 h-10 rounded-full object-cover" alt="" />}
                <h2 className="text-xl font-bold">{editAstro.id === 0 ? "Add New Performer" : `Update ${editAstro.displayname}`}</h2>
              </div>
              <button onClick={() => setEditAstro(null)} className="p-2 hover:bg-muted rounded-full"><X size={20} /></button>
            </div>

            <div className="flex bg-muted/10 p-1 m-4 rounded-xl border border-border">
{(userType === "agent" ? [1] : [1,2,3]).map((t) => (                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === t ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground'}`}
                >
                  {t === 1 ? 'Profile & Approval' : t === 2 ? 'Rates & Commission' : 'Verification & Bank'}
                </button>
              ))}
            </div>

            <div className="p-6 pt-0 space-y-4 max-h-[60vh] overflow-y-auto">
              {activeTab === 1 && (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

    <div className="space-y-1">
      <label className="text-[10px] font-bold uppercase text-muted-foreground">
        Display Name
      </label>
      <input
        type="text"
        className="w-full bg-muted/50 border border-border rounded-lg p-2 text-sm outline-none"
        value={editAstro.displayname || ""}
        onChange={e => setEditAstro({ ...editAstro, displayname: e.target.value })}
      />
    </div>

    <div className="space-y-1">
      <label className="text-[10px] font-bold uppercase text-muted-foreground">
        Phone Number
      </label>
      <input
        type="text"
        className="w-full bg-muted/50 border border-border rounded-lg p-2 text-sm outline-none"
        value={editAstro.phone || ""}
        onChange={e => setEditAstro({ ...editAstro, phone: e.target.value })}
      />
    </div>

    {/* AGE → backend field exp */}
    <div className="space-y-1">
      <label className="text-[10px] font-bold uppercase text-muted-foreground">
        Age
      </label>
      <input
        type="number"
        className="w-full bg-muted/50 border border-border rounded-lg p-2 text-sm outline-none"
        value={editAstro.exp || ""}
        onChange={e => setEditAstro({ ...editAstro, exp: e.target.value })}
      />
    </div>

    {/* Admin only fields */}
    {userType !== "agent" && (
      <>
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase text-muted-foreground">
            Host Name
          </label>
          <input
            type="text"
            className="w-full bg-muted/50 border border-border rounded-lg p-2 text-sm outline-none"
            value={editAstro.astrologer_name || ""}
            onChange={e => setEditAstro({ ...editAstro, astrologer_name: e.target.value })}
          />
        </div>

        <div className="space-y-1 md:col-span-2">
          <label className="text-[10px] font-bold uppercase text-muted-foreground">
            Account Status
          </label>
          <select
            className="w-full bg-muted/50 border border-border rounded-lg p-2 text-sm outline-none"
            value={editAstro.status}
            onChange={e => setEditAstro({ ...editAstro, status: e.target.value })}
          >
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </>
    )}
    
{userType !== "agent" && editAstro.id !== 0 && (
  <div className="space-y-1 col-span-2">
    <label className="text-[10px] font-bold uppercase text-muted-foreground">
      Remedies Package
    </label>

    <select
      className="w-full bg-muted/50 border border-border rounded-lg p-2 text-sm outline-none"
      value={editAstro.remedies || ""}
      onChange={(e) =>
        setEditAstro({ ...editAstro, remedies: e.target.value })
      }
    >
      <option value="bronze">Bronze</option>
      <option value="silver">Silver</option>
      <option value="gold">Gold</option>
      <option value="pro">Pro</option>
      <option value="diamond">Diamond</option>
    </select>
  </div>
)}

  </div>
)}

{activeTab === 2 && userType !== "agent" && (
                  <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Chat Price (Per Min)</label>
                    <input type="number" className="w-full bg-muted/50 border border-border rounded-lg p-2 text-sm outline-none" 
                           value={editAstro.chat_price_m || ''} onChange={e => setEditAstro({...editAstro, chat_price_m: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Chat Commission (%)</label>
                    <input type="number" className="w-full bg-muted/50 border border-border rounded-lg p-2 text-sm outline-none" 
                           value={editAstro.chat_commission || ''} onChange={e => setEditAstro({...editAstro, chat_commission: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Call Price (Per Min)</label>
                    <input type="number" className="w-full bg-muted/50 border border-border rounded-lg p-2 text-sm outline-none" 
                           value={editAstro.call_price_m || ''} onChange={e => setEditAstro({...editAstro, call_price_m: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Call Commission (%)</label>
                    <input type="number" className="w-full bg-muted/50 border border-border rounded-lg p-2 text-sm outline-none" 
                           value={editAstro.call_commission || ''} onChange={e => setEditAstro({...editAstro, call_commission: e.target.value})} />
                  </div>
                </div>
              )}

              {activeTab === 3 && userType !== "agent" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Bank Account Number</label>
                    <input type="text" className="w-full bg-muted/50 border border-border rounded-lg p-2 text-sm outline-none" 
                           value={editAstro.bank_account_number || ''} onChange={e => setEditAstro({...editAstro, bank_account_number: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">IFSC Code</label>
                    <input type="text" className="w-full bg-muted/50 border border-border rounded-lg p-2 text-sm outline-none" 
                           value={editAstro.ifscCode || ''} onChange={e => setEditAstro({...editAstro, ifscCode: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">PAN Card Number</label>
                    <input type="text" className="w-full bg-muted/50 border border-border rounded-lg p-2 text-sm outline-none" 
                           value={editAstro.panCardNo || ''} onChange={e => setEditAstro({...editAstro, panCardNo: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Verified (0/1)</label>
                    <select className="w-full bg-muted/50 border border-border rounded-lg p-2 text-sm outline-none"
                            value={editAstro.verified || ''} onChange={e => setEditAstro({...editAstro, verified: e.target.value})}>
                      <option value="1">Verified (Badge On)</option>
                      <option value="0">Unverified</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-border flex gap-3">
              <button onClick={() => setEditAstro(null)} className="flex-1 py-3 rounded-xl font-bold bg-muted hover:bg-muted/80 transition-all">Cancel</button>
              <button 
                onClick={handleSave} 
                disabled={isSaving}
                className="flex-[2] py-3 rounded-xl font-bold bg-primary text-primary-foreground hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                {isSaving ? "Saving..." : <><Save size={18} /> {editAstro.id === 0 ? "Save Performer" : "Update & Approve Performer"}</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default PerformersPage;