import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  glow?: "purple" | "gold" | "green";
}

const StatCard = ({ title, value, subtitle, icon: Icon, glow = "purple" }: StatCardProps) => {
  const glowClass = {
    purple: "stat-glow-purple",
    gold: "stat-glow-gold",
    green: "stat-glow-green",
  }[glow];

  return (
    <div className={cn("glass-card p-5 animate-slide-in", glowClass)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-display font-bold mt-2 text-foreground">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center",
          glow === "purple" && "bg-primary/15 text-primary",
          glow === "gold" && "bg-accent/15 text-accent",
          glow === "green" && "bg-success/15 text-success",
        )}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
