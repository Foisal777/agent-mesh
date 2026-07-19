'use client';

import { useApp } from "@/app/components/app-shell";

export default function AdminDepositsPage() {
  const { deposits, approveDeposit } = useApp();
  return (
    <div className="rounded-[28px] border border-white/10 bg-[#12162a] p-6">
      <p className="text-sm uppercase tracking-[0.35em] text-[#00ff87]">Deposit management</p>
      <h1 className="mt-2 text-3xl font-semibold text-white">Approve incoming deposits and bonus rewards</h1>
      <div className="mt-6 space-y-4">
        {deposits.map((deposit) => (
          <div key={deposit.id} className="rounded-2xl border border-white/10 bg-[#1a1d2e] p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm text-[#00ff87]">{deposit.ethTxHash}</div>
                <div className="mt-1 text-sm text-slate-400">{deposit.usdgAmount} USDG • {deposit.bonusAmount} bonus</div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-sm text-slate-400">{deposit.status}</div>
                <button onClick={() => approveDeposit(deposit.id)} className="rounded-full bg-[#00ff87] px-3 py-2 text-sm font-semibold text-[#07110b]">Approve</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
