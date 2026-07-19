'use client';

import { useState } from "react";
import { useApp } from "@/app/components/app-shell";

export default function AdminMarketsPage() {
  const { markets, createMarket, updateMarket, resolveMarket } = useApp();
  const [title, setTitle] = useState("");
  const [sportType, setSportType] = useState("Football");
  const [league, setLeague] = useState("");
  const [teams, setTeams] = useState("");
  const [volume, setVolume] = useState(50000);

  const submitMarket = () => {
    createMarket({
      title,
      sportType,
      options: ["Yes", "No"],
      optionProbabilities: [50, 50],
      status: "Open",
      resolveOption: null,
      startTime: "Now",
      endTime: "TBD",
      totalVolume: volume,
      league,
      teams: teams.split(","),
      liveScore: "Preview",
      description: "Admin-created market",
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-white/10 bg-[#12162a] p-6">
        <p className="text-sm uppercase tracking-[0.35em] text-[#00ff87]">Market management</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Create or update markets from the admin console</h1>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-[24px] border border-white/10 bg-[#1a1d2e] p-6">
          <h2 className="text-xl font-semibold text-white">Create market</h2>
          <div className="mt-4 space-y-4">
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-[#0d0f14] p-3 text-white" placeholder="Market title" />
            <input value={sportType} onChange={(e) => setSportType(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-[#0d0f14] p-3 text-white" placeholder="Sport type" />
            <input value={league} onChange={(e) => setLeague(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-[#0d0f14] p-3 text-white" placeholder="League" />
            <input value={teams} onChange={(e) => setTeams(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-[#0d0f14] p-3 text-white" placeholder="Teams, separated by commas" />
            <input type="range" min="1000" max="1000000" value={volume} onChange={(e) => setVolume(Number(e.target.value))} className="w-full accent-[#00ff87]" />
            <div className="text-lg font-semibold text-white">Volume: ${volume.toLocaleString()}</div>
            <button onClick={submitMarket} className="w-full rounded-2xl bg-[#00ff87] px-4 py-3 font-semibold text-[#07110b]">Create market</button>
          </div>
        </div>
        <div className="rounded-[24px] border border-white/10 bg-[#1a1d2e] p-6">
          <h2 className="text-xl font-semibold text-white">Existing markets</h2>
          <div className="mt-4 space-y-3">
            {markets.map((market) => (
              <div key={market.id} className="rounded-2xl border border-white/10 bg-[#0d0f14] p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm text-[#00ff87]">{market.title}</div>
                    <div className="mt-1 text-sm text-slate-400">{market.league}</div>
                  </div>
                  <button onClick={() => resolveMarket(market.id, market.options[0])} className="rounded-full border border-[#00ff87]/30 px-3 py-2 text-sm text-[#00ff87]">Resolve</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
