'use client';

import { useState } from "react";
import { useApp } from "@/app/components/app-shell";

export default function DepositPage() {
  const { depositAddresses, submitDeposit, user } = useApp();
  const [txHash, setTxHash] = useState("");
  const [amount, setAmount] = useState(75);
  const [wallet, setWallet] = useState("0xC73f8e56b33D39E2315A6c6EAa42cfB8F8CE11eF");
  const [statusMessage, setStatusMessage] = useState("");

  const handleSubmit = () => {
    submitDeposit(txHash, amount, wallet);
    setStatusMessage(`Deposit request submitted for ${amount} USDG. Approval pending.`);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-[28px] border border-white/10 bg-[#12162a] p-6 shadow-[0_0_80px_rgba(0,255,135,0.08)]">
        <p className="text-sm uppercase tracking-[0.35em] text-[#00ff87]">Deposit</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Fund your account with ETH on Robinhood Chain</h1>
        <p className="mt-3 text-slate-400">Send to one of the verified deposit addresses below. Deposits between 50 and 100 USDG receive an instant bonus and qualify for the bonus turnover requirement.</p>
        <div className="mt-6 space-y-4">
          {depositAddresses.map((entry) => (
            <div key={entry.id} className="rounded-2xl border border-white/10 bg-[#1a1d2e] p-4">
              <div className="text-sm text-[#00ff87]">{entry.label}</div>
              <div className="mt-2 break-all text-sm text-slate-300">{entry.address}</div>
              <div className="mt-2 text-xs uppercase tracking-[0.3em] text-slate-500">{entry.chain}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-[28px] border border-white/10 bg-[#12162a] p-6 shadow-[0_0_80px_rgba(0,255,135,0.08)]">
        <div className="rounded-3xl border border-white/10 bg-[#1a1d2e] p-5">
          <div className="text-sm text-slate-400">Available balance</div>
          <div className="mt-2 text-3xl font-semibold text-white">{user.usdgBalance} USDG</div>
          <label className="mt-6 block text-sm text-slate-400">Deposit amount</label>
          <input type="range" min="50" max="1000" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="mt-2 w-full accent-[#00ff87]" />
          <div className="mt-3 text-2xl font-semibold text-white">{amount} USDG</div>
          <label className="mt-6 block text-sm text-slate-400">Wallet address</label>
          <input value={wallet} onChange={(e) => setWallet(e.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-[#0d0f14] p-3 text-white" />
          <label className="mt-6 block text-sm text-slate-400">Transaction hash</label>
          <input value={txHash} onChange={(e) => setTxHash(e.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-[#0d0f14] p-3 text-white" placeholder="0x..." />
          <button onClick={handleSubmit} className="mt-6 w-full rounded-2xl bg-[#00ff87] px-4 py-3 font-semibold text-[#07110b] transition hover:opacity-90">Submit deposit</button>
          {statusMessage ? <div className="mt-4 rounded-2xl border border-[#00ff87]/30 bg-[#00ff87]/10 px-3 py-3 text-sm text-[#00ff87]">{statusMessage}</div> : null}
        </div>
      </div>
    </div>
  );
}
