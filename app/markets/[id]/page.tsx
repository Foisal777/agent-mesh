'use client';

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useApp } from "@/app/components/app-shell";

export default function MarketDetailPage() {
  const params = useParams<{ id: string }>();
  const { markets, placeTrade, user, notifications } = useApp();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [amount, setAmount] = useState(50);
  const [toast, setToast] = useState("" );

  const market = useMemo(() => markets.find((entry) => entry.id === params.id), [markets, params.id]);

  if (!market) return <div className="text-slate-400">Market not found.</div>;

  const submitTrade = () => {
    if (!selectedOption) return;
    placeTrade(market.id, selectedOption, amount);
    setToast("Order Placed ✓");
    setTimeout(() => setToast(""), 1800);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-[28px] border border-white/10 bg-[#12162a] p-6 shadow-[0_0_80px_rgba(0,255,135,0.08)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-[#00ff87]">{market.sportType}</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">{market.title}</h1>
          </div>
          <div className="rounded-full border border-[#00ff87]/40 bg-[#00ff87]/10 px-4 py-2 text-sm text-[#00ff87]">{market.status}</div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {market.options.map((option, index) => (
            <button key={option} onClick={() => setSelectedOption(option)} className={`rounded-2xl border p-4 text-left transition ${selectedOption === option ? "border-[#00ff87] bg-[#00ff87]/10" : "border-white/10 bg-[#1a1d2e]"}`}>
              <div className="text-sm text-slate-400">{option}</div>
              <div className="mt-2 text-2xl font-semibold text-white">{market.optionProbabilities[index]}%</div>
            </button>
          ))}
        </div>
        <div className="mt-6 rounded-3xl border border-white/10 bg-[#1a1d2e] p-5">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>Volume</span>
            <span>${market.totalVolume.toLocaleString()}</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-sm text-slate-400">
            <span>Live score</span>
            <span className="font-semibold text-white">{market.liveScore}</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-sm text-slate-400">
            <span>League</span>
            <span className="font-semibold text-white">{market.league}</span>
          </div>
        </div>
      </div>
      <div className="rounded-[28px] border border-white/10 bg-[#12162a] p-6 shadow-[0_0_80px_rgba(0,255,135,0.08)]">
        <div className="rounded-3xl border border-white/10 bg-[#1a1d2e] p-5">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>Balance</span>
            <span className="font-semibold text-white">{user.usdgBalance} USDG</span>
          </div>
          <div className="mt-3">
            <label className="text-sm text-slate-400">Amount</label>
            <input type="range" min="10" max="500" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="mt-2 w-full accent-[#00ff87]" />
            <div className="mt-2 text-3xl font-semibold text-white">{amount} USDG</div>
          </div>
          <button onClick={submitTrade} className="mt-5 w-full rounded-2xl bg-[#00ff87] px-4 py-3 font-semibold text-[#07110b] transition hover:opacity-90">Place order</button>
          {toast ? <div className="mt-4 rounded-2xl border border-[#00ff87]/30 bg-[#00ff87]/10 px-3 py-2 text-center text-sm text-[#00ff87]">{toast}</div> : null}
        </div>
        <div className="mt-6 rounded-3xl border border-white/10 bg-[#1a1d2e] p-5">
          <h2 className="text-lg font-semibold text-white">Recent activity</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-400">
            {notifications.slice(0, 3).map((entry) => (
              <li key={entry.id} className="rounded-2xl border border-white/10 bg-[#0d0f14] px-3 py-3">{entry.message}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
