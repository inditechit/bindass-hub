import { useEffect, useState } from "react";
import { Users as UsersIcon, Star, IndianRupee, Eye, Trash2, X, CheckCircle, Shield, CreditCard, Save } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/shared/StatCard";
import StatusBadge from "@/components/shared/StatusBadge";

interface Astrologer {
  id: number;
  displayname: string;
  astrologer_name: string;
  img_url: string;
  skill: string;
  language: string;
  chat_price_m: string;
  call_price_m: string;
  chat_commission: string;
  call_commission: string;
  rating: string;
  current_status: string;
  status: string; // Used for Approval (e.g., "active", "pending")
  phone: string;
  wallet_balance: number;
  experience: string;
  long_bio: string;
  verified: string;
  bank_account_number?: string;
  ifscCode?: string;
  panCardNo?: string;
}

const PerformersPage = () => {
  const [performers, setPerformers] = useState<Astrologer[]>([]);
  const [loading, setLoading] = useState(true);
  const [editAstro, setEditAstro] = useState<Astrologer | null>(null);
  const [activeTab, setActiveTab] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchPerformers();
  }, []);

  const fetchPerformers = async () => {
    try {
      const response = await fetch("https://astroapi.inditechit.com/api/get_astrologer");
      const json = await response.json();
      if (json.status === 200) setPerformers(json.data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editAstro) return;
    setIsSaving(true);
    try {
      const response = await fetch(`https://astroapi.inditechit.com/api/update_astrologer/${editAstro.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editAstro),
      });
      const result = await response.json();
      if (response.ok) {
        alert("Astrologer updated successfully!");
        setEditAstro(null);
        fetchPerformers();
      } else {
        alert(result.message || "Update failed");
      }
    } catch (error) {
      alert("Error updating performer");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center animate-pulse">Loading Performers...</div>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Performer Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage profiles, pricing, and approvals</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Total Performers" value={performers.length.toString()} icon={UsersIcon} glow="purple" />
          <StatCard title="Pending Approvals" value={performers.filter(p => p.status !== "active").length.toString()} icon={Shield} glow="gold" />
          <StatCard title="Total Payouts" value={`₹${performers.reduce((s, p) => s + p.wallet_balance, 0).toLocaleString()}`} icon={IndianRupee} glow="green" />
        </div>

        <div className="glass-card p-5">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-left">
                  <th className="py-3 px-2">Performer</th>
                  <th className="py-3 px-2">Chat / Call (per min)</th>
                  <th className="py-3 px-2">Comm. (%)</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {performers.map((p) => (
                  <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-2 flex items-center gap-3">
                      <img src={p.img_url} className="w-9 h-9 rounded-full object-cover" alt="" />
                      <div>
                        <p className="font-semibold">{p.displayname}</p>
                        <p className="text-[10px] text-muted-foreground">{p.skill.split(',')[0]}</p>
                      </div>
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
                      <StatusBadge status={p.status === "active" ? "active" : "pending"} />
                    </td>
                    <td className="py-3 px-2 text-right">
                      <button onClick={() => { setEditAstro(p); setActiveTab(1); }} className="p-2 hover:bg-primary/10 rounded-full text-primary transition-all">
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- MULTI-PART UPDATE POPUP --- */}
      {editAstro && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-card border border-border w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b border-border flex justify-between items-center bg-muted/20">
              <div className="flex items-center gap-3">
                <img src={editAstro.img_url} className="w-10 h-10 rounded-full object-cover" alt="" />
                <h2 className="text-xl font-bold">Update {editAstro.displayname}</h2>
              </div>
              <button onClick={() => setEditAstro(null)} className="p-2 hover:bg-muted rounded-full"><X size={20} /></button>
            </div>

            {/* Tab Navigation */}
            <div className="flex bg-muted/10 p-1 m-4 rounded-xl border border-border">
              {[1, 2, 3].map((t) => (
                <button
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
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Display Name</label>
                    <input type="text" className="w-full bg-muted/50 border border-border rounded-lg p-2 text-sm outline-none" 
                           value={editAstro.displayname} onChange={e => setEditAstro({...editAstro, displayname: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Account Status</label>
                    <select className="w-full bg-muted/50 border border-border rounded-lg p-2 text-sm outline-none"
                            value={editAstro.status} onChange={e => setEditAstro({...editAstro, status: e.target.value})}>
                      <option value="active">Active (Approved)</option>
                      <option value="pending">Pending</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Long Bio</label>
                    <textarea className="w-full bg-muted/50 border border-border rounded-lg p-2 text-sm outline-none h-24" 
                              value={editAstro.long_bio} onChange={e => setEditAstro({...editAstro, long_bio: e.target.value})} />
                  </div>
                </div>
              )}

              {activeTab === 2 && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Chat Price (Per Min)</label>
                    <input type="number" className="w-full bg-muted/50 border border-border rounded-lg p-2 text-sm outline-none" 
                           value={editAstro.chat_price_m} onChange={e => setEditAstro({...editAstro, chat_price_m: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Chat Commission (%)</label>
                    <input type="number" className="w-full bg-muted/50 border border-border rounded-lg p-2 text-sm outline-none" 
                           value={editAstro.chat_commission} onChange={e => setEditAstro({...editAstro, chat_commission: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Call Price (Per Min)</label>
                    <input type="number" className="w-full bg-muted/50 border border-border rounded-lg p-2 text-sm outline-none" 
                           value={editAstro.call_price_m} onChange={e => setEditAstro({...editAstro, call_price_m: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Call Commission (%)</label>
                    <input type="number" className="w-full bg-muted/50 border border-border rounded-lg p-2 text-sm outline-none" 
                           value={editAstro.call_commission} onChange={e => setEditAstro({...editAstro, call_commission: e.target.value})} />
                  </div>
                </div>
              )}

              {activeTab === 3 && (
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
                            value={editAstro.verified} onChange={e => setEditAstro({...editAstro, verified: e.target.value})}>
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
                onClick={handleUpdate} 
                disabled={isSaving}
                className="flex-[2] py-3 rounded-xl font-bold bg-primary text-primary-foreground hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                {isSaving ? "Updating..." : <><Save size={18} /> Update & Approve Performer</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default PerformersPage;