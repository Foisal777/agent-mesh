'use client';

import { useApp } from "@/app/components/app-shell";

export default function AdminKycPage() {
  const { kycRequests, updateKycStatus } = useApp();

  return (
    <div className="rounded-[28px] border border-white/10 bg-[#12162a] p-6">
      <p className="text-sm uppercase tracking-[0.35em] text-[#00ff87]">KYC review</p>
      <h1 className="mt-2 text-3xl font-semibold text-white">Approve or reject submitted identity documents</h1>
      <div className="mt-6 space-y-4">
        {kycRequests.map((request) => (
          <div key={request.id} className="rounded-2xl border border-white/10 bg-[#1a1d2e] p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm text-[#00ff87]">{request.documentUrl}</div>
                <div className="mt-1 text-sm text-slate-400">{request.status}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => updateKycStatus(request.id, "Approved")} className="rounded-full bg-[#00ff87] px-3 py-2 text-sm font-semibold text-[#07110b]">Approve</button>
                <button onClick={() => updateKycStatus(request.id, "Rejected")} className="rounded-full border border-white/10 px-3 py-2 text-sm text-slate-300">Reject</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
