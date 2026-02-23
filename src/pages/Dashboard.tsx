import { useEffect, useState } from "react";
import { IndianRupee, Users, UserCog, Crown, MessageSquare, TrendingUp, History } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/shared/StatCard";
import StatusBadge from "@/components/shared/StatusBadge";

// --- API Types ---
interface ChatSession {
  id: number;
  user_id: string;
  astrologer_id: number;
  status: string;
  created_at: string;
}

interface Transaction {
  id: number;
  user_id: number;
  astrologer_id: number;
  session_id: number | null;
  transaction_type: string;
  amount: number;
  status: any;
  transaction_date: string;
  reason: string;
}

const Dashboard = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch both APIs via your proxy to avoid CORS
        const [sessionRes, transRes] = await Promise.all([
          fetch("https://astroapi.inditechit.com/api/get_chat_session"),
          fetch("https://astroapi.inditechit.com/api/get_transaction")
        ]);

        const sessionJson = await sessionRes.json();
        const transJson = await transRes.json();

        if (sessionJson.status === 200 && transJson.status === 200) {
          setSessions(sessionJson.data);
          setTransactions(transJson.data);
        }
      } catch (error) {
        console.error("Dashboard Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // --- Financial Calculations ---
  // Total Revenue: All successful debits from users
  const totalRevenue = transactions
    .filter(t => t.transaction_type === 'debit' && t.status === 'success')
    .reduce((acc, t) => acc + t.amount, 0);

  // Gifts: Sum of gift_debit transactions
  const totalGifts = transactions
    .filter(t => t.transaction_type === 'gift_debit')
    .reduce((acc, t) => acc + t.amount, 0);

  // Recent merged activity: Link transactions to sessions
  const mergedActivity = sessions.slice(0, 10).map(s => {
    const sessionData = s.chatSession;
    const matchingTrans = transactions.find(t => t.session_id === sessionData.id);
    return {
      id: sessionData.id,
      userId: sessionData.user_id,
      astroId: sessionData.astrologer_id,
      status: sessionData.status,
      time: sessionData.created_at,
      amount: matchingTrans?.amount || 0,
      type: matchingTrans?.transaction_type || 'N/A'
    };
  });

  if (loading) return <div className="p-10 text-center animate-pulse">Loading Analytics...</div>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Live Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time session and transaction monitoring</p>
        </div>

        {/* --- Dynamic Stats Section --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total Revenue" 
            value={`₹${totalRevenue.toLocaleString()}`} 
            subtitle="Successful Debits" 
            icon={IndianRupee} 
            glow="gold" 
          />
          <StatCard 
            title="Gift Revenue" 
            value={`₹${totalGifts.toLocaleString()}`} 
            subtitle="Sent to Performers" 
            icon={TrendingUp} 
            glow="purple" 
          />
          <StatCard 
            title="Active Sessions" 
            value={sessions.filter(s => s.chatSession.status === "In Progress").length.toString()} 
            subtitle="Currently Live" 
            icon={MessageSquare} 
            glow="green" 
          />
          <StatCard 
            title="Success Rate" 
            value={`${((transactions.filter(t => t.status === 'success').length / transactions.length) * 100).toFixed(1)}%`} 
            subtitle="Txn Success" 
            icon={Users} 
            glow="purple" 
          />
        </div>

        {/* --- Recent Activity Table --- */}
        <div className="glass-card p-5">
          <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
            <History className="w-4 h-4 text-primary" />
            Recent Chat Sessions & Payments
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left py-3 px-2 font-medium">Session ID</th>
                  <th className="text-left py-3 px-2 font-medium">User ID</th>
                  <th className="text-left py-3 px-2 font-medium">Performer ID</th>
                  <th className="text-left py-3 px-2 font-medium">Status</th>
                  <th className="text-right py-3 px-2 font-medium">Session Cost</th>
                  <th className="text-left py-3 px-2 font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {mergedActivity.map(act => (
                  <tr key={act.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-2 font-mono text-xs">#{act.id}</td>
                    <td className="py-3 px-2 text-foreground">Client {act.userId}</td>
                    <td className="py-3 px-2 text-foreground">User {act.astroId}</td>
                    <td className="py-3 px-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${act.status === 'In Progress' ? 'bg-green-500/20 text-green-500' : 'bg-muted text-muted-foreground'}`}>
                            {act.status}
                        </span>
                    </td>
                    <td className="py-3 px-2 text-right text-accent font-bold">₹{act.amount}</td>
                    <td className="py-3 px-2 text-muted-foreground text-xs">
                        {new Date(act.time).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- Recent Transactions Feed --- */}
        <div className="glass-card p-5">
          <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-accent" />
            Live Transaction Feed
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left py-3 px-2 font-medium">Reason</th>
                  <th className="text-right py-3 px-2 font-medium">Amount</th>
                  <th className="text-left py-3 px-2 font-medium">Type</th>
                  <th className="text-left py-3 px-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 8).map(t => (
                  <tr key={t.id} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="py-3 px-2 text-foreground font-medium">{t.reason}</td>
                    <td className={`py-3 px-2 text-right font-bold ${t.transaction_type === 'debit' ? 'text-red-400' : 'text-green-400'}`}>
                      {t.transaction_type === 'debit' ? '-' : '+'}₹{t.amount}
                    </td>
                    <td className="py-3 px-2 text-muted-foreground capitalize text-xs">{t.transaction_type.replace('_', ' ')}</td>
                    <td className="py-3 px-2"><StatusBadge status={t.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;