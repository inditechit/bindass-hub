import { Mic, CheckCircle, XCircle } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatusBadge from "@/components/shared/StatusBadge";
import { users } from "@/data/mockData";
import { useState } from "react";

const AudioVerification = () => {
  const independentUsers = users.filter(u => u.type === "independent");
  const [statuses, setStatuses] = useState<Record<string, string>>({});

  const handleAction = (userId: string, action: "active" | "rejected") => {
    setStatuses(prev => ({ ...prev, [userId]: action }));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Audio Verification</h1>
          <p className="text-sm text-muted-foreground mt-1">Review audio intros from independent users</p>
        </div>

        <div className="grid gap-4">
          {independentUsers.map(u => {
            const currentStatus = statuses[u.id] || u.status;
            return (
              <div key={u.id} className="glass-card-hover p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold">
                      {u.avatar}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{u.name}</p>
                      <p className="text-xs text-muted-foreground">{u.phone}</p>
                      <div className="mt-1">
                        <StatusBadge status={currentStatus as any} />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Audio Player */}
                    <div className="glass-card p-2 flex items-center gap-2">
                      <Mic className="w-4 h-4 text-primary" />
                      <audio controls className="h-8 w-48" style={{ filter: "invert(1) hue-rotate(180deg)" }}>
                        <source src="https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3" type="audio/mpeg" />
                      </audio>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAction(u.id, "active")}
                        className={`p-2 rounded-lg transition-colors ${currentStatus === "active" ? "bg-success/20 text-success" : "hover:bg-success/10 text-muted-foreground hover:text-success"}`}
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleAction(u.id, "rejected")}
                        className={`p-2 rounded-lg transition-colors ${currentStatus === "rejected" ? "bg-destructive/20 text-destructive" : "hover:bg-destructive/10 text-muted-foreground hover:text-destructive"}`}
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AudioVerification;
