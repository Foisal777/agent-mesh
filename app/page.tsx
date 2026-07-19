"use client";

import Link from "next/link";
import { useApp } from "@/app/components/app-shell";

export default function Home() {
  const { markets, siteSettings, user } = useApp();
  const partners = (siteSettings.find((entry) => entry.key === "partners")?.value ?? "Polymarket,Adi Predictstreet,Robinhood").split(",");

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[32px] border border-white/10 bg-[#12162a] shadow-[0_0_90px_rgba(0,255,135,0.1)]">
        <div className="grid gap-8 p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-12">
          <div>
            <div className="inline-flex rounded-full border border-[#00ff87]/30 bg-[#00ff87]/10 px-3 py-1 text-sm font-medium text-[#00ff87]">NextGen Predict • Sports-only markets</div>
            <h1 className="mt-6 text-4xl font-semibold leading-tight text-white sm:text-5xl">The premium prediction market for modern sports fans.</h1>
            <p className="mt-5 max-w-2xl text-lg text-slate-400">Trade on football, basketball, tennis, MMA, and more with instant execution, deep liquidity, and a polished Polymarket-style interface.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/markets" className="rounded-full bg-[#00ff87] px-5 py-3 font-semibold text-[#07110b] transition hover:opacity-90">Explore markets</Link>
              <Link href="/deposit" className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-[#00ff87]/40 hover:text-[#00ff87]">Deposit USDG</Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-4 text-sm text-slate-400">
              <div className="rounded-2xl border border-white/10 bg-[#1a1d2e] px-4 py-3">Instant bonus on deposits 50-100 USDG</div>
              <div className="rounded-2xl border border-white/10 bg-[#1a1d2e] px-4 py-3">KYC-gated withdrawals</div>
              <div className="rounded-2xl border border-white/10 bg-[#1a1d2e] px-4 py-3">Admin-controlled market resolution</div>
            </div>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-[#1a1d2e] p-6">
            <div className="rounded-[24px] border border-[#00ff87]/20 bg-[#0d0f14] p-6">
              <div className="text-sm uppercase tracking-[0.35em] text-[#00ff87]">User summary</div>
              <div className="mt-4 text-3xl font-semibold text-white">{user.usdgBalance} USDG</div>
              <div className="mt-2 text-sm text-slate-400">Bonus balance • {user.bonusBalance}</div>
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#12162a] px-4 py-3 text-sm text-slate-400"><span>Turnover progress</span><span className="font-semibold text-white">{user.turnoverCompleted}</span></div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#12162a] px-4 py-3 text-sm text-slate-400"><span>Monthly volume</span><span className="font-semibold text-white">$1.2M</span></div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#12162a] px-4 py-3 text-sm text-slate-400"><span>Open positions</span><span className="font-semibold text-white">{markets.length}</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-white/10 bg-[#12162a] p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-[#00ff87]">Featured markets</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">High intensity markets across the biggest sports</h2>
          </div>
          <Link href="/markets" className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:border-[#00ff87]/40 hover:text-[#00ff87]">View all</Link>
        </div>
        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          {markets.slice(0, 3).map((market) => (
            <div key={market.id} className="rounded-[24px] border border-white/10 bg-[#1a1d2e] p-5">
              <div className="flex items-center justify-between">
                <div className="text-sm text-[#00ff87]">{market.sportType}</div>
                <div className="rounded-full border border-[#00ff87]/30 bg-[#00ff87]/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-[#00ff87]">{market.status}</div>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">{market.title}</h3>
              <p className="mt-3 text-sm text-slate-400">{market.description}</p>
              <div className="mt-5 flex items-center justify-between text-sm text-slate-400">
                <span>{market.teams.join(" vs ")}</span>
                <span>${market.totalVolume.toLocaleString()}</span>
              </div>
              <Link href={`/markets/${market.id}`} className="mt-5 inline-flex rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:border-[#00ff87]/40 hover:text-[#00ff87]">Open market</Link>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[28px] border border-white/10 bg-[#12162a] p-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-[#00ff87]">FAQ</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Everything a serious trader needs to know</h2>
            <div className="mt-6 space-y-3 text-sm text-slate-400">
              <div className="rounded-2xl border border-white/10 bg-[#1a1d2e] p-4">How do withdrawals work? Complete KYC and satisfy the turnover requirement before requesting a payout.</div>
              <div className="rounded-2xl border border-white/10 bg-[#1a1d2e] p-4">What about bonuses? Deposits between 50 and 100 USDG receive instant bonus credits that are locked until turnover is complete.</div>
              <div className="rounded-2xl border border-white/10 bg-[#1a1d2e] p-4">Can admins create markets? Yes, markets can be created and resolved directly from the admin console.</div>
            </div>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-[#1a1d2e] p-6">
            <p className="text-sm uppercase tracking-[0.35em] text-[#00ff87]">Partners</p>
            <div className="mt-5 flex flex-wrap gap-3">
              {partners.map((partner) => (
                <div key={partner} className="rounded-full border border-white/10 bg-[#0d0f14] px-4 py-2 text-sm text-slate-300">{partner}</div>
              ))}
            </div>
            <div className="mt-8 space-y-3 text-sm text-slate-400">
              <a href="https://x.com" className="block transition hover:text-[#00ff87]">X / Twitter</a>
              <a href="https://instagram.com" className="block transition hover:text-[#00ff87]">Instagram</a>
              <a href="https://discord.com" className="block transition hover:text-[#00ff87]">Discord</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
