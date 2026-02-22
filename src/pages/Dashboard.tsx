import { IndianRupee, Users, UserCog, Crown, MessageSquare, TrendingUp } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/shared/StatCard";
import StatusBadge from "@/components/shared/StatusBadge";
import { chatLogs, agents, users, clients, recharges } from "@/data/mockData";

const totalRevenue = chatLogs.reduce((s, l) => s + l.clientSpent, 0);
const totalUserPayouts = chatLogs.reduce((s, l) => s + l.userEarned, 0);
const totalAgentPayouts = chatLogs.reduce((s, l) => s + l.agentEarned, 0);
const adminRevenue = chatLogs.reduce((s, l) => s + l.adminEarned, 0);

const Dashboard = () => (
  <DashboardLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Welcome back, Super Admin</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} subtitle="All time" icon={IndianRupee} glow="gold" />
        <StatCard title="Admin Earnings" value={`₹${adminRevenue.toLocaleString()}`} subtitle="Platform share" icon={TrendingUp} glow="purple" />
        <StatCard title="Agent Payouts" value={`₹${totalAgentPayouts.toLocaleString()}`} subtitle="Pending" icon={UserCog} glow="green" />
        <StatCard title="User Payouts" value={`₹${totalUserPayouts.toLocaleString()}`} subtitle="Pending" icon={Users} glow="purple" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Active Agents" value={agents.filter(a => a.status === "active").length.toString()} icon={UserCog} glow="purple" />
        <StatCard title="Active Users" value={users.filter(u => u.status === "active").length.toString()} subtitle={`${users.filter(u => u.status === "pending").length} pending`} icon={Users} glow="green" />
        <StatCard title="Total Clients" value={clients.length.toString()} icon={Crown} glow="gold" />
      </div>

      {/* Recent Activity */}
      <div className="glass-card p-5">
        <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-primary" />
          Recent Sessions
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left py-3 px-2 font-medium">Type</th>
                <th className="text-left py-3 px-2 font-medium">Client</th>
                <th className="text-left py-3 px-2 font-medium">User</th>
                <th className="text-left py-3 px-2 font-medium">Duration</th>
                <th className="text-right py-3 px-2 font-medium">Client Spent</th>
                <th className="text-right py-3 px-2 font-medium">User Earned</th>
                <th className="text-left py-3 px-2 font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {chatLogs.slice(0, 5).map(log => (
                <tr key={log.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-2">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${log.type === "chat" ? "bg-info/15 text-info" : "bg-primary/15 text-primary"}`}>
                      {log.type}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-foreground">{log.clientName}</td>
                  <td className="py-3 px-2 text-foreground">{log.userName}</td>
                  <td className="py-3 px-2 text-muted-foreground">{log.duration} min</td>
                  <td className="py-3 px-2 text-right text-accent font-medium">₹{log.clientSpent}</td>
                  <td className="py-3 px-2 text-right text-success font-medium">₹{log.userEarned}</td>
                  <td className="py-3 px-2 text-muted-foreground text-xs">{log.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Recharges */}
      <div className="glass-card p-5">
        <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
          <IndianRupee className="w-4 h-4 text-accent" />
          Recent Recharges
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left py-3 px-2 font-medium">Client</th>
                <th className="text-right py-3 px-2 font-medium">Amount</th>
                <th className="text-left py-3 px-2 font-medium">Method</th>
                <th className="text-left py-3 px-2 font-medium">Status</th>
                <th className="text-left py-3 px-2 font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {recharges.slice(0, 5).map(r => (
                <tr key={r.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-2 text-foreground">{r.clientName}</td>
                  <td className="py-3 px-2 text-right text-accent font-medium">₹{r.amount}</td>
                  <td className="py-3 px-2 text-muted-foreground">{r.method}</td>
                  <td className="py-3 px-2"><StatusBadge status={r.status} /></td>
                  <td className="py-3 px-2 text-muted-foreground text-xs">{r.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </DashboardLayout>
);

export default Dashboard;
