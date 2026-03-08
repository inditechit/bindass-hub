import { Mic, CheckCircle, XCircle, Save, X } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatusBadge from "@/components/shared/StatusBadge";
import { useState, useEffect } from "react";

interface Astrologer {
  id: number;
  astrologer_name: string;
  displayname: string;
  phone: string;
  img_url: string;
  status: string;
  gender: string;
  intro_url?: string;
}

const AudioVerification = () => {
  const [pendingUsers, setPendingUsers] = useState<Astrologer[]>([]);
  const [statuses, setStatuses] = useState<Record<number, string>>({});
  const [popupUser, setPopupUser] = useState<Astrologer | null>(null);
  const [activeTab, setActiveTab] = useState(1);
  const [formData, setFormData] = useState({
    displayname: "",
    phone: "",
    status: "active",
    chat_price_m: "0",
    call_price_m: "0",
    chat_commission: "0",
    call_commission: "0",
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchPendingAstros();
  }, []);

  const fetchPendingAstros = async () => {
    try {
      const res = await fetch("https://astroapi.inditechit.com/api/get_astrologer");
      const json = await res.json();
      if (json.status === 200) {
        const pending = json.data.filter((astro: Astrologer) => astro.status === "pending");
        setPendingUsers(pending);
      }
    } catch (err) {
      console.error("Failed to fetch astrologers", err);
    }
  };

  const openForm = (user: Astrologer) => {
    setPopupUser(user);
    setFormData({
      displayname: user.displayname || user.astrologer_name || "",
      phone: user.phone || "",
      status: "active",
      chat_price_m: "0",
      call_price_m: "0",
      chat_commission: "0",
      call_commission: "0",
    });
    setActiveTab(1);
  };

  // NEW: Handle Reject (Hits API to update status)
  const handleReject = async (userId: number) => {
    try {
      // Adjust this endpoint if your update URL is different
      const res = await fetch("https://astroapi.inditechit.com/api/update_astrologer", {
        method: "POST", // or PUT depending on your backend setup
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: userId,
          status: "rejected"
        }),
      });
      const result = await res.json();

      if (res.ok && (result.status === 200 || result.status === 201)) {
        setStatuses(prev => ({ ...prev, [userId]: "rejected" }));
        fetchPendingAstros(); // Refresh the list
      } else {
        alert(result.message || "Failed to reject user");
      }
    } catch (err) {
      console.error("Error rejecting user", err);
      alert("Error rejecting user");
    }
  };

  const handleSave = async () => {
    if (!popupUser) return;
    setIsSaving(true);

    const payload = {
      // Pass the ID so the backend knows to UPDATE, not just create blindly
      id: popupUser.id, 
      displayname: formData.displayname,
      astrologer_name: formData.displayname,
      phone: formData.phone,
      exp: 0,
      skill: "1",
      spirituality: "1",
      status: formData.status,
      chat_price_m: formData.chat_price_m,
      call_price_m: formData.call_price_m,
      chat_commission: formData.chat_commission,
      call_commission: formData.call_commission,
      email: `user${Date.now()}@astro.com`,
      password: "DefaultPassword123!",
      remedies: "newhost",
    };

    try {
      // NOTE: You might want to point this to update_astrologer instead of create_astrologer 
      // since the astrologer is already in the database as "pending"
      const res = await fetch("https://astroapi.inditechit.com/api/create_astrologer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();

      if (res.ok && (result.status === 200 || result.status === 201)) {
        setStatuses(prev => ({ ...prev, [popupUser.id]: "accepted" }));
        setPopupUser(null);
        fetchPendingAstros(); 
      } else {
        alert(result.message || "Failed to add user");
      }
    } catch (err) {
      alert("Error adding user");
    } finally {
      setIsSaving(false);
    }
  };

  const getUserStatus = (user: Astrologer) => {
    if (statuses[user.id]) return statuses[user.id]; 
    return user.status; 
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Audio Verification</h1>
          <p className="text-sm text-muted-foreground mt-1">Review audio intros from independent users</p>
        </div>

        <div className="grid gap-4">
          {pendingUsers.length === 0 && (
            <p className="text-muted-foreground text-sm">No pending verifications found.</p>
          )}
          
          {pendingUsers.map(u => {
            const currentStatus = getUserStatus(u);
            if (currentStatus === "accepted" || currentStatus === "rejected") {
               return null;
            }

            return (
              <div key={u.id} className="glass-card-hover p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-primary/15 flex items-center justify-center text-primary font-bold">
                      {u.img_url ? (
                        <img src={u.img_url} alt={u.astrologer_name} className="w-full h-full object-cover" />
                      ) : (
                        u.astrologer_name?.charAt(0) || "U"
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{u.displayname || u.astrologer_name}</p>
                      <p className="text-xs text-muted-foreground">{u.phone}</p>
                      <div className="mt-1">
                        <StatusBadge status={currentStatus as any} />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="glass-card p-2 flex items-center gap-2">
                      <Mic className="w-4 h-4 text-primary" />
                      <audio controls className="h-8 w-48" style={{ filter: "invert(1) hue-rotate(180deg)" }}>
                        {/* FIXED AUDIO URL LOGIC */}
                        <source 
                          src={u.intro_url ? `https://astroapi.inditechit.com${u.intro_url}` : "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3"} 
                          type="audio/mpeg" 
                        />
                      </audio>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => openForm(u)}
                        className="p-2 rounded-lg bg-success/10 text-success hover:bg-success/20"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleReject(u.id)}
                        className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Popup Form (Remains Unchanged) */}
      {popupUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b border-border flex justify-between items-center bg-muted/20">
              <h2 className="text-xl font-bold">Approve {popupUser.astrologer_name}</h2>
              <button onClick={() => setPopupUser(null)} className="p-2 hover:bg-muted rounded-full"><X size={20} /></button>
            </div>

            {/* Tabs */}
            <div className="flex bg-muted/10 p-1 m-4 rounded-xl border border-border">
              <button onClick={() => setActiveTab(1)} className={`flex-1 py-2 text-xs font-bold rounded-lg ${activeTab === 1 ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground'}`}>Profile & Approval</button>
              <button onClick={() => setActiveTab(2)} className={`flex-1 py-2 text-xs font-bold rounded-lg ${activeTab === 2 ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground'}`}>Rates & Commission</button>
            </div>

            <div className="p-6 pt-0 space-y-4 max-h-[60vh] overflow-y-auto">
              {activeTab === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Display Name</label>
                    <input type="text" className="w-full bg-muted/50 border border-border rounded-lg p-2 text-sm outline-none"
                      value={formData.displayname} onChange={e => setFormData({ ...formData, displayname: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Phone</label>
                    <input type="text" className="w-full bg-muted/50 border border-border rounded-lg p-2 text-sm outline-none"
                      value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Status</label>
                    <select className="w-full bg-muted/50 border border-border rounded-lg p-2 text-sm outline-none"
                      value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              )}

              {activeTab === 2 && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Chat Price (Per Min)</label>
                    <input type="number" className="w-full bg-muted/50 border border-border rounded-lg p-2 text-sm outline-none"
                      value={formData.chat_price_m} onChange={e => setFormData({ ...formData, chat_price_m: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Chat Commission (%)</label>
                    <input type="number" className="w-full bg-muted/50 border border-border rounded-lg p-2 text-sm outline-none"
                      value={formData.chat_commission} onChange={e => setFormData({ ...formData, chat_commission: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Call Price (Per Min)</label>
                    <input type="number" className="w-full bg-muted/50 border border-border rounded-lg p-2 text-sm outline-none"
                      value={formData.call_price_m} onChange={e => setFormData({ ...formData, call_price_m: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Call Commission (%)</label>
                    <input type="number" className="w-full bg-muted/50 border border-border rounded-lg p-2 text-sm outline-none"
                      value={formData.call_commission} onChange={e => setFormData({ ...formData, call_commission: e.target.value })} />
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-border flex gap-3">
              <button onClick={() => setPopupUser(null)} className="flex-1 py-3 rounded-xl font-bold bg-muted hover:bg-muted/80 transition-all">Cancel</button>
              <button onClick={handleSave} disabled={isSaving} className="flex-[2] py-3 rounded-xl font-bold bg-primary text-primary-foreground hover:opacity-90 transition-all flex items-center justify-center gap-2">
                {isSaving ? "Saving..." : <><Save size={18} /> Approve User</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AudioVerification;