export type MarketStatus = "Open" | "Live" | "Resolved" | "Canceled";
export type TradeStatus = "Open" | "Canceled" | "Settled";
export type DepositStatus = "Pending" | "Approved" | "Rejected";
export type WithdrawalStatus = "Pending" | "Approved" | "Rejected";
export type KycStatus = "Not Submitted" | "Pending" | "Approved" | "Rejected";

export interface Market {
  id: string;
  title: string;
  sportType: string;
  options: string[];
  optionProbabilities: number[];
  status: MarketStatus;
  resolveOption: string | null;
  startTime: string;
  endTime: string;
  totalVolume: number;
  league: string;
  teams: string[];
  liveScore: string;
  description: string;
}

export interface Trade {
  id: string;
  userId: string;
  marketId: string;
  selectedOption: string;
  amount: number;
  potentialPayout: number;
  odds: string;
  status: TradeStatus;
  adminNotified: boolean;
  createdAt: string;
}

export interface DepositRequest {
  id: string;
  userId: string;
  ethTxHash: string;
  usdgAmount: number;
  walletAddress: string;
  status: DepositStatus;
  bonusGiven: boolean;
  bonusAmount: number;
  createdAt: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  usdgAmount: number;
  walletAddress: string;
  status: WithdrawalStatus;
  createdAt: string;
}

export interface AdminNotification {
  id: string;
  type: string;
  message: string;
  userId: string;
  isRead: boolean;
  createdAt: string;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: string;
  category: string;
}

export interface DepositAddress {
  id: string;
  label: string;
  address: string;
  chain: string;
}

export interface KycRequest {
  id: string;
  userId: string;
  documentUrl: string;
  status: KycStatus;
  createdAt: string;
}

export interface UserState {
  id: string;
  name: string;
  email: string;
  usdgBalance: number;
  bonusBalance: number;
  totalDeposited: number;
  totalTraded: number;
  turnoverCompleted: number;
  isBanned: boolean;
  kycStatus: KycStatus;
  role: "user" | "admin";
}

export const initialMarkets: Market[] = [
  {
    id: "m1",
    title: "Will Real Madrid win the next La Liga match?",
    sportType: "Football",
    options: ["Yes", "No"],
    optionProbabilities: [62, 38],
    status: "Live",
    resolveOption: null,
    startTime: "Now",
    endTime: "Today 21:30",
    totalVolume: 185000,
    league: "La Liga",
    teams: ["Real Madrid", "Atletico Madrid"],
    liveScore: "2 - 1",
    description: "High-liquidity market on the latest top-tier football fixture.",
  },
  {
    id: "m2",
    title: "Will the Chiefs cover the spread?",
    sportType: "American Football",
    options: ["Yes", "No"],
    optionProbabilities: [54, 46],
    status: "Open",
    resolveOption: null,
    startTime: "Today 18:00",
    endTime: "Today 20:00",
    totalVolume: 124500,
    league: "NFL",
    teams: ["Kansas City Chiefs", "Buffalo Bills"],
    liveScore: "Preview",
    description: "Fast-moving market with premium odds and live line movement.",
  },
  {
    id: "m3",
    title: "Will Nikola Jokic record a triple-double?",
    sportType: "Basketball",
    options: ["Yes", "No"],
    optionProbabilities: [71, 29],
    status: "Live",
    resolveOption: null,
    startTime: "Live",
    endTime: "Tonight 23:00",
    totalVolume: 96000,
    league: "NBA",
    teams: ["Denver Nuggets", "Phoenix Suns"],
    liveScore: "34 PTS • 12 AST • 9 REB",
    description: "Built for high-frequency action with live roster insights.",
  },
  {
    id: "m4",
    title: "Will Novak Djokovic reach the final?",
    sportType: "Tennis",
    options: ["Yes", "No"],
    optionProbabilities: [66, 34],
    status: "Open",
    resolveOption: null,
    startTime: "Tomorrow 10:00",
    endTime: "Tomorrow 18:00",
    totalVolume: 73500,
    league: "ATP",
    teams: ["Novak Djokovic", "Carlos Alcaraz"],
    liveScore: "Preview",
    description: "Elite tennis action with sharp movement and deep liquidity.",
  },
  {
    id: "m5",
    title: "Will the UFC main event end by KO?",
    sportType: "MMA",
    options: ["Yes", "No"],
    optionProbabilities: [58, 42],
    status: "Open",
    resolveOption: null,
    startTime: "Tonight 22:30",
    endTime: "Tonight 23:30",
    totalVolume: 68000,
    league: "UFC",
    teams: ["Alex Pereira", "Jiri Prochazka"],
    liveScore: "Fight Night",
    description: "High-volatility market with crisp odds for fight-night trading.",
  },
  {
    id: "m6",
    title: "Will the Yankees hit 3+ home runs?",
    sportType: "Baseball",
    options: ["Yes", "No"],
    optionProbabilities: [49, 51],
    status: "Open",
    resolveOption: null,
    startTime: "Today 17:30",
    endTime: "Today 20:45",
    totalVolume: 59200,
    league: "MLB",
    teams: ["New York Yankees", "Boston Red Sox"],
    liveScore: "Preview",
    description: "Seasonal market with strong liquidity on power-hitting prop outcomes.",
  },
];

export const initialUser: UserState = {
  id: "u1",
  name: "Foisal Rahman",
  email: "foisal@nextgenpredict.com",
  usdgBalance: 1840,
  bonusBalance: 220,
  totalDeposited: 300,
  totalTraded: 640,
  turnoverCompleted: 620,
  isBanned: false,
  kycStatus: "Approved",
  role: "admin",
};

export const initialTrades: Trade[] = [
  {
    id: "t1",
    userId: "u1",
    marketId: "m1",
    selectedOption: "Yes",
    amount: 150,
    potentialPayout: 232,
    odds: "1.55x",
    status: "Open",
    adminNotified: true,
    createdAt: "2h ago",
  },
  {
    id: "t2",
    userId: "u1",
    marketId: "m3",
    selectedOption: "No",
    amount: 80,
    potentialPayout: 112,
    odds: "1.40x",
    status: "Open",
    adminNotified: false,
    createdAt: "4h ago",
  },
];

export const initialDeposits: DepositRequest[] = [
  {
    id: "d1",
    userId: "u1",
    ethTxHash: "0x91d2…9f01",
    usdgAmount: 100,
    walletAddress: "0xC73f8e56b33D39E2315A6c6EAa42cfB8F8CE11eF",
    status: "Approved",
    bonusGiven: true,
    bonusAmount: 100,
    createdAt: "Today",
  },
];

export const initialWithdrawals: WithdrawalRequest[] = [
  {
    id: "w1",
    userId: "u1",
    usdgAmount: 250,
    walletAddress: "0xC73f8e56b33D39E2315A6c6EAa42cfB8F8CE11eF",
    status: "Pending",
    createdAt: "Today",
  },
];

export const initialNotifications: AdminNotification[] = [
  {
    id: "n1",
    type: "Trade",
    message: "A high-value order was placed on the Real Madrid market.",
    userId: "u1",
    isRead: false,
    createdAt: "Just now",
  },
  {
    id: "n2",
    type: "Deposit",
    message: "Deposit request approved and bonus credited.",
    userId: "u1",
    isRead: true,
    createdAt: "Today",
  },
];

export const initialSiteSettings: SiteSetting[] = [
  { id: "s1", key: "bannerText", value: "Deposit 50-100 USDG → Get instant bonus! 2x turnover to withdraw", category: "Banner" },
  { id: "s2", key: "faq", value: "How do I withdraw? Complete KYC and turn over your deposit twice.", category: "Content" },
  { id: "s3", key: "policy", value: "All markets follow a transparent resolution and settlement framework.", category: "Content" },
  { id: "s4", key: "socialLinks", value: "https://x.com/nextgenpredict,https://instagram.com/nextgenpredict", category: "Social" },
  { id: "s5", key: "partners", value: "Polymarket,Adi Predictstreet,Robinhood", category: "Partners" },
];

export const initialDepositAddresses: DepositAddress[] = [
  { id: "a1", label: "Primary Wallet", address: "0xC73f8e56b33D39E2315A6c6EAa42cfB8F8CE11eF", chain: "Robinhood Chain" },
  { id: "a2", label: "Reserve Wallet", address: "0x1ABcD2e3f4g5H6i7J8k9L0mN1o2P3q4R5s6T7u8V9w0X", chain: "Ethereum" },
];

export const initialKycRequests: KycRequest[] = [
  { id: "k1", userId: "u1", documentUrl: "https://cdn.nextgenpredict.com/kyc/foisal.pdf", status: "Approved", createdAt: "Yesterday" },
];

export const initialState = {
  user: initialUser,
  markets: initialMarkets,
  trades: initialTrades,
  deposits: initialDeposits,
  withdrawals: initialWithdrawals,
  notifications: initialNotifications,
  siteSettings: initialSiteSettings,
  depositAddresses: initialDepositAddresses,
  kycRequests: initialKycRequests,
};
