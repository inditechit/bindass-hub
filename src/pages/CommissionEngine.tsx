import { TrendingUp, IndianRupee } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { defaultSplit } from "@/data/mockData";

const CommissionEngine = () => {
  const [split, setSplit] = useState(defaultSplit);
  const [saved, setSaved] = useState(false);

  const total = split.adminShare + split.agentShare + split.userShare;
  const isValid = total === split.clientRate;

  const handleSave = () => {
    if (isValid) setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Commission Engine</h1>
          <p className="text-sm text-muted-foreground mt-1">Configure the dynamic revenue split logic</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Config */}
          <div className="glass-card p-6 space-y-5">
            <h2 className="font-display font-semibold text-lg flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Per-Minute Split Configuration
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground font-medium">Client Pays (₹/min)</label>
                <Input
                  type="number"
                  value={split.clientRate}
                  onChange={e => setSplit(s => ({ ...s, clientRate: Number(e.target.value) }))}
                  className="mt-1 bg-muted/50 border-border"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-medium">Admin Gets (₹/min)</label>
                <Input
                  type="number"
                  value={split.adminShare}
                  onChange={e => setSplit(s => ({ ...s, adminShare: Number(e.target.value) }))}
                  className="mt-1 bg-muted/50 border-border"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-medium">Agent Gets (₹/min)</label>
                <Input
                  type="number"
                  value={split.agentShare}
                  onChange={e => setSplit(s => ({ ...s, agentShare: Number(e.target.value) }))}
                  className="mt-1 bg-muted/50 border-border"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-medium">User Gets (₹/min)</label>
                <Input
                  type="number"
                  value={split.userShare}
                  onChange={e => setSplit(s => ({ ...s, userShare: Number(e.target.value) }))}
                  className="mt-1 bg-muted/50 border-border"
                />
              </div>

              {!isValid && (
                <p className="text-xs text-destructive">
                  Split total (₹{total}) must equal client rate (₹{split.clientRate})
                </p>
              )}

              <Button
                onClick={handleSave}
                disabled={!isValid}
                className="w-full bg-primary hover:bg-primary/90"
              >
                {saved ? "✓ Saved!" : "Save Configuration"}
              </Button>
            </div>
          </div>

          {/* Preview */}
          <div className="glass-card p-6 space-y-5">
            <h2 className="font-display font-semibold text-lg flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-accent" />
              Split Preview (per minute)
            </h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border">
                <span className="text-sm text-muted-foreground">Client Pays</span>
                <span className="text-xl font-display font-bold text-accent">₹{split.clientRate}</span>
              </div>

              <div className="text-center text-muted-foreground text-xs py-1">splits into ↓</div>

              <div className="space-y-2">
                {[
                  { label: "Admin", value: split.adminShare, pct: ((split.adminShare / split.clientRate) * 100).toFixed(0), color: "text-warning" },
                  { label: "Agent", value: split.agentShare, pct: ((split.agentShare / split.clientRate) * 100).toFixed(0), color: "text-primary" },
                  { label: "User", value: split.userShare, pct: ((split.userShare / split.clientRate) * 100).toFixed(0), color: "text-success" },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/50">
                    <span className="text-sm text-foreground">{item.label}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">{item.pct}%</span>
                      <span className={`text-lg font-display font-bold ${item.color}`}>₹{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* 30 min example */}
              <div className="mt-4 p-4 rounded-lg border border-primary/20 bg-primary/5">
                <p className="text-xs text-muted-foreground mb-2">Example: 30 min session</p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-[10px] text-muted-foreground">Admin</p>
                    <p className="font-bold text-warning">₹{split.adminShare * 30}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Agent</p>
                    <p className="font-bold text-primary">₹{split.agentShare * 30}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">User</p>
                    <p className="font-bold text-success">₹{split.userShare * 30}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CommissionEngine;
