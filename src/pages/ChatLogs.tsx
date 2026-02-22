import { MessageSquare, Phone, Eye } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatusBadge from "@/components/shared/StatusBadge";
import { chatLogs } from "@/data/mockData";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { ChatLog } from "@/data/mockData";

const ChatLogs = () => {
  const [search, setSearch] = useState("");
  const [selectedLog, setSelectedLog] = useState<ChatLog | null>(null);

  const filtered = chatLogs.filter(l =>
    l.clientName.toLowerCase().includes(search.toLowerCase()) ||
    l.userName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold">Chat & Call Logs</h1>
            <p className="text-sm text-muted-foreground mt-1">Searchable master list of all interactions</p>
          </div>
          <Input
            placeholder="Search by client or user name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-72 bg-muted/50 border-border"
          />
        </div>

        <div className="glass-card p-5">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left py-3 px-2 font-medium">Type</th>
                  <th className="text-left py-3 px-2 font-medium">Client</th>
                  <th className="text-left py-3 px-2 font-medium">User</th>
                  <th className="text-left py-3 px-2 font-medium">Duration</th>
                  <th className="text-right py-3 px-2 font-medium">Client Spent</th>
                  <th className="text-right py-3 px-2 font-medium">User Earned</th>
                  <th className="text-right py-3 px-2 font-medium">Agent Earned</th>
                  <th className="text-right py-3 px-2 font-medium">Admin Earned</th>
                  <th className="text-left py-3 px-2 font-medium">Time</th>
                  <th className="text-center py-3 px-2 font-medium">View</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(log => (
                  <tr key={log.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-1.5">
                        {log.type === "chat" ? <MessageSquare className="w-3.5 h-3.5 text-info" /> : <Phone className="w-3.5 h-3.5 text-primary" />}
                        <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${log.type === "chat" ? "bg-info/15 text-info" : "bg-primary/15 text-primary"}`}>
                          {log.type}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-foreground">{log.clientName}</td>
                    <td className="py-3 px-2 text-foreground">{log.userName}</td>
                    <td className="py-3 px-2 text-muted-foreground">{log.duration} min</td>
                    <td className="py-3 px-2 text-right text-accent font-medium">₹{log.clientSpent}</td>
                    <td className="py-3 px-2 text-right text-success font-medium">₹{log.userEarned}</td>
                    <td className="py-3 px-2 text-right text-primary font-medium">₹{log.agentEarned}</td>
                    <td className="py-3 px-2 text-right text-warning font-medium">₹{log.adminEarned}</td>
                    <td className="py-3 px-2 text-muted-foreground text-xs">{log.timestamp}</td>
                    <td className="py-3 px-2 text-center">
                      <button onClick={() => setSelectedLog(log)} className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="bg-card border-glass-border max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2">
              {selectedLog?.type === "chat" ? <MessageSquare className="w-4 h-4 text-info" /> : <Phone className="w-4 h-4 text-primary" />}
              Session Details
            </DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="glass-card p-3">
                  <p className="text-xs text-muted-foreground">Client</p>
                  <p className="font-medium text-foreground">{selectedLog.clientName}</p>
                </div>
                <div className="glass-card p-3">
                  <p className="text-xs text-muted-foreground">User</p>
                  <p className="font-medium text-foreground">{selectedLog.userName}</p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <div className="glass-card p-2 text-center">
                  <p className="text-[10px] text-muted-foreground">Duration</p>
                  <p className="text-sm font-bold text-foreground">{selectedLog.duration}m</p>
                </div>
                <div className="glass-card p-2 text-center">
                  <p className="text-[10px] text-muted-foreground">Spent</p>
                  <p className="text-sm font-bold text-accent">₹{selectedLog.clientSpent}</p>
                </div>
                <div className="glass-card p-2 text-center">
                  <p className="text-[10px] text-muted-foreground">User Got</p>
                  <p className="text-sm font-bold text-success">₹{selectedLog.userEarned}</p>
                </div>
                <div className="glass-card p-2 text-center">
                  <p className="text-[10px] text-muted-foreground">Admin</p>
                  <p className="text-sm font-bold text-warning">₹{selectedLog.adminEarned}</p>
                </div>
              </div>
              {selectedLog.messages ? (
                <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-thin">
                  <p className="text-xs text-muted-foreground font-medium">Chat History</p>
                  {selectedLog.messages.map((m, i) => (
                    <div key={i} className={`glass-card p-2.5 ${m.sender === selectedLog.clientName ? "" : "ml-6"}`}>
                      <p className="text-[10px] text-primary font-medium">{m.sender} • {m.time}</p>
                      <p className="text-sm text-foreground mt-0.5">{m.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass-card p-4 text-center">
                  <Phone className="w-8 h-8 mx-auto text-primary mb-2" />
                  <p className="text-sm text-muted-foreground">Voice call — {selectedLog.duration} minutes</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default ChatLogs;
