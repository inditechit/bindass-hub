// Mock data for Bindass Chat Admin

export interface Agent {
  id: string;
  name: string;
  phone: string;
  teamSize: number;
  totalEarnings: number;
  walletBalance: number;
  commissionRate: number;
  status: "active" | "inactive";
  joinedAt: string;
}

export interface UserCommissionSplit {
  clientRate: number; // what client pays per minute
  adminShare: number;
  agentShare: number; // 0 for independent users
  userShare: number;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  type: "independent" | "agent";
  agentId?: string;
  agentName?: string;
  totalMinutes: number;
  totalEarned: number;
  rating: number;
  status: "active" | "pending" | "rejected" | "inactive";
  joinedAt: string;
  audioIntroUrl?: string;
  commission: UserCommissionSplit;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  coinBalance: number;
  totalSpent: number;
  rechargeCount: number;
  lastActive: string;
  joinedAt: string;
}

export interface ChatLog {
  id: string;
  type: "chat" | "call";
  clientId: string;
  clientName: string;
  userId: string;
  userName: string;
  duration: number; // minutes
  clientSpent: number;
  userEarned: number;
  agentEarned: number;
  adminEarned: number;
  timestamp: string;
  messages?: { sender: string; text: string; time: string }[];
}

export interface Recharge {
  id: string;
  clientId: string;
  clientName: string;
  amount: number;
  method: string;
  status: "success" | "failed" | "pending";
  timestamp: string;
}

export const defaultAgentSplit: UserCommissionSplit = {
  clientRate: 50,
  adminShare: 10,
  agentShare: 5,
  userShare: 35,
};

export const defaultIndependentSplit: UserCommissionSplit = {
  clientRate: 50,
  adminShare: 15,
  agentShare: 0,
  userShare: 35,
};

export const agents: Agent[] = [
  { id: "a1", name: "Rahul Sharma", phone: "+91 98765 43210", teamSize: 12, totalEarnings: 45000, walletBalance: 12500, commissionRate: 10, status: "active", joinedAt: "2024-11-15" },
  { id: "a2", name: "Priya Verma", phone: "+91 87654 32109", teamSize: 8, totalEarnings: 32000, walletBalance: 8900, commissionRate: 10, status: "active", joinedAt: "2024-12-01" },
  { id: "a3", name: "Amit Patel", phone: "+91 76543 21098", teamSize: 15, totalEarnings: 58000, walletBalance: 15200, commissionRate: 12, status: "active", joinedAt: "2024-10-20" },
  { id: "a4", name: "Sneha Gupta", phone: "+91 65432 10987", teamSize: 5, totalEarnings: 18000, walletBalance: 4500, commissionRate: 10, status: "inactive", joinedAt: "2025-01-05" },
];

export const users: User[] = [
  { id: "u1", name: "Ananya Singh", avatar: "AS", phone: "+91 99887 76655", type: "agent", agentId: "a1", agentName: "Rahul Sharma", totalMinutes: 2450, totalEarned: 85750, rating: 4.8, status: "active", joinedAt: "2024-11-20", commission: { clientRate: 50, adminShare: 10, agentShare: 5, userShare: 35 } },
  { id: "u2", name: "Kavya Reddy", avatar: "KR", phone: "+91 88776 65544", type: "independent", totalMinutes: 1890, totalEarned: 66150, rating: 4.5, status: "active", joinedAt: "2024-12-10", audioIntroUrl: "/audio-sample.mp3", commission: { clientRate: 50, adminShare: 15, agentShare: 0, userShare: 35 } },
  { id: "u3", name: "Meera Joshi", avatar: "MJ", phone: "+91 77665 54433", type: "agent", agentId: "a2", agentName: "Priya Verma", totalMinutes: 3200, totalEarned: 112000, rating: 4.9, status: "active", joinedAt: "2024-11-05", commission: { clientRate: 60, adminShare: 12, agentShare: 8, userShare: 40 } },
  { id: "u4", name: "Ritu Nair", avatar: "RN", phone: "+91 66554 43322", type: "independent", totalMinutes: 560, totalEarned: 19600, rating: 4.2, status: "pending", joinedAt: "2025-01-15", audioIntroUrl: "/audio-sample.mp3", commission: { clientRate: 40, adminShare: 12, agentShare: 0, userShare: 28 } },
  { id: "u5", name: "Pooja Mehta", avatar: "PM", phone: "+91 55443 32211", type: "agent", agentId: "a3", agentName: "Amit Patel", totalMinutes: 1200, totalEarned: 42000, rating: 4.6, status: "active", joinedAt: "2025-01-02", commission: { clientRate: 50, adminShare: 10, agentShare: 7, userShare: 33 } },
  { id: "u6", name: "Deepa Rao", avatar: "DR", phone: "+91 44332 21100", type: "independent", totalMinutes: 340, totalEarned: 11900, rating: 3.9, status: "pending", joinedAt: "2025-02-01", audioIntroUrl: "/audio-sample.mp3", commission: { clientRate: 45, adminShare: 13, agentShare: 0, userShare: 32 } },
];

export const clients: Client[] = [
  { id: "c1", name: "Vikram Malhotra", phone: "+91 99001 12233", coinBalance: 2500, totalSpent: 45000, rechargeCount: 18, lastActive: "2025-02-21", joinedAt: "2024-10-01" },
  { id: "c2", name: "Rohan Kapoor", phone: "+91 88112 23344", coinBalance: 800, totalSpent: 28000, rechargeCount: 12, lastActive: "2025-02-20", joinedAt: "2024-11-15" },
  { id: "c3", name: "Sanjay Dubey", phone: "+91 77223 34455", coinBalance: 150, totalSpent: 12000, rechargeCount: 6, lastActive: "2025-02-18", joinedAt: "2025-01-01" },
  { id: "c4", name: "Arjun Iyer", phone: "+91 66334 45566", coinBalance: 5200, totalSpent: 78000, rechargeCount: 32, lastActive: "2025-02-22", joinedAt: "2024-09-10" },
  { id: "c5", name: "Manish Tiwari", phone: "+91 55445 56677", coinBalance: 0, totalSpent: 3500, rechargeCount: 2, lastActive: "2025-01-30", joinedAt: "2025-02-01" },
];

export const chatLogs: ChatLog[] = [
  { id: "cl1", type: "chat", clientId: "c1", clientName: "Vikram Malhotra", userId: "u1", userName: "Ananya Singh", duration: 45, clientSpent: 2250, userEarned: 1575, agentEarned: 225, adminEarned: 450, timestamp: "2025-02-22 14:30",
    messages: [
      { sender: "Vikram", text: "Hey, how are you?", time: "14:30" },
      { sender: "Ananya", text: "Hi Vikram! I'm great, thanks for asking 😊", time: "14:31" },
      { sender: "Vikram", text: "What are you up to today?", time: "14:32" },
      { sender: "Ananya", text: "Just relaxing at home. Tell me about your day!", time: "14:33" },
    ]
  },
  { id: "cl2", type: "call", clientId: "c4", clientName: "Arjun Iyer", userId: "u3", userName: "Meera Joshi", duration: 22, clientSpent: 1100, userEarned: 770, agentEarned: 110, adminEarned: 220, timestamp: "2025-02-22 13:15" },
  { id: "cl3", type: "chat", clientId: "c2", clientName: "Rohan Kapoor", userId: "u2", userName: "Kavya Reddy", duration: 30, clientSpent: 1500, userEarned: 1050, agentEarned: 0, adminEarned: 450, timestamp: "2025-02-22 12:00",
    messages: [
      { sender: "Rohan", text: "Good afternoon!", time: "12:00" },
      { sender: "Kavya", text: "Hey Rohan! Good to see you again", time: "12:01" },
    ]
  },
  { id: "cl4", type: "call", clientId: "c1", clientName: "Vikram Malhotra", userId: "u5", userName: "Pooja Mehta", duration: 15, clientSpent: 750, userEarned: 525, agentEarned: 75, adminEarned: 150, timestamp: "2025-02-21 19:45" },
  { id: "cl5", type: "chat", clientId: "c3", clientName: "Sanjay Dubey", userId: "u1", userName: "Ananya Singh", duration: 60, clientSpent: 3000, userEarned: 2100, agentEarned: 300, adminEarned: 600, timestamp: "2025-02-21 16:20" },
];

export const recharges: Recharge[] = [
  { id: "r1", clientId: "c4", clientName: "Arjun Iyer", amount: 5000, method: "UPI", status: "success", timestamp: "2025-02-22 10:30" },
  { id: "r2", clientId: "c1", clientName: "Vikram Malhotra", amount: 2000, method: "Card", status: "success", timestamp: "2025-02-22 09:15" },
  { id: "r3", clientId: "c2", clientName: "Rohan Kapoor", amount: 1000, method: "UPI", status: "success", timestamp: "2025-02-21 18:00" },
  { id: "r4", clientId: "c5", clientName: "Manish Tiwari", amount: 500, method: "UPI", status: "failed", timestamp: "2025-02-21 15:30" },
  { id: "r5", clientId: "c3", clientName: "Sanjay Dubey", amount: 1500, method: "Card", status: "success", timestamp: "2025-02-20 12:00" },
  { id: "r6", clientId: "c4", clientName: "Arjun Iyer", amount: 3000, method: "Net Banking", status: "success", timestamp: "2025-02-19 11:00" },
];
