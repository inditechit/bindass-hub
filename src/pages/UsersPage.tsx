import { Users as UsersIcon, Star, Clock } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/shared/StatCard";
import StatusBadge from "@/components/shared/StatusBadge";
import { users } from "@/data/mockData";

const UsersPage = () => (
  <DashboardLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">User Management</h1>
        <p className="text-sm text-muted-foreground mt-1">View all performers and their stats</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Users" value={users.length.toString()} icon={UsersIcon} glow="purple" />
        <StatCard title="Total Minutes" value={users.reduce((s, u) => s + u.totalMinutes, 0).toLocaleString()} icon={Clock} glow="green" />
        <StatCard title="Avg Rating" value={(users.reduce((s, u) => s + u.rating, 0) / users.length).toFixed(1)} icon={Star} glow="gold" />
      </div>

      <div className="glass-card p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left py-3 px-2 font-medium">User</th>
                <th className="text-left py-3 px-2 font-medium">Type</th>
                <th className="text-left py-3 px-2 font-medium">Agent</th>
                <th className="text-right py-3 px-2 font-medium">Minutes</th>
                <th className="text-right py-3 px-2 font-medium">Total Earned</th>
                <th className="text-center py-3 px-2 font-medium">Rating</th>
                <th className="text-left py-3 px-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-primary text-xs font-bold">
                        {u.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{u.name}</p>
                        <p className="text-[11px] text-muted-foreground">{u.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${u.type === "agent" ? "bg-primary/15 text-primary" : "bg-accent/15 text-accent"}`}>
                      {u.type === "agent" ? "Agent Team" : "Independent"}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-muted-foreground">{u.agentName || "—"}</td>
                  <td className="py-3 px-2 text-right text-foreground">{u.totalMinutes.toLocaleString()}</td>
                  <td className="py-3 px-2 text-right text-accent font-medium">₹{u.totalEarned.toLocaleString()}</td>
                  <td className="py-3 px-2 text-center text-warning">⭐ {u.rating}</td>
                  <td className="py-3 px-2"><StatusBadge status={u.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </DashboardLayout>
);

export default UsersPage;
