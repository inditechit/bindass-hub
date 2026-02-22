import { Crown, IndianRupee, Coins } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/shared/StatCard";
import { clients } from "@/data/mockData";

const Clients = () => (
  <DashboardLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Client Records</h1>
        <p className="text-sm text-muted-foreground mt-1">All paying customers and their balances</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Clients" value={clients.length.toString()} icon={Crown} glow="gold" />
        <StatCard title="Total Spent" value={`₹${clients.reduce((s, c) => s + c.totalSpent, 0).toLocaleString()}`} icon={IndianRupee} glow="purple" />
        <StatCard title="Total Coin Balance" value={clients.reduce((s, c) => s + c.coinBalance, 0).toLocaleString()} icon={Coins} glow="green" />
      </div>

      <div className="glass-card p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left py-3 px-2 font-medium">Name</th>
                <th className="text-left py-3 px-2 font-medium">Phone</th>
                <th className="text-right py-3 px-2 font-medium">Coin Balance</th>
                <th className="text-right py-3 px-2 font-medium">Total Spent</th>
                <th className="text-center py-3 px-2 font-medium">Recharges</th>
                <th className="text-left py-3 px-2 font-medium">Last Active</th>
                <th className="text-left py-3 px-2 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {clients.sort((a, b) => b.totalSpent - a.totalSpent).map((c, i) => (
                <tr key={c.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      {i === 0 && <span className="text-accent" title="Top Spender">🐋</span>}
                      <span className="font-medium text-foreground">{c.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-muted-foreground">{c.phone}</td>
                  <td className="py-3 px-2 text-right text-primary font-medium">{c.coinBalance.toLocaleString()}</td>
                  <td className="py-3 px-2 text-right text-accent font-medium">₹{c.totalSpent.toLocaleString()}</td>
                  <td className="py-3 px-2 text-center text-foreground">{c.rechargeCount}</td>
                  <td className="py-3 px-2 text-muted-foreground text-xs">{c.lastActive}</td>
                  <td className="py-3 px-2 text-muted-foreground text-xs">{c.joinedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </DashboardLayout>
);

export default Clients;
