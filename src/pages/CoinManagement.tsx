import { useState, useEffect } from "react";
import { IndianRupee, User } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";

interface CoinPackage {
  id: number;
  rupees: number;
  coins: number;
  user?: string; // email or identifier, undefined means available for everyone
}

const CoinManagement = () => {
  const [packages, setPackages] = useState<CoinPackage[]>([]);
  const [form, setForm] = useState({ rupees: "", coins: "", user: "" });
  const [isAdding, setIsAdding] = useState(false);
  const [allUsers, setAllUsers] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  useEffect(() => {
    // fetch user list once for selector
    const load = async () => {
      try {
        const res = await fetch("https://astroapi.inditechit.com/api/get_users");
        const json = await res.json();
        if (json.status === 200 && Array.isArray(json.data)) {
          const emails = json.data
            .filter((u: any) => u.type !== "agent")
            .map((u: any) => u.email)
            .filter(Boolean);
          setAllUsers(emails);
        }
      } catch (e) {
        console.error("Failed to load user list", e);
      }
    };
    load();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rupees = parseFloat(form.rupees);
    const coins = parseFloat(form.coins);
    if (isNaN(rupees) || isNaN(coins)) {
      alert("Please enter valid numeric values for rupees and coins.");
      return;
    }
    setIsAdding(true);
    const newPkg: CoinPackage = {
      id: Date.now(),
      rupees,
      coins,
      user: form.user.trim() || undefined,
    };
    setPackages((p) => [...p, newPkg]);
    setForm({ rupees: "", coins: "", user: "" });
    setIsAdding(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Coin Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Define how many coins should be granted for a given amount in rupees. You
            can target everyone or a specific user by email.
          </p>
        </div>

        {/* add form */}
        <div className="glass-card p-6 max-w-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  name="rupees"
                  required
                  value={form.rupees}
                  onChange={handleChange}
                  className="w-full p-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="e.g. 100"
                  min="0"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Coins
                </label>
                <input
                  type="number"
                  name="coins"
                  required
                  value={form.coins}
                  onChange={handleChange}
                  className="w-full p-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="e.g. 50"
                  min="0"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase">
                Specific User (optional)
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  type="text"
                  name="user"
                  list="user-options"
                  value={form.user}
                  onChange={handleChange}
                  className="w-full pl-10 p-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="start typing to search"
                />
                <datalist id="user-options">
                  {allUsers.map((email) => (
                    <option key={email} value={email} />
                  ))}
                </datalist>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Leave empty for everyone.
              </p>
            </div>

            <button
              type="submit"
              disabled={isAdding}
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-70"
            >
              {isAdding ? "Adding..." : "Create Package"}
            </button>
          </form>
        </div>

        {/* card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="glass-card p-4 flex flex-col justify-between space-y-2"
            >
              <div>
                <p className="text-xs text-muted-foreground uppercase">Amount</p>
                <p className="text-xl font-bold">₹{pkg.rupees}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase">Coins</p>
                <p className="text-xl font-bold">{pkg.coins}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase">Target</p>
                <p className="text-sm font-medium">
                  {pkg.user ? pkg.user : "All users"}
                </p>
              </div>
            </div>
          ))}
          {packages.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground">
              No packages defined yet.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CoinManagement;
