'use client';

import { useState } from "react";
import { useApp } from "@/app/components/app-shell";

export default function ProfilePage() {
  const { user, submitKyc, kycRequests } = useApp();
  const [documentUrl, setDocumentUrl] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    submitKyc(documentUrl);
    setMessage("KYC submitted successfully. Admin review in progress.");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-[28px] border border-white/10 bg-[#12162a] p-6 shadow-[0_0_80px_rgba(0,255,135,0.08)]">
        <p className="text-sm uppercase tracking-[0.35em] text-[#00ff87]">Profile</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Bonus turnover progress and identity verification</h1>
        <div className="mt-6 rounded-3xl border border-white/10 bg-[#1a1d2e] p-5">
          <div className="text-sm text-slate-400">Bonus turnover</div>
          <div className="mt-2 text-3xl font-semibold text-white">{user.turnoverCompleted} / {user.usdgBalance + user.bonusBalance}</div>
          <div className="mt-4 h-3 rounded-full bg-[#0d0f14]">
            <div className="h-3 rounded-full bg-[#00ff87]" style={{ width: `${Math.min(100, (user.turnoverCompleted / (user.usdgBalance + user.bonusBalance)) * 100)}%` }} />
          </div>
        </div>
      </div>
      <div className="rounded-[28px] border border-white/10 bg-[#12162a] p-6 shadow-[0_0_80px_rgba(0,255,135,0.08)]">
        <div className="rounded-3xl border border-white/10 bg-[#1a1d2e] p-5">
          <h2 className="text-xl font-semibold text-white">KYC</h2>
          <p className="mt-2 text-sm text-slate-400">Submit documents to unlock withdrawals. Admins can approve or reject each request.</p>
          <input value={documentUrl} onChange={(e) => setDocumentUrl(e.target.value)} className="mt-5 w-full rounded-2xl border border-white/10 bg-[#0d0f14] p-3 text-white" placeholder="https://..." />
          <button onClick={handleSubmit} className="mt-5 rounded-2xl bg-[#00ff87] px-4 py-3 font-semibold text-[#07110b] transition hover:opacity-90">Submit KYC</button>
          {message ? <div className="mt-4 rounded-2xl border border-[#00ff87]/30 bg-[#00ff87]/10 px-3 py-3 text-sm text-[#00ff87]">{message}</div> : null}
          <div className="mt-6 space-y-3">
            {kycRequests.map((entry) => (
              <div key={entry.id} className="rounded-2xl border border-white/10 bg-[#0d0f14] px-3 py-3 text-sm text-slate-400">
                <div>{entry.status}</div>
                <div className="mt-1 break-all">{entry.documentUrl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
