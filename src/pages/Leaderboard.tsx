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

interface DailyActivity {
  date: string;
  minutes: number;
}

const Leaderboard = () => {

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [selectedUser, setSelectedUser] = useState<Performer | null>(null);
  const [showModal, setShowModal] = useState(false);

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

  // filter performers
  const filteredPerformers = useMemo(() => {
    if (!startDate || !endDate) return performers;

    return performers.filter((p) => {
      const d = new Date(p.date);
      return d >= new Date(startDate) && d <= new Date(endDate);
    });

  }, [startDate, endDate]);

  // filter clients
  const filteredClients = useMemo(() => {
    if (!startDate || !endDate) return clients;

    return clients.filter((c) => {
      const d = new Date(c.date);
      return d >= new Date(startDate) && d <= new Date(endDate);
    });

  }, [startDate, endDate]);

  const topPerformers = [...filteredPerformers].sort(
    (a, b) => b.loginTime - a.loginTime
  );

  const topClients = [...filteredClients].sort(
    (a, b) => b.recharge - a.recharge
  );

  const formatLoginTime = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  // generate last 20 days data
  const generateActivity = (): DailyActivity[] => {
    const data: DailyActivity[] = [];

    for (let i = 0; i < 20; i++) {

      const date = new Date();
      date.setDate(date.getDate() - i);

      data.push({
        date: date.toISOString().split("T")[0],
        minutes: Math.floor(Math.random() * 300)
      });
    }

    return data;
  };

  const activity = selectedUser ? generateActivity() : [];

  return (
    <DashboardLayout>

      <div className="space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>
            <h1 className="text-2xl font-bold">
              Leaderboard
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Top performers and top clients
            </p>
          </div>

          {/* Date Filter */}
          <div className="flex items-center gap-2">

            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            />

            <span>to</span>

            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            />

          </div>

        </div>

        {/* Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Performers */}
          <div className="glass-card p-5">

            <div className="flex items-center gap-2 mb-4">
              <Trophy className="text-yellow-500" />
              <h2 className="font-bold text-lg">
                Top Performers
              </h2>
            </div>

            <table className="w-full text-sm">

              <thead>
                <tr className="border-b text-left">
                  <th className="py-3 px-2">Rank</th>
                  <th className="py-3 px-2">User</th>
                  <th className="py-3 px-2">Login Time</th>
                  {/* <th className="py-3 px-2">Rating</th> */}
                  <th className="py-3 px-2">Action</th>
                </tr>
              </thead>

              <tbody>

                {topPerformers.map((p, index) => (

                  <tr key={p.id} className="border-b">

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

                    <td className="py-3 px-2">

                      <button
                        className="text-xs bg-primary text-white px-3 py-1 rounded"
                        onClick={() => {
                          setSelectedUser(p);
                          setShowModal(true);
                        }}
                      >
                        View Details
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          {/* Clients */}
          <div className="glass-card p-5">

            <div className="flex items-center gap-2 mb-4">
              <IndianRupee className="text-green-500" />
              <h2 className="font-bold text-lg">
                Top Clients
              </h2>
            </div>

            <table className="w-full text-sm">

              <thead>
                <tr className="border-b text-left">
                  <th className="py-3 px-2">Rank</th>
                  <th className="py-3 px-2">Client</th>
                  <th className="py-3 px-2">Recharge</th>
                  <th className="py-3 px-2">Used</th>
                </tr>
              </thead>

              <tbody>

                {topClients.map((c, index) => (

                  <tr key={c.id} className="border-b">

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

      {/* Modal */}
      {showModal && selectedUser && (

  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

    <div className="bg-white text-black rounded-xl p-6 w-[500px] max-h-[500px] overflow-y-auto shadow-lg">

      <h2 className="text-lg font-bold mb-4 text-black">
        {selectedUser.name} - Last 20 Days Activity
      </h2>

      <table className="w-full text-sm">

        <thead>
          <tr className="border-b border-gray-300 text-gray-700">
            <th className="py-2 text-left">Date</th>
            <th className="py-2 text-left">Login Time</th>
          </tr>
        </thead>

        <tbody>

          {activity.map((a, i) => (

            <tr key={i} className="border-b border-gray-200">

              <td className="py-2 text-gray-800">
                {a.date}
              </td>

              <td className="py-2 text-gray-800">
                {formatLoginTime(a.minutes)}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

      <button
        onClick={() => setShowModal(false)}
        className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
      >
        Close
      </button>

    </div>

  </div>

)}

    </DashboardLayout>
  );
};

export default Leaderboard;