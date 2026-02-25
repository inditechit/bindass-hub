import { Link, useLocation, useNavigate } from "react-router-dom"; // Added useNavigate
import {
  LayoutDashboard,
  Users,
  UserCog,
  MessageSquare,
  CreditCard,
  Mic,
  Settings,
  TrendingUp,
  Crown,
  LogOut, // Added LogOut icon
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Agents", icon: UserCog, path: "/agents" },
  { label: "Users", icon: Users, path: "/users" },
  { label: "Clients", icon: Crown, path: "/clients" },
  { label: "Chat & Call Logs", icon: MessageSquare, path: "/logs" },
  { label: "Audio Verification", icon: Mic, path: "/audio-verification" },
  { label: "Recharge Tracking", icon: CreditCard, path: "/recharges" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

const AppSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Hook for redirection

  const handleLogout = () => {
    // 1. Clear all auth data
    localStorage.removeItem("astro_admin_token");
    localStorage.removeItem("astro_user");
    
    // 2. Redirect to login page
    navigate("/login");
  };

  return (
    <aside className="sidebar-gradient w-64 min-h-screen border-r border-sidebar-border flex flex-col fixed left-0 top-0 z-30">
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="font-display text-xl font-bold gradient-text">Bindass Chat</h1>
        <p className="text-xs text-muted-foreground mt-1">Super Admin Panel</p>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/15 text-primary border border-primary/20"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer Section with Logout */}
      <div className="p-4 border-t border-sidebar-border space-y-3">
        {/* Profile Card */}
        <div className="glass-card p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
            SA
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">Super Admin</p>
            <p className="text-[10px] text-muted-foreground truncate">admin@bindass.chat</p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors group"
        >
          <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;