import { useEffect, useState } from "react";
import { CreditCard, IndianRupee, TrendingUp, Search, Loader2 } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/shared/StatCard";
import StatusBadge from "@/components/shared/StatusBadge";

interface RechargeData {
  id: number;
  user_id: number;
  amount: number;
  currency: string;
  status: any;
  transaction_date: string;
  order_id: string;
  user_name: string;
  reason: string;
  discount: string;
  created_at:any;
}

const Recharges = () => {
  const [recharges, setRecharges] = useState<RechargeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("253"); // Default ID
  const [searchInput, setSearchInput] = useState("253");

  const fetchRecharges = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`https://astroapi.inditechit.com/api/get_recharge/${id}`);
      const json = await response.json();
      if (json.status === 200) {
        setRecharges(json.data);
      } else {
        setRecharges([]);
      }
    } catch (error) {
      console.error("Error fetching recharges:", error);
      setRecharges([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecharges(userId);
  }, [userId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setUserId(searchInput);
  };

  // Dynamic Stats
  const successTotal = recharges
    .filter((r) => r.status === "success")
    .reduce((s, r) => s + r.amount, 0);

  const pendingCount = recharges.filter((r) => r.status === "pending").length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold">Recharge Tracking</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Monitoring payments for User ID: <span className="text-primary font-bold">#{userId}</span>
            </p>
          </div>

          {/* User Filter */}
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Enter User ID (e.g. 253)"
                className="bg-muted/50 border border-border rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Filter
            </button>
          </form>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Total Requests"
            value={recharges.length.toString()}
            icon={CreditCard}
            glow="purple"
          />
          <StatCard
            title="Total Success"
            value={`₹${successTotal.toLocaleString()}`}
            icon={IndianRupee}
            glow="gold"
          />
          <StatCard
            title="Pending/Failed"
            value={pendingCount.toString()}
            icon={TrendingUp}
            glow="green"
          />
        </div>

        <div className="glass-card p-5">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              <p>Fetching transaction history...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground text-left">
                    <th className="py-3 px-2 font-medium">User / Order ID</th>
                    <th className="py-3 px-2 font-medium">Reason</th>
                    <th className="py-3 px-2 text-right font-medium">Amount</th>
                    <th className="py-3 px-2 text-center font-medium">Discount</th>
                    <th className="py-3 px-2 font-medium">Status</th>
                    <th className="py-3 px-2 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recharges.length > 0 ? (
                    recharges.map((r) => (
                      <tr
                        key={r.id}
                        className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                      >
                        <td className="py-3 px-2">
                          <p className="font-medium text-foreground">
                            {r.user_name}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-mono">
                            {r.order_id}
                          </p>
                        </td>
                        <td className="py-3 px-2 text-muted-foreground italic">
                          {r.reason}
                        </td>
                        <td className="py-3 px-2 text-right text-accent font-bold">
                          ₹{r.amount.toLocaleString()}
                        </td>
                        <td className="py-3 px-2 text-center">
                          {r.discount ? (
                            <span className="text-green-500 text-xs font-medium">
                              -₹{r.discount}
                            </span>
                          ) : (
                            <span className="text-muted-foreground text-xs">—</span>
                          )}
                        </td>
                        <td className="py-3 px-2">
                          <StatusBadge status={r.status} />
                        </td>
                        <td className="py-3 px-2 text-muted-foreground text-xs">
                          {new Date(r.created_at).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-muted-foreground italic">
                        No recharge records found for this User ID.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Recharges;