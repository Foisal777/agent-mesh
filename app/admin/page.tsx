'use client';

import Link from "next/link";
import { useApp } from "@/app/components/app-shell";

export default function AdminDashboardPage() {
  const { user, notifications, deposits, withdrawals, markets } = useApp();
  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-white/10 bg-[#12162a] p-6 shadow-[0_0_80px_rgba(0,255,135,0.08)]">
        <p className="text-sm uppercase tracking-[0.35em] text-[#00ff87]">Admin panel</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">NextGen Predict control center</h1>
        <p className="mt-3 text-slate-400">Create markets, resolve outcomes, manage deposits and withdrawals, and monitor live notifications from a single command center.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[24px] border border-white/10 bg-[#1a1d2e] p-5">
          <div className="text-sm text-slate-400">Active markets</div>
          <div className="mt-2 text-3xl font-semibold text-white">{markets.length}</div>
        </div>
        <div className="rounded-[24px] border border-white/10 bg-[#1a1d2e] p-5">
          <div className="text-sm text-slate-400">Pending deposits</div>
          <div className="mt-2 text-3xl font-semibold text-white">{deposits.filter((entry) => entry.status === "Pending").length}</div>
        </div>
        <div className="rounded-[24px] border border-white/10 bg-[#1a1d2e] p-5">
          <div className="text-sm text-slate-400">Pending withdrawals</div>
          <div className="mt-2 text-3xl font-semibold text-white">{withdrawals.filter((entry) => entry.status === "Pending").length}</div>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-[24px] border border-white/10 bg-[#1a1d2e] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Quick actions</h2>
            <div className="text-sm text-[#00ff87]">{user.name}</div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Link href="/admin/markets" className="rounded-2xl border border-white/10 bg-[#0d0f14] p-4 text-sm text-slate-300 transition hover:border-[#00ff87]/40">Market management</Link>
            <Link href="/admin/deposits" className="rounded-2xl border border-white/10 bg-[#0d0f14] p-4 text-sm text-slate-300 transition hover:border-[#00ff87]/40">Deposit management</Link>
            <Link href="/admin/withdrawals" className="rounded-2xl border border-white/10 bg-[#0d0f14] p-4 text-sm text-slate-300 transition hover:border-[#00ff87]/40">Withdrawal management</Link>
            <Link href="/admin/users" className="rounded-2xl border border-white/10 bg-[#0d0f14] p-4 text-sm text-slate-300 transition hover:border-[#00ff87]/40">User management</Link>
            <Link href="/admin/kyc" className="rounded-2xl border border-white/10 bg-[#0d0f14] p-4 text-sm text-slate-300 transition hover:border-[#00ff87]/40">KYC review</Link>
            <Link href="/admin/settings" className="rounded-2xl border border-white/10 bg-[#0d0f14] p-4 text-sm text-slate-300 transition hover:border-[#00ff87]/40">Site settings</Link>
          </div>
        </div>
        <div className="rounded-[24px] border border-white/10 bg-[#1a1d2e] p-6">
          <h2 className="text-xl font-semibold text-white">Notifications</h2>
          <div className="mt-4 space-y-3">
            {notifications.map((entry) => (
              <div key={entry.id} className="rounded-2xl border border-white/10 bg-[#0d0f14] p-3 text-sm text-slate-400">{entry.message}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
