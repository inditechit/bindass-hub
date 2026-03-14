import { useState, useEffect } from "react";
import { IndianRupee, User, Trash2 } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";

interface CoinPackage {
  id: number;
  rupees: number;
  coins: number;
  user_id?: number;
  user_email?: string;
}

interface UserListItem {
  id: number;
  email: string;
}

const CoinManagement = () => {
  const [packages, setPackages] = useState<CoinPackage[]>([]);
  const [form, setForm] = useState({ rupees: "", coins: "", user: "" });
  const [isAdding, setIsAdding] = useState(false);
  const [allUsers, setAllUsers] = useState<UserListItem[]>([]);

  const API_BASE = "https://astroapi.inditechit.com/api";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const loadData = async () => {
    try {
      const userRes = await fetch(`${API_BASE}/get_users`);
      const userJson = await userRes.json();
      if (userJson.status === 200) {
        setAllUsers(userJson.data.map((u: any) => ({ id: u.id, email: u.email })));
      }

      const pkgRes = await fetch(`${API_BASE}/get_coin_packages`);
      const pkgJson = await pkgRes.json();
      if (pkgJson.status === 200) {
        setPackages(pkgJson.data);
      }
    } catch (e) {
      console.error("Failed to load data", e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);

    const selectedUser = allUsers.find((u) => u.email === form.user);
    const payload = {
      rupees: parseFloat(form.rupees),
      coins: parseInt(form.coins),
      user_id: selectedUser ? selectedUser.id : null,
    };

    try {
      const res = await fetch(`${API_BASE}/create_coin_package`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        await loadData();
        setForm({ rupees: "", coins: "", user: "" });
      }
    } catch (err) {
      alert("Error adding package");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this package?")) return;
    try {
      const res = await fetch(`${API_BASE}/delete_coin_package/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setPackages((p) => p.filter((pkg) => pkg.id !== id));
      }
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Coin Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Define coins granted per Rupee amount. Targets can be global or specific.
          </p>
        </div>

        {/* YOUR ORIGINAL GLASS-CARD FORM UI */}
        <div className="glass-card p-6 max-w-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Amount (₹)</label>
                <input
                  type="number"
                  name="rupees"
                  required
                  value={form.rupees}
                  onChange={handleChange}
                  className="w-full p-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="e.g. 100"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Coins</label>
                <input
                  type="number"
                  name="coins"
                  required
                  value={form.coins}
                  onChange={handleChange}
                  className="w-full p-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="e.g. 50"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Specific User (optional)</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  type="text"
                  name="user"
                  list="user-options"
                  value={form.user}
                  onChange={handleChange}
                  className="w-full pl-10 p-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Search user..."
                />
                <datalist id="user-options">
                  {allUsers.map((u) => <option key={u.id} value={u.email} />)}
                </datalist>
              </div>
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

        {/* TABLE VIEW FOR SHOWING DATA */}
        <div className="glass-card overflow-hidden border border-border rounded-xl">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground font-semibold border-b">
              <tr>
                <th className="p-4 uppercase tracking-wider">Amount</th>
                <th className="p-4 uppercase tracking-wider">Coins</th>
                <th className="p-4 uppercase tracking-wider">Target User</th>
                <th className="p-4 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {packages.slice() // Create a shallow copy to avoid mutating state directly
                .sort((a, b) => a.rupees - b.rupees) // Sort ascending: 10, 20, 50...
                .map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-muted/10 transition-colors">
                    <td className="p-4 font-medium text-foreground">₹{pkg.rupees}</td>
                    <td className="p-4 font-bold text-primary">{pkg.coins}</td>
                    <td className="p-4 text-muted-foreground">
                      {pkg.user_email ? (
                        <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs">
                          {pkg.user_email}
                        </span>
                      ) : (
                        <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs">
                          All Users
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(pkg.id)}
                        className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              {packages.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted-foreground">
                    No packages created yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CoinManagement;