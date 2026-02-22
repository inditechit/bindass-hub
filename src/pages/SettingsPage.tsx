import { Settings } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";

const SettingsPage = () => (
  <DashboardLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Platform configuration</p>
      </div>
      <div className="glass-card p-8 text-center">
        <Settings className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Settings page coming soon. Configure platform preferences, notification settings, and more.</p>
      </div>
    </div>
  </DashboardLayout>
);

export default SettingsPage;
