import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Agents from "./pages/Agents";
import UsersPage from "./pages/UsersPage";
import Clients from "./pages/Clients";
import ChatLogs from "./pages/ChatLogs";
import AudioVerification from "./pages/AudioVerification";
import Recharges from "./pages/Recharges";
import CommissionEngine from "./pages/CommissionEngine";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/logs" element={<ChatLogs />} />
          <Route path="/audio-verification" element={<AudioVerification />} />
          <Route path="/recharges" element={<Recharges />} />
          <Route path="/commission" element={<CommissionEngine />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
