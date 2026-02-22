import { cn } from "@/lib/utils";

type Status = "active" | "inactive" | "pending" | "rejected" | "success" | "failed";

const statusStyles: Record<Status, string> = {
  active: "bg-success/15 text-success border-success/20",
  inactive: "bg-muted text-muted-foreground border-border",
  pending: "bg-warning/15 text-warning border-warning/20",
  rejected: "bg-destructive/15 text-destructive border-destructive/20",
  success: "bg-success/15 text-success border-success/20",
  failed: "bg-destructive/15 text-destructive border-destructive/20",
};

const StatusBadge = ({ status }: { status: Status }) => (
  <span className={cn("px-2.5 py-0.5 rounded-full text-[11px] font-medium border capitalize", statusStyles[status])}>
    {status}
  </span>
);

export default StatusBadge;
