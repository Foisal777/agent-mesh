'use client';

import { useState } from "react";
import { useApp } from "@/app/components/app-shell";

export default function WithdrawalPage() {
  const { user, submitWithdrawal } = useApp();
  const [amount, setAmount] = useState(120);
  const [wallet, setWallet] = useState("0xC73f8e56b33D39E2315A6c6EAa42cfB8F8CE11eF");
  const [message, setMessage] = useState("");

  const submit = () => {
    if (user.kycStatus !== "Approved") {
      setMessage("KYC approval is required before any withdrawal can be requested.");
      return;
    }
    if (user.turnoverCompleted < amount * 2) {
      setMessage("Withdrawals require complete turnover. Bonus funds remain locked until turnover is complete.");
      return;
    }
    submitWithdrawal(amount, wallet);
    setMessage(`Withdrawal request for ${amount} USDG submitted.`);
  };

  return (
    <div className="rounded-[28px] border border-white/10 bg-[#12162a] p-6 shadow-[0_0_80px_rgba(0,255,135,0.08)]">
      <p className="text-sm uppercase tracking-[0.35em] text-[#00ff87]">Withdrawal</p>
      <h1 className="mt-2 text-3xl font-semibold text-white">Secure USDG withdrawals with KYC enforcement</h1>
      <p className="mt-3 text-slate-400">KYCs must be approved before a withdrawal can be processed. The base deposit becomes withdrawable after the turnover requirement is satisfied.</p>
      <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-3xl border border-white/10 bg-[#1a1d2e] p-5">
          <div className="text-sm text-slate-400">Available USDG</div>
          <div className="mt-2 text-3xl font-semibold text-white">{user.usdgBalance}</div>
          <div className="mt-6 text-sm text-slate-400">Bonus turnover</div>
          <div className="mt-2 text-2xl font-semibold text-white">{user.turnoverCompleted} / {Math.max(200, user.usdgBalance)}</div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-[#1a1d2e] p-5">
          <label className="text-sm text-slate-400">Withdrawal amount</label>
          <input type="range" min="50" max="1000" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="mt-2 w-full accent-[#00ff87]" />
          <div className="mt-3 text-2xl font-semibold text-white">{amount} USDG</div>
          <label className="mt-6 block text-sm text-slate-400">Wallet address</label>
          <input value={wallet} onChange={(e) => setWallet(e.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-[#0d0f14] p-3 text-white" />
          <button onClick={submit} className="mt-6 w-full rounded-2xl bg-[#00ff87] px-4 py-3 font-semibold text-[#07110b] transition hover:opacity-90">Request withdrawal</button>
          {message ? <div className="mt-4 rounded-2xl border border-[#00ff87]/30 bg-[#00ff87]/10 px-3 py-3 text-sm text-[#00ff87]">{message}</div> : null}
        </div>
      </div>
    </div>
  );
}
