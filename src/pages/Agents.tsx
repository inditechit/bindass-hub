import { Eye, UserCog, IndianRupee, Users } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/shared/StatCard";
import StatusBadge from "@/components/shared/StatusBadge";
import { agents, users } from "@/data/mockData";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Agents = () => {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const agent = agents.find(a => a.id === selectedAgent);
  const teamMembers = users.filter(u => u.agentId === selectedAgent);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Agent Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage recruiters and their teams</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Total Agents" value={agents.length.toString()} icon={UserCog} glow="purple" />
          <StatCard title="Total Team Members" value={users.filter(u => u.type === "agent").length.toString()} icon={Users} glow="green" />
          <StatCard title="Total Agent Earnings" value={`₹${agents.reduce((s, a) => s + a.totalEarnings, 0).toLocaleString()}`} icon={IndianRupee} glow="gold" />
        </div>

        <div className="glass-card p-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left py-3 px-2 font-medium">Name</th>
                <th className="text-left py-3 px-2 font-medium">Phone</th>
                <th className="text-center py-3 px-2 font-medium">Team Size</th>
                <th className="text-right py-3 px-2 font-medium">Total Earned</th>
                <th className="text-right py-3 px-2 font-medium">Wallet</th>
                <th className="text-left py-3 px-2 font-medium">Status</th>
                <th className="text-center py-3 px-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {agents.map(a => (
                <tr key={a.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-2 font-medium text-foreground">{a.name}</td>
                  <td className="py-3 px-2 text-muted-foreground">{a.phone}</td>
                  <td className="py-3 px-2 text-center text-foreground">{a.teamSize}</td>
                  <td className="py-3 px-2 text-right text-accent font-medium">₹{a.totalEarnings.toLocaleString()}</td>
                  <td className="py-3 px-2 text-right text-success font-medium">₹{a.walletBalance.toLocaleString()}</td>
                  <td className="py-3 px-2"><StatusBadge status={a.status} /></td>
                  <td className="py-3 px-2 text-center">
                    <button onClick={() => setSelectedAgent(a.id)} className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!selectedAgent} onOpenChange={() => setSelectedAgent(null)}>
        <DialogContent className="bg-card border-glass-border max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-display">{agent?.name}'s Team</DialogTitle>
          </DialogHeader>
          {agent && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="glass-card p-3 text-center">
                  <p className="text-xs text-muted-foreground">Wallet</p>
                  <p className="text-lg font-bold text-success">₹{agent.walletBalance.toLocaleString()}</p>
                </div>
                <div className="glass-card p-3 text-center">
                  <p className="text-xs text-muted-foreground">Total Earned</p>
                  <p className="text-lg font-bold text-accent">₹{agent.totalEarnings.toLocaleString()}</p>
                </div>
                <div className="glass-card p-3 text-center">
                  <p className="text-xs text-muted-foreground">Commission</p>
                  <p className="text-lg font-bold text-primary">{agent.commissionRate}%</p>
                </div>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="text-left py-2 px-2 font-medium">User</th>
                    <th className="text-right py-2 px-2 font-medium">Minutes</th>
                    <th className="text-right py-2 px-2 font-medium">Earned</th>
                    <th className="text-center py-2 px-2 font-medium">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {teamMembers.map(u => (
                    <tr key={u.id} className="border-b border-border/50">
                      <td className="py-2 px-2 text-foreground">{u.name}</td>
                      <td className="py-2 px-2 text-right text-muted-foreground">{u.totalMinutes}</td>
                      <td className="py-2 px-2 text-right text-accent">₹{u.totalEarned.toLocaleString()}</td>
                      <td className="py-2 px-2 text-center text-warning">⭐ {u.rating}</td>
                    </tr>
                  ))}
                  {teamMembers.length === 0 && (
                    <tr><td colSpan={4} className="py-4 text-center text-muted-foreground">No team members found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Agents;
