'use client';

import Link from "next/link";
import { useApp } from "@/app/components/app-shell";

export default function PortfolioPage() {
  const { user, trades, markets, cancelTrade } = useApp();

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-white/10 bg-[#12162a] p-6 shadow-[0_0_80px_rgba(0,255,135,0.08)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-[#00ff87]">Portfolio</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Track your open positions and balances</h1>
          </div>
          <div className="rounded-2xl border border-[#00ff87]/30 bg-[#00ff87]/10 px-4 py-3 text-sm text-[#00ff87]">USDG {user.usdgBalance} • Bonus {user.bonusBalance}</div>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[24px] border border-white/10 bg-[#1a1d2e] p-6">
          <h2 className="text-xl font-semibold text-white">Performance snapshot</h2>
          <div className="mt-6 space-y-4 text-sm text-slate-400">
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0d0f14] px-4 py-3"><span>Total deposited</span><span className="font-semibold text-white">{user.totalDeposited}</span></div>
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0d0f14] px-4 py-3"><span>Total traded</span><span className="font-semibold text-white">{user.totalTraded}</span></div>
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0d0f14] px-4 py-3"><span>Turnover completed</span><span className="font-semibold text-white">{user.turnoverCompleted}</span></div>
          </div>
        </div>
        <div className="rounded-[24px] border border-white/10 bg-[#1a1d2e] p-6">
          <h2 className="text-xl font-semibold text-white">Open trades</h2>
          <div className="mt-6 space-y-4">
            {trades.map((trade) => {
              const market = markets.find((entry) => entry.id === trade.marketId);
              return (
                <div key={trade.id} className="rounded-2xl border border-white/10 bg-[#0d0f14] p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-[#00ff87]">{market?.title ?? trade.marketId}</div>
                      <div className="mt-1 text-lg font-semibold text-white">{trade.selectedOption}</div>
                    </div>
                    <div className="text-right text-sm text-slate-400">
                      <div>{trade.amount} USDG</div>
                      <div>{trade.odds}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        <Link href="/markets" className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:border-[#00ff87]/40 hover:text-[#00ff87]">Browse markets</Link>
        <Link href="/profile" className="rounded-full bg-[#00ff87] px-4 py-2 text-sm font-semibold text-[#07110b] transition hover:opacity-90">View turnover</Link>
      </div>
    </div>
  );
}
