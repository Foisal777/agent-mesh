'use client';

import { useApp } from "@/app/components/app-shell";

export default function AdminUsersPage() {
  const { user, updateUserBalance } = useApp();

  return (
    <div className="rounded-[28px] border border-white/10 bg-[#12162a] p-6">
      <p className="text-sm uppercase tracking-[0.35em] text-[#00ff87]">User management</p>
      <h1 className="mt-2 text-3xl font-semibold text-white">Edit balances, restrict accounts, and maintain order</h1>
      <div className="mt-6 rounded-2xl border border-white/10 bg-[#1a1d2e] p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold text-white">{user.name}</div>
            <div className="mt-1 text-sm text-slate-400">{user.email}</div>
          </div>
          <button onClick={() => updateUserBalance(100, 10)} className="rounded-full bg-[#00ff87] px-3 py-2 text-sm font-semibold text-[#07110b]">Credit balance</button>
        </div>
      </div>
    </div>
  );
}
