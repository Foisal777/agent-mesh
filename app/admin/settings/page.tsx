'use client';

import { useState } from "react";
import { useApp } from "@/app/components/app-shell";

export default function AdminSettingsPage() {
  const { siteSettings, updateSetting, addDepositAddress } = useApp();
  const [bannerText, setBannerText] = useState(siteSettings.find((entry) => entry.key === "bannerText")?.value ?? "");
  const [partners, setPartners] = useState(siteSettings.find((entry) => entry.key === "partners")?.value ?? "");
  const [label, setLabel] = useState("");
  const [address, setAddress] = useState("");
  const [chain, setChain] = useState("");

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-white/10 bg-[#12162a] p-6">
        <p className="text-sm uppercase tracking-[0.35em] text-[#00ff87]">Site settings</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Edit promotional content and deposit addresses</h1>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-[24px] border border-white/10 bg-[#1a1d2e] p-6">
          <h2 className="text-xl font-semibold text-white">Content controls</h2>
          <div className="mt-4 space-y-4">
            <input value={bannerText} onChange={(e) => setBannerText(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-[#0d0f14] p-3 text-white" placeholder="Banner text" />
            <button onClick={() => updateSetting("bannerText", bannerText)} className="rounded-full bg-[#00ff87] px-4 py-2 text-sm font-semibold text-[#07110b]">Save banner</button>
            <input value={partners} onChange={(e) => setPartners(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-[#0d0f14] p-3 text-white" placeholder="Partners separated by commas" />
            <button onClick={() => updateSetting("partners", partners)} className="rounded-full bg-[#00ff87] px-4 py-2 text-sm font-semibold text-[#07110b]">Save partners</button>
          </div>
        </div>
        <div className="rounded-[24px] border border-white/10 bg-[#1a1d2e] p-6">
          <h2 className="text-xl font-semibold text-white">Deposit addresses</h2>
          <div className="mt-4 space-y-3">
            <input value={label} onChange={(e) => setLabel(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-[#0d0f14] p-3 text-white" placeholder="Label" />
            <input value={address} onChange={(e) => setAddress(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-[#0d0f14] p-3 text-white" placeholder="Wallet address" />
            <input value={chain} onChange={(e) => setChain(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-[#0d0f14] p-3 text-white" placeholder="Chain" />
            <button onClick={() => addDepositAddress(label, address, chain)} className="rounded-full bg-[#00ff87] px-4 py-2 text-sm font-semibold text-[#07110b]">Add address</button>
          </div>
        </div>
      </div>
    </div>
  );
}
