'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  initialState,
  type AdminNotification,
  type DepositAddress,
  type DepositRequest,
  type KycRequest,
  type Market,
  type SiteSetting,
  type Trade,
  type UserState,
  type WithdrawalRequest,
} from "@/app/lib/mock-data";

interface AppContextValue {
  user: UserState;
  markets: Market[];
  trades: Trade[];
  deposits: DepositRequest[];
  withdrawals: WithdrawalRequest[];
  notifications: AdminNotification[];
  siteSettings: SiteSetting[];
  depositAddresses: DepositAddress[];
  kycRequests: KycRequest[];
  isSignedIn: boolean;
  signIn: () => void;
  signOut: () => void;
  placeTrade: (marketId: string, option: string, amount: number) => void;
  cancelTrade: (tradeId: string) => void;
  submitDeposit: (txHash: string, usdgAmount: number, walletAddress: string) => void;
  approveDeposit: (depositId: string) => void;
  submitWithdrawal: (amount: number, walletAddress: string) => void;
  approveWithdrawal: (withdrawalId: string) => void;
  submitKyc: (documentUrl: string) => void;
  updateKycStatus: (requestId: string, status: KycRequest["status"]) => void;
  createMarket: (market: Omit<Market, "id">) => void;
  updateMarket: (market: Market) => void;
  resolveMarket: (marketId: string, resolveOption: string) => void;
  addNotification: (message: string, type?: string) => void;
  updateSetting: (key: string, value: string) => void;
  addDepositAddress: (label: string, address: string, chain: string) => void;
  updateUserBalance: (delta: number, bonusDelta?: number) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp is missing provider");
  return context;
}

const STORAGE_KEY = "nextgen-predict-state";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [state, setState] = useState(initialState);
  const [isSignedIn, setIsSignedIn] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState(parsed);
      } catch {
        setState(initialState);
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [hydrated, state]);

  const value = useMemo<AppContextValue>(() => ({
    user: state.user,
    markets: state.markets,
    trades: state.trades,
    deposits: state.deposits,
    withdrawals: state.withdrawals,
    notifications: state.notifications,
    siteSettings: state.siteSettings,
    depositAddresses: state.depositAddresses,
    kycRequests: state.kycRequests,
    isSignedIn,
    signIn: () => setIsSignedIn(true),
    signOut: () => setIsSignedIn(false),
    placeTrade: (marketId, option, amount) => {
      const market = state.markets.find((entry) => entry.id === marketId);
      if (!market || state.user.usdgBalance < amount) return;
      const odds = (1 + amount / 300).toFixed(2);
      const payout = Number((amount * Number(odds)).toFixed(2));
      const newTrade: Trade = {
        id: `t${Date.now()}`,
        userId: state.user.id,
        marketId,
        selectedOption: option,
        amount,
        potentialPayout: payout,
        odds: `${odds}x`,
        status: "Open",
        adminNotified: true,
        createdAt: "Just now",
      };
      setState((prev) => ({
        ...prev,
        user: { ...prev.user, usdgBalance: prev.user.usdgBalance - amount, totalTraded: prev.user.totalTraded + amount, turnoverCompleted: prev.user.turnoverCompleted + amount },
        trades: [newTrade, ...prev.trades],
        notifications: [
          { id: `n${Date.now() + 1}`, type: "Trade", message: `Order placed on ${market.title}`, userId: prev.user.id, isRead: false, createdAt: "Just now" },
          ...prev.notifications,
        ],
      }));
    },
    cancelTrade: (tradeId) => {
      const trade = state.trades.find((entry) => entry.id === tradeId);
      if (!trade) return;
      setState((prev) => ({
        ...prev,
        user: { ...prev.user, usdgBalance: prev.user.usdgBalance + trade.amount },
        trades: prev.trades.map((entry) => entry.id === tradeId ? { ...entry, status: "Canceled" } : entry),
        notifications: [
          { id: `n${Date.now() + 2}`, type: "Trade", message: `Trade ${tradeId} was canceled and refunded.`, userId: prev.user.id, isRead: false, createdAt: "Just now" },
          ...prev.notifications,
        ],
      }));
    },
    submitDeposit: (txHash, usdgAmount, walletAddress) => {
      const bonusGiven = usdgAmount >= 50 && usdgAmount <= 100;
      const bonusAmount = bonusGiven ? usdgAmount : 0;
      const newDeposit: DepositRequest = {
        id: `d${Date.now()}`,
        userId: state.user.id,
        ethTxHash: txHash,
        usdgAmount,
        walletAddress,
        status: "Pending",
        bonusGiven,
        bonusAmount,
        createdAt: "Just now",
      };
      setState((prev) => ({
        ...prev,
        deposits: [newDeposit, ...prev.deposits],
        notifications: [
          { id: `n${Date.now() + 3}`, type: "Deposit", message: `New deposit request of ${usdgAmount} USDG received.`, userId: prev.user.id, isRead: false, createdAt: "Just now" },
          ...prev.notifications,
        ],
      }));
    },
    approveDeposit: (depositId) => {
      const deposit = state.deposits.find((entry) => entry.id === depositId);
      if (!deposit) return;
      setState((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          usdgBalance: prev.user.usdgBalance + deposit.usdgAmount + deposit.bonusAmount,
          bonusBalance: prev.user.bonusBalance + deposit.bonusAmount,
          totalDeposited: prev.user.totalDeposited + deposit.usdgAmount,
        },
        deposits: prev.deposits.map((entry) => entry.id === depositId ? { ...entry, status: "Approved" } : entry),
        notifications: [
          { id: `n${Date.now() + 4}`, type: "Deposit", message: `Deposit ${depositId} approved.`, userId: prev.user.id, isRead: false, createdAt: "Just now" },
          ...prev.notifications,
        ],
      }));
    },
    submitWithdrawal: (amount, walletAddress) => {
      if (state.user.kycStatus !== "Approved") return;
      const next: WithdrawalRequest = {
        id: `w${Date.now()}`,
        userId: state.user.id,
        usdgAmount: amount,
        walletAddress,
        status: "Pending",
        createdAt: "Just now",
      };
      setState((prev) => ({
        ...prev,
        withdrawals: [next, ...prev.withdrawals],
        notifications: [
          { id: `n${Date.now() + 5}`, type: "Withdrawal", message: `New withdrawal request for ${amount} USDG received.`, userId: prev.user.id, isRead: false, createdAt: "Just now" },
          ...prev.notifications,
        ],
      }));
    },
    approveWithdrawal: (withdrawalId) => {
      const withdrawal = state.withdrawals.find((entry) => entry.id === withdrawalId);
      if (!withdrawal) return;
      setState((prev) => ({
        ...prev,
        user: { ...prev.user, usdgBalance: prev.user.usdgBalance - withdrawal.usdgAmount },
        withdrawals: prev.withdrawals.map((entry) => entry.id === withdrawalId ? { ...entry, status: "Approved" } : entry),
      }));
    },
    submitKyc: (documentUrl) => {
      const request: KycRequest = {
        id: `k${Date.now()}`,
        userId: state.user.id,
        documentUrl,
        status: "Pending",
        createdAt: "Just now",
      };
      setState((prev) => ({ ...prev, kycRequests: [request, ...prev.kycRequests] }));
    },
    updateKycStatus: (requestId, status) => {
      setState((prev) => ({
        ...prev,
        user: { ...prev.user, kycStatus: status === "Approved" ? "Approved" : status === "Rejected" ? "Rejected" : "Pending" },
        kycRequests: prev.kycRequests.map((entry) => entry.id === requestId ? { ...entry, status } : entry),
      }));
    },
    createMarket: (market) => {
      const newMarket: Market = { id: `m${Date.now()}`, ...market };
      setState((prev) => ({ ...prev, markets: [newMarket, ...prev.markets] }));
    },
    updateMarket: (market) => {
      setState((prev) => ({ ...prev, markets: prev.markets.map((entry) => entry.id === market.id ? market : entry) }));
    },
    resolveMarket: (marketId, resolveOption) => {
      setState((prev) => ({
        ...prev,
        markets: prev.markets.map((entry) => entry.id === marketId ? { ...entry, status: "Resolved", resolveOption } : entry),
      }));
    },
    addNotification: (message, type = "System") => {
      setState((prev) => ({
        ...prev,
        notifications: [{ id: `n${Date.now()}`, type, message, userId: prev.user.id, isRead: false, createdAt: "Just now" }, ...prev.notifications],
      }));
    },
    updateSetting: (key, value) => {
      setState((prev) => ({
        ...prev,
        siteSettings: prev.siteSettings.map((entry) => entry.key === key ? { ...entry, value } : entry),
      }));
    },
    addDepositAddress: (label, address, chain) => {
      setState((prev) => ({
        ...prev,
        depositAddresses: [{ id: `a${Date.now()}`, label, address, chain }, ...prev.depositAddresses],
      }));
    },
    updateUserBalance: (delta, bonusDelta = 0) => {
      setState((prev) => ({
        ...prev,
        user: { ...prev.user, usdgBalance: prev.user.usdgBalance + delta, bonusBalance: prev.user.bonusBalance + bonusDelta },
      }));
    },
  }), [isSignedIn, state]);

  const bannerText = state.siteSettings.find((entry) => entry.key === "bannerText")?.value ?? "Deposit 50-100 USDG → Get instant bonus! 2x turnover to withdraw";
  const isAdminRoute = pathname?.startsWith("/admin") || pathname?.startsWith("/foisal");

  return (
    <AppContext.Provider value={value}>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(0,255,135,0.16),_transparent_35%)] text-slate-100">
        <header className="border-b border-white/10 bg-[#0d0f14]/90 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#00ff87]/50 bg-[#00ff87]/10 text-lg font-semibold text-[#00ff87] shadow-[0_0_30px_rgba(0,255,135,0.25)]">N</div>
              <div>
                <div className="text-lg font-semibold tracking-[0.22em] text-white">NEXTGEN PREDICT</div>
                <div className="text-xs uppercase tracking-[0.3em] text-slate-400">Sports prediction markets</div>
              </div>
            </Link>
            <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
              <Link href="/markets" className="transition hover:text-[#00ff87]">Markets</Link>
              <Link href="/portfolio" className="transition hover:text-[#00ff87]">Portfolio</Link>
              <Link href="/deposit" className="transition hover:text-[#00ff87]">Deposit</Link>
              <Link href="/withdrawal" className="transition hover:text-[#00ff87]">Withdrawal</Link>
              <Link href="/profile" className="transition hover:text-[#00ff87]">Profile</Link>
              {isAdminRoute ? null : <Link href="/admin" className="rounded-full border border-[#00ff87]/40 px-3 py-2 text-[#00ff87] transition hover:bg-[#00ff87]/10">Admin</Link>}
            </nav>
            <div className="flex items-center gap-3">
              {isSignedIn ? (
                <>
                  <span className="hidden rounded-full border border-[#00ff87]/30 bg-[#00ff87]/10 px-3 py-2 text-sm text-[#00ff87] sm:block">{state.user.name}</span>
                  <button onClick={() => setIsSignedIn(false)} className="rounded-full border border-white/10 px-3 py-2 text-sm text-slate-300 transition hover:border-[#00ff87]/40 hover:text-[#00ff87]">Sign out</button>
                </>
              ) : (
                <button onClick={() => setIsSignedIn(true)} className="rounded-full bg-[#00ff87] px-3 py-2 text-sm font-semibold text-[#07110b] transition hover:opacity-90">Continue with Google</button>
              )}
            </div>
          </div>
        </header>
        <div className="border-b border-[#00ff87]/20 bg-[#101425] px-4 py-3 text-center text-sm text-slate-300">
          <span className="font-semibold text-[#00ff87]">Promo:</span> {bannerText}
        </div>
        <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">{children}</main>
        <footer className="border-t border-white/10 bg-[#0d0f14]/80 px-4 py-8 text-sm text-slate-400">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="font-semibold text-white">NextGen Predict</div>
              <div>Professional sports prediction markets with a polished trading experience.</div>
            </div>
            <div className="flex flex-wrap gap-4">
              <a href="https://x.com" className="transition hover:text-[#00ff87]">X</a>
              <a href="https://instagram.com" className="transition hover:text-[#00ff87]">Instagram</a>
              <a href="https://discord.com" className="transition hover:text-[#00ff87]">Discord</a>
            </div>
          </div>
        </footer>
      </div>
    </AppContext.Provider>
  );
}
