import { TrendingUp, IndianRupee, Edit, Save, X, Users } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { users, defaultAgentSplit, defaultIndependentSplit } from "@/data/mockData";
import type { User, UserCommissionSplit } from "@/data/mockData";

const CommissionEngine = () => {
  const [userSplits, setUserSplits] = useState<Record<string, UserCommissionSplit>>(
    Object.fromEntries(users.map(u => [u.id, { ...u.commission }]))
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<UserCommissionSplit | null>(null);

  const startEdit = (u: User) => {
    setEditingId(u.id);
    setEditDraft({ ...userSplits[u.id] });
  };

  const saveEdit = (userId: string) => {
    if (editDraft) {
      setUserSplits(prev => ({ ...prev, [userId]: editDraft }));
    }
    setEditingId(null);
    setEditDraft(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditDraft(null);
  };

  const isValid = (split: UserCommissionSplit) =>
    split.adminShare + split.agentShare + split.userShare === split.clientRate;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Commission Engine</h1>
          <p className="text-sm text-muted-foreground mt-1">Per-user revenue split configuration — each user can have a unique distribution</p>
        </div>

        {/* Default Templates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-card p-5">
            <h3 className="font-display font-semibold text-sm mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Default: Agent User Split
            </h3>
            <div className="grid grid-cols-4 gap-2 text-center">
              {[
                { label: "Rate", value: `₹${defaultAgentSplit.clientRate}`, color: "text-foreground" },
                { label: "Admin", value: `₹${defaultAgentSplit.adminShare}`, color: "text-warning" },
                { label: "Agent", value: `₹${defaultAgentSplit.agentShare}`, color: "text-primary" },
                { label: "User", value: `₹${defaultAgentSplit.userShare}`, color: "text-success" },
              ].map(s => (
                <div key={s.label} className="bg-muted/30 rounded-lg p-2">
                  <p className="text-[10px] text-muted-foreground">{s.label}</p>
                  <p className={`text-sm font-bold ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-card p-5">
            <h3 className="font-display font-semibold text-sm mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-accent" />
              Default: Independent User Split (No Agent)
            </h3>
            <div className="grid grid-cols-4 gap-2 text-center">
              {[
                { label: "Rate", value: `₹${defaultIndependentSplit.clientRate}`, color: "text-foreground" },
                { label: "Admin", value: `₹${defaultIndependentSplit.adminShare}`, color: "text-warning" },
                { label: "Agent", value: "₹0", color: "text-muted-foreground" },
                { label: "User", value: `₹${defaultIndependentSplit.userShare}`, color: "text-success" },
              ].map(s => (
                <div key={s.label} className="bg-muted/30 rounded-lg p-2">
                  <p className="text-[10px] text-muted-foreground">{s.label}</p>
                  <p className={`text-sm font-bold ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Per-User Table */}
        <div className="glass-card p-5">
          <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-accent" />
            Individual User Commission Splits
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left py-3 px-2 font-medium">User</th>
                  <th className="text-left py-3 px-2 font-medium">Type</th>
                  <th className="text-left py-3 px-2 font-medium">Agent</th>
                  <th className="text-right py-3 px-2 font-medium">Rate (₹/min)</th>
                  <th className="text-right py-3 px-2 font-medium">Admin (₹)</th>
                  <th className="text-right py-3 px-2 font-medium">Agent (₹)</th>
                  <th className="text-right py-3 px-2 font-medium">User (₹)</th>
                  <th className="text-center py-3 px-2 font-medium">Valid</th>
                  <th className="text-center py-3 px-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => {
                  const split = editingId === u.id ? editDraft! : userSplits[u.id];
                  const editing = editingId === u.id;
                  const valid = isValid(split);

                  return (
                    <tr key={u.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-primary text-[10px] font-bold">
                            {u.avatar}
                          </div>
                          <span className="font-medium text-foreground">{u.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${u.type === "agent" ? "bg-primary/15 text-primary" : "bg-accent/15 text-accent"}`}>
                          {u.type === "agent" ? "Agent" : "Independent"}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-muted-foreground">{u.agentName || "—"}</td>

                      {editing ? (
                        <>
                          <td className="py-2 px-1">
                            <Input type="number" value={editDraft!.clientRate} onChange={e => setEditDraft(d => d && { ...d, clientRate: Number(e.target.value) })} className="h-8 w-20 text-right bg-muted/50 border-border text-xs ml-auto" />
                          </td>
                          <td className="py-2 px-1">
                            <Input type="number" value={editDraft!.adminShare} onChange={e => setEditDraft(d => d && { ...d, adminShare: Number(e.target.value) })} className="h-8 w-20 text-right bg-muted/50 border-border text-xs ml-auto" />
                          </td>
                          <td className="py-2 px-1">
                            <Input type="number" value={editDraft!.agentShare} onChange={e => setEditDraft(d => d && { ...d, agentShare: Number(e.target.value) })} disabled={u.type === "independent"} className="h-8 w-20 text-right bg-muted/50 border-border text-xs ml-auto disabled:opacity-30" />
                          </td>
                          <td className="py-2 px-1">
                            <Input type="number" value={editDraft!.userShare} onChange={e => setEditDraft(d => d && { ...d, userShare: Number(e.target.value) })} className="h-8 w-20 text-right bg-muted/50 border-border text-xs ml-auto" />
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="py-3 px-2 text-right text-foreground font-medium">₹{split.clientRate}</td>
                          <td className="py-3 px-2 text-right text-warning font-medium">₹{split.adminShare}</td>
                          <td className="py-3 px-2 text-right text-primary font-medium">{split.agentShare > 0 ? `₹${split.agentShare}` : "—"}</td>
                          <td className="py-3 px-2 text-right text-success font-medium">₹{split.userShare}</td>
                        </>
                      )}

                      <td className="py-3 px-2 text-center">
                        {valid ? (
                          <span className="text-success text-xs">✓</span>
                        ) : (
                          <span className="text-destructive text-xs" title={`Sum ₹${split.adminShare + split.agentShare + split.userShare} ≠ Rate ₹${split.clientRate}`}>✗</span>
                        )}
                      </td>
                      <td className="py-3 px-2 text-center">
                        {editing ? (
                          <div className="flex items-center justify-center gap-1">
                            <button onClick={() => saveEdit(u.id)} disabled={!valid} className="p-1.5 rounded-lg hover:bg-success/10 text-success transition-colors disabled:opacity-30">
                              <Save className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={cancelEdit} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => startEdit(u)} className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors">
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Example Calculator */}
        <div className="glass-card p-5">
          <h2 className="font-display font-semibold text-lg mb-4">30-Minute Session Preview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {users.filter(u => u.status === "active").map(u => {
              const s = userSplits[u.id];
              return (
                <div key={u.id} className="glass-card-hover p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center text-primary text-[9px] font-bold">{u.avatar}</div>
                    <p className="text-sm font-medium text-foreground">{u.name}</p>
                    <span className={`ml-auto px-1.5 py-0.5 rounded text-[9px] font-medium ${u.type === "agent" ? "bg-primary/15 text-primary" : "bg-accent/15 text-accent"}`}>
                      {u.type === "agent" ? "Agent" : "Ind."}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-[10px] text-muted-foreground">Admin</p>
                      <p className="text-sm font-bold text-warning">₹{s.adminShare * 30}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">Agent</p>
                      <p className={`text-sm font-bold ${s.agentShare > 0 ? "text-primary" : "text-muted-foreground"}`}>
                        {s.agentShare > 0 ? `₹${s.agentShare * 30}` : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">User</p>
                      <p className="text-sm font-bold text-success">₹{s.userShare * 30}</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground text-center mt-2">Client pays ₹{s.clientRate * 30} total</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CommissionEngine;
