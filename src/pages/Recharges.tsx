import { CreditCard, IndianRupee, TrendingUp } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/shared/StatCard";
import StatusBadge from "@/components/shared/StatusBadge";
import { recharges } from "@/data/mockData";

const successTotal = recharges.filter(r => r.status === "success").reduce((s, r) => s + r.amount, 0);

const Recharges = () => (
  <DashboardLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Recharge Tracking</h1>
        <p className="text-sm text-muted-foreground mt-1">All client payment transactions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Recharges" value={recharges.length.toString()} icon={CreditCard} glow="purple" />
        <StatCard title="Total Collected" value={`₹${successTotal.toLocaleString()}`} icon={IndianRupee} glow="gold" />
        <StatCard title="Failed" value={recharges.filter(r => r.status === "failed").length.toString()} icon={TrendingUp} glow="green" />
      </div>

      <div className="glass-card p-5">
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
              {recharges.map(r => (
                <tr key={r.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-2 font-medium text-foreground">{r.clientName}</td>
                  <td className="py-3 px-2 text-right text-accent font-medium">₹{r.amount.toLocaleString()}</td>
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

export default Recharges;
