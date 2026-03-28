import { useEffect, useState, useMemo, useRef } from "react";
import { Users as UsersIcon, Star, IndianRupee, Eye, Trash2, X, CheckCircle, Shield, CreditCard, Save, UserPlus, Camera, Loader2 } from "lucide-react";
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
  const [isUploading, setIsUploading] = useState(false);
  const [agentsList, setAgentsList] = useState<any[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (Number(agentId) === 1) return "Admin";
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
      return performers.filter((p) => String(p.skill) === String(userId));
    }
    return performers;
  }, [performers, userType, userId]);

  // --- Image Upload Logic ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editAstro) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("https://astroapi.inditechit.com/upload/upload-image-webp", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.status === 200 || result.url) {
        // Construct full URL if API returns relative path, otherwise use result.url
        const uploadedUrl = result.url.startsWith('http') 
            ? result.url 
            : `https://astroapi.inditechit.com${result.url}`;
            
        setEditAstro({ ...editAstro, img_url: uploadedUrl });
      } else {
        alert("Upload failed: " + (result.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddNew = () => {
    setEditAstro({
      id: 0, 
      displayname: "",
      astrologer_name: "",
      email: "",
      password: "DefaultPassword123!", 
      img_url: "https://static.vecteezy.com/system/resources/previews/032/176/125/non_2x/business-avatar-profile-black-icon-woman-of-user-flat-symbol-in-trendy-filled-style-isolated-on-female-profile-people-diverse-face-for-social-network-or-web-vector.jpg",
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
    if (!window.confirm("Are you sure you want to delete this performer?")) return;

    try {
      const response = await fetch(`https://astroapi.inditechit.com/api/delete_astrologer/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (response.ok || result.status === 200) {
        alert("Performer deleted successfully");
        fetchPerformers(); 
      } else {
        alert(result.message || "Failed to delete performer");
      }
    } catch (error) {
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
        body: JSON.stringify({ ...astro, status: newStatus }),
      });
      if (response.ok || await response.json().then(r => r.status === 200)) {
        fetchPerformers();
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="p-10 text-center animate-pulse text-primary font-bold">Loading Performers...</div>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-display font-bold">Performer Management</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage profiles, pricing, and approvals</p>
          </div>
          <button 
            onClick={handleAddNew}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-xl flex items-center gap-2 font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20"
          >
            <UserPlus size={18} /> Add Performer
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Total Performers" value={filteredPerformers.length.toString()} icon={UsersIcon} glow="purple" />
          <StatCard title="Pending Approvals" value={filteredPerformers.filter(p => p.status !== "active").length.toString()} icon={Shield} glow="gold" />
          <StatCard title="Total Payouts" value={`₹${filteredPerformers.reduce((s, p) => s + (Number(p.wallet_balance) || 0), 0).toLocaleString()}`} icon={IndianRupee} glow="green" />
        </div>

        {/* Table */}
        <div className="glass-card p-5 border border-border/50 rounded-3xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-left">
                  <th className="py-4 px-2 font-bold uppercase text-[10px]">Performer</th>
                  <th className="py-4 px-2 font-bold uppercase text-[10px]">Agency Name</th>
                  <th className="py-4 px-2 font-bold uppercase text-[10px]">Chat / Call (per min)</th>
                  <th className="py-4 px-2 font-bold uppercase text-[10px]">Comm. (%)</th>
                  <th className="py-4 px-2 font-bold uppercase text-[10px]">Status</th>
                  <th className="py-4 px-2 text-right font-bold uppercase text-[10px]">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPerformers.map((p) => (
                  <tr key={p.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors group">
                    <td className="py-4 px-2 flex items-center gap-3">
                      <img src={p.img_url || "https://static.vecteezy.com/system/resources/previews/032/176/125/non_2x/business-avatar-profile-black-icon-woman-of-user-flat-symbol-in-trendy-filled-style-isolated-on-female-profile-people-diverse-face-for-social-network-or-web-vector.jpg"} className="w-10 h-10 rounded-full object-cover ring-2 ring-border group-hover:ring-primary/50 transition-all" alt="" />
                      <div>
                        <p className="font-bold text-foreground">{p.displayname || p.astrologer_name || "Unknown"}</p>
                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{p.skill ? String(p.skill).split(',')[0] : 'N/A'}</p>
                      </div>
                    </td>
                    <td className="py-4 px-2 font-medium">{getAgentName(p.skill)}</td>
                    <td className="py-4 px-2">
                      <span className="text-primary font-bold">₹{p.chat_price_m || 0}</span>
                      <span className="mx-1 text-muted-foreground font-light">/</span>
                      <span className="text-accent font-bold">₹{p.call_price_m || 0}</span>
                    </td>
                    <td className="py-4 px-2">
                      <span className="bg-muted px-2 py-1 rounded-lg text-[10px] font-bold border border-border/50">{p.chat_commission || 0}% | {p.call_commission || 0}%</span>
                    </td>
                    <td className="py-4 px-2">
                      <button
                        disabled={userType === "agent"}
                        onClick={() => toggleStatus(p)}
                        className={`px-3 py-1 text-[10px] font-black uppercase rounded-full transition-all tracking-widest
                        ${p.status === "active"
                          ? "bg-green-500/10 text-green-500 border border-green-500/20"
                          : "bg-red-500/10 text-red-500 border border-red-500/20"}`}
                      >
                        {p.status === "active" ? "Active" : "Block"}
                      </button>
                    </td>
                    <td className="py-4 px-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => { setEditAstro(p); setActiveTab(1); }} className="p-2 hover:bg-primary/10 rounded-full text-primary transition-all border border-transparent hover:border-primary/20">
                          <Eye size={16} />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="p-2 hover:bg-red-500/10 rounded-full text-red-500 transition-all border border-transparent hover:border-red-500/20">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      {editAstro && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-card border border-border w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="p-8 border-b border-border flex justify-between items-center bg-muted/20">
              <div className="flex items-center gap-5">
                <div className="relative group">
                    <img 
                        src={editAstro.img_url || "https://static.vecteezy.com/system/resources/previews/032/176/125/non_2x/business-avatar-profile-black-icon-woman-of-user-flat-symbol-in-trendy-filled-style-isolated-on-female-profile-people-diverse-face-for-social-network-or-web-vector.jpg"} 
                        className={`w-16 h-16 rounded-3xl object-cover ring-4 ring-background shadow-xl transition-all ${isUploading ? 'opacity-50' : 'group-hover:opacity-80'}`} 
                        alt="" 
                    />
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all bg-black/40 rounded-3xl"
                        disabled={isUploading}
                    >
                        {isUploading ? <Loader2 className="animate-spin" size={20} /> : <Camera size={20} />}
                    </button>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageUpload} 
                        className="hidden" 
                        accept="image/*" 
                    />
                </div>
                <div>
                  <h2 className="text-2xl font-black">{editAstro.id === 0 ? "Create New Profile" : `Edit Profile`}</h2>
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-tighter opacity-70">
                    {editAstro.displayname || editAstro.astrologer_name || "New Host"}
                  </p>
                </div>
              </div>
              <button onClick={() => setEditAstro(null)} className="p-3 hover:bg-muted rounded-2xl transition-all border border-transparent hover:border-border"><X size={20} /></button>
            </div>

            {/* Tabs */}
            <div className="flex bg-muted/30 p-1.5 m-6 rounded-2xl border border-border/50">
              {(userType === "agent" ? [1] : [1,2,3]).map((t) => (                
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === t ? 'bg-background shadow-lg text-primary scale-[1.02]' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  {t === 1 ? 'Profile Info' : t === 2 ? 'Pricing' : 'Payout Details'}
                </button>
              ))}
            </div>

            {/* Modal Body */}
            <div className="px-8 pb-8 space-y-6 max-h-[50vh] overflow-y-auto custom-scrollbar">
              {activeTab === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Display Name</label>
                    <input type="text" className="w-full bg-muted/50 border border-border rounded-xl p-3 text-sm outline-none focus:ring-2 ring-primary/20 transition-all font-bold" value={editAstro.displayname || ""} onChange={e => setEditAstro({ ...editAstro, displayname: e.target.value })} placeholder="Public name..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Phone Number</label>
                    <input type="text" className="w-full bg-muted/50 border border-border rounded-xl p-3 text-sm outline-none focus:ring-2 ring-primary/20 transition-all font-bold" value={editAstro.phone || ""} onChange={e => setEditAstro({ ...editAstro, phone: e.target.value })} placeholder="+91..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Age / Exp</label>
                    <input type="number" className="w-full bg-muted/50 border border-border rounded-xl p-3 text-sm outline-none focus:ring-2 ring-primary/20 transition-all font-bold" value={editAstro.exp || ""} onChange={e => setEditAstro({ ...editAstro, exp: e.target.value })} />
                  </div>

                  {userType !== "agent" && (
                    <>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Account Status</label>
                        <select className="w-full bg-muted/50 border border-border rounded-xl p-3 text-sm outline-none font-bold" value={editAstro.status || "pending"} onChange={e => setEditAstro({ ...editAstro, status: e.target.value })}>
                          <option value="pending">⏳ Pending Review</option>
                          <option value="active">✅ Verified Active</option>
                          <option value="inactive">🚫 Blocked</option>
                        </select>
                      </div>
                      <div className="space-y-2 col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Remedies Tier</label>
                        <select className="w-full bg-muted/50 border border-border rounded-xl p-3 text-sm outline-none font-bold" value={editAstro.remedies || ""} onChange={(e) => setEditAstro({ ...editAstro, remedies: e.target.value })}>
                          <option value="bronze">Bronze Plan</option>
                          <option value="silver">Silver Plan</option>
                          <option value="gold">Gold Plan</option>
                          <option value="pro">Pro Plan</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>
              )}

              {activeTab === 2 && (
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Chat Price (₹/m)</label>
                    <input type="number" className="w-full bg-muted/50 border border-border rounded-xl p-3 text-sm font-bold outline-none" value={editAstro.chat_price_m || ''} onChange={e => setEditAstro({...editAstro, chat_price_m: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Chat Comm (%)</label>
                    <input type="number" className="w-full bg-muted/50 border border-border rounded-xl p-3 text-sm font-bold outline-none" value={editAstro.chat_commission || ''} onChange={e => setEditAstro({...editAstro, chat_commission: e.target.value})} />
                  </div>
                </div>
              )}

              {activeTab === 3 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Bank Account</label>
                    <input type="text" className="w-full bg-muted/50 border border-border rounded-xl p-3 text-sm font-bold outline-none" value={editAstro.bank_account_number || ''} onChange={e => setEditAstro({...editAstro, bank_account_number: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">IFSC Code</label>
                    <input type="text" className="w-full bg-muted/50 border border-border rounded-xl p-3 text-sm font-bold outline-none" value={editAstro.ifscCode || ''} onChange={e => setEditAstro({...editAstro, ifscCode: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Verification</label>
                    <select className="w-full bg-muted/50 border border-border rounded-xl p-3 text-sm font-bold outline-none" value={editAstro.verified || ''} onChange={e => setEditAstro({...editAstro, verified: e.target.value})}>
                      <option value="1">Verified Badge ON</option>
                      <option value="0">Unverified</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="p-8 border-t border-border flex gap-4 bg-muted/10">
              <button onClick={() => setEditAstro(null)} className="flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] bg-muted hover:bg-muted/80 transition-all">Discard</button>
              <button 
                onClick={handleSave} 
                disabled={isSaving || isUploading}
                className="flex-[2.5] py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] bg-primary text-primary-foreground hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/20 disabled:opacity-50"
              >
                {isSaving ? "Finalizing..." : <><Save size={16} /> Save Changes</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default PerformersPage;