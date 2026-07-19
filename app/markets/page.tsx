'use client';

import Link from "next/link";
import { useApp } from "@/app/components/app-shell";

export default function MarketsPage() {
  const { markets, placeTrade } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[28px] border border-white/10 bg-[#12162a] p-6 shadow-[0_0_80px_rgba(0,255,135,0.08)] md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-[#00ff87]">Markets</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Sports markets with instant liquidity</h1>
          <p className="mt-3 max-w-2xl text-slate-400">Trade across football, basketball, MMA, and more with the same feel as premium prediction platforms.</p>
        </div>
        <div className="rounded-2xl border border-[#00ff87]/30 bg-[#00ff87]/10 px-4 py-3 text-sm text-[#00ff87]">Live odds • instant execution • admin oversight</div>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        {markets.map((market) => (
          <div key={market.id} className="rounded-[24px] border border-white/10 bg-[#1a1d2e] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#00ff87]">{market.sportType}</p>
                <h2 className="mt-2 text-xl font-semibold text-white">{market.title}</h2>
              </div>
              <div className="rounded-full border border-[#00ff87]/40 bg-[#00ff87]/10 px-3 py-1 text-sm text-[#00ff87]">{market.status}</div>
            </div>
            <p className="mt-4 text-sm text-slate-400">{market.description}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              {market.options.map((option, index) => (
                <button
                  key={option}
                  onClick={() => placeTrade(market.id, option, 50)}
                  className="flex-1 rounded-2xl border border-white/10 bg-[#0d0f14] px-4 py-3 text-left transition hover:border-[#00ff87]/40"
                >
                  <div className="text-sm text-slate-400">{option}</div>
                  <div className="mt-1 text-lg font-semibold text-white">{market.optionProbabilities[index]}%</div>
                </button>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between text-sm text-slate-400">
              <span>{market.teams.join(" vs ")}</span>
              <span>${market.totalVolume.toLocaleString()}</span>
            </div>
            <div className="mt-4 flex gap-3">
              <Link href={`/markets/${market.id}`} className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:border-[#00ff87]/40 hover:text-[#00ff87]">View detail</Link>
              <Link href="/portfolio" className="rounded-full bg-[#00ff87] px-4 py-2 text-sm font-semibold text-[#07110b] transition hover:opacity-90">Open position</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
