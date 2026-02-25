import { Link, useLocation } from "react-router-dom";
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
  // { label: "Commission Engine", icon: TrendingUp, path: "/commission" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

const AppSidebar = () => {
  const location = useLocation();

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

      <div className="p-4 border-t border-sidebar-border">
        <div className="glass-card p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
            SA
          </div>
          <div>
            <p className="text-xs font-medium text-foreground">Super Admin</p>
            <p className="text-[10px] text-muted-foreground">admin@bindass.chat</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
