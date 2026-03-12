import { useState, useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Star, Clock, IndianRupee, Trophy } from "lucide-react";

interface Performer {
  id: number;
  name: string;
  loginTime: number;
  rating: number;
  date: string;
}

interface Client {
  id: number;
  name: string;
  recharge: number;
  used: number;
  date: string;
}

const Leaderboard = () => {

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // sample performers
  const performers: Performer[] = [
    { id: 1, name: "Alice", loginTime: 340, rating: 4.9, date: "2026-06-02" },
    { id: 2, name: "Bob", loginTime: 290, rating: 4.7, date: "2026-06-10" },
    { id: 3, name: "Charlie", loginTime: 250, rating: 4.6, date: "2026-07-03" },
    { id: 4, name: "Dana", loginTime: 210, rating: 4.5, date: "2026-07-15" }
  ];

  // sample clients
  const clients: Client[] = [
    { id: 1, name: "Rahul", recharge: 5000, used: 4200, date: "2026-06-05" },
    { id: 2, name: "Priya", recharge: 4000, used: 3500, date: "2026-06-12" },
    { id: 3, name: "Aman", recharge: 7000, used: 5200, date: "2026-07-02" },
    { id: 4, name: "Neha", recharge: 3500, used: 2900, date: "2026-07-20" }
  ];

  // date range filter
  const filteredPerformers = useMemo(() => {
    if (!startDate || !endDate) return performers;

    return performers.filter((p) => {
      const d = new Date(p.date);
      return d >= new Date(startDate) && d <= new Date(endDate);
    });
  }, [startDate, endDate]);

  const filteredClients = useMemo(() => {
    if (!startDate || !endDate) return clients;

    return clients.filter((c) => {
      const d = new Date(c.date);
      return d >= new Date(startDate) && d <= new Date(endDate);
    });
  }, [startDate, endDate]);

  // sorting
  const topPerformers = [...filteredPerformers].sort((a, b) => b.loginTime - a.loginTime);
  const topClients = [...filteredClients].sort((a, b) => b.recharge - a.recharge);

  const formatLoginTime = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  return (
    <DashboardLayout>

      <div className="space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>
            <h1 className="text-2xl font-display font-bold">
              Leaderboard
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Top performers and top spending clients
            </p>
          </div>

          {/* Date Range Filter */}
          <div className="flex items-center gap-2">

            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-border rounded-lg px-3 py-2 text-sm bg-muted"
            />

            <span className="text-muted-foreground text-sm">
              to
            </span>

            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-border rounded-lg px-3 py-2 text-sm bg-muted"
            />

          </div>

        </div>

        {/* Leaderboard sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Performers */}
          <div className="glass-card p-5">

            <div className="flex items-center gap-2 mb-4">
              <Trophy className="text-yellow-500" />
              <h2 className="font-bold text-lg">
                Top Performers
              </h2>
            </div>

            <div className="overflow-x-auto">

              <table className="w-full text-sm">

                <thead>
                  <tr className="border-b border-border text-muted-foreground text-left">
                    <th className="py-3 px-2">Rank</th>
                    <th className="py-3 px-2">User</th>
                    <th className="py-3 px-2">Login Time</th>
                    <th className="py-3 px-2">Rating</th>
                  </tr>
                </thead>

                <tbody>
                  {topPerformers.map((p, index) => (

                    <tr
                      key={p.id}
                      className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                    >

                      <td className="py-3 px-2 font-bold">
                        #{index + 1}
                      </td>

                      <td className="py-3 px-2">
                        {p.name}
                      </td>

                      <td className="py-3 px-2 flex items-center gap-1">
                        <Clock size={14} />
                        {formatLoginTime(p.loginTime)}
                      </td>

                      <td className="py-3 px-2 flex items-center gap-1 text-yellow-500">
                        <Star size={14} />
                        {p.rating}
                      </td>

                    </tr>

                  ))}
                </tbody>

              </table>

            </div>

          </div>

          {/* Clients */}
          <div className="glass-card p-5">

            <div className="flex items-center gap-2 mb-4">
              <IndianRupee className="text-green-500" />
              <h2 className="font-bold text-lg">
                Top Clients
              </h2>
            </div>

            <div className="overflow-x-auto">

              <table className="w-full text-sm">

                <thead>
                  <tr className="border-b border-border text-muted-foreground text-left">
                    <th className="py-3 px-2">Rank</th>
                    <th className="py-3 px-2">Client</th>
                    <th className="py-3 px-2">Recharge</th>
                    <th className="py-3 px-2">Used</th>
                  </tr>
                </thead>

                <tbody>
                  {topClients.map((c, index) => (

                    <tr
                      key={c.id}
                      className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                    >

                      <td className="py-3 px-2 font-bold">
                        #{index + 1}
                      </td>

                      <td className="py-3 px-2">
                        {c.name}
                      </td>

                      <td className="py-3 px-2 text-green-500 font-semibold">
                        ₹{c.recharge}
                      </td>

                      <td className="py-3 px-2 text-primary font-semibold">
                        ₹{c.used}
                      </td>

                    </tr>

                  ))}
                </tbody>

              </table>

            </div>

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
};

export default Leaderboard;