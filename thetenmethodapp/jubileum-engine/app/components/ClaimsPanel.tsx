"use client";

import { useRouter } from "next/navigation";
import { addHistoricalClaim } from "@/app/actions/companies";

const CLAIM_STATUSES = ["VERIFIED", "LIKELY", "UNCERTAIN", "CONFLICTING", "REJECTED"];

export function ClaimsPanel({ companyId, claims, sources }: { companyId: string; claims: any[]; sources: any[] }) {
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    const data = Object.fromEntries(formData.entries()) as any;
    await addHistoricalClaim(companyId, {
      claim: data.claim,
      claimType: data.claimType,
      sourceId: data.sourceId || undefined,
      sourceExcerpt: data.sourceExcerpt,
      sourceDate: data.sourceDate,
      confidence: parseFloat(data.confidence),
      status: data.status,
    });
    router.refresh();
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Historische claims</h2>
      <ul className="mb-4 space-y-2 text-sm max-h-64 overflow-auto">
        {claims.map((c) => (
          <li key={c.id} className="border border-stone-100 rounded p-2">
            <div className="flex justify-between">
              <span className="font-medium">{c.claim}</span>
              <span className={`text-xs px-1 rounded ${statusColor(c.status)}`}>{c.status}</span>
            </div>
            <div className="text-stone-500 text-xs">confidence {c.confidence}</div>
          </li>
        ))}
      </ul>
      <form action={handleSubmit} className="space-y-2">
        <input name="claim" placeholder="Claim" required className="w-full border border-stone-300 rounded px-2 py-1 text-sm" />
        <input name="claimType" placeholder="Type (FOUNDATION, EXPANSION, ...)" className="w-full border border-stone-300 rounded px-2 py-1 text-sm" />
        <select name="sourceId" className="w-full border border-stone-300 rounded px-2 py-1 text-sm">
          <option value="">— Geen bron —</option>
          {sources.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
        </select>
        <textarea name="sourceExcerpt" placeholder="Bronfragment" rows={2} className="w-full border border-stone-300 rounded px-2 py-1 text-sm" />
        <div className="grid grid-cols-2 gap-2">
          <input name="confidence" type="number" step="0.1" max="1" min="0" placeholder="0.0-1.0" required className="border border-stone-300 rounded px-2 py-1 text-sm" />
          <select name="status" className="border border-stone-300 rounded px-2 py-1 text-sm">
            {CLAIM_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <button type="submit" className="bg-stone-700 text-white text-sm px-3 py-1 rounded">Claim toevoegen</button>
      </form>
    </div>
  );
}

function statusColor(status: string) {
  switch (status) {
    case "VERIFIED": return "bg-green-100 text-green-800";
    case "LIKELY": return "bg-blue-100 text-blue-800";
    case "UNCERTAIN": return "bg-yellow-100 text-yellow-800";
    case "CONFLICTING": return "bg-orange-100 text-orange-800";
    case "REJECTED": return "bg-red-100 text-red-800";
    default: return "bg-stone-100";
  }
}
