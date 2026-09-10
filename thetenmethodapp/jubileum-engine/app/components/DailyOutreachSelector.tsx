"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { prepareTodayOutreach, toggleTodayOutreachLead } from "@/app/actions/companies";

export function DailyOutreachSelector({ leads, initialIds }: { leads: any[]; initialIds: string[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState(() => new Set(initialIds));
  const [busy, setBusy] = useState(false);

  async function toggle(id: string) {
    const next = new Set(selected);
    const isSelected = !next.has(id);
    if (isSelected) next.add(id); else next.delete(id);
    setSelected(next);
    try { await toggleTodayOutreachLead(id, isSelected); } catch { setSelected(selected); }
  }

  async function prepare() {
    setBusy(true);
    try { await prepareTodayOutreach(); router.refresh(); } finally { setBusy(false); }
  }

  return (
    <>
      <div className="sticky top-3 z-10 mb-4 rounded-lg bg-stone-900 text-white p-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between shadow-lg">
        <div><p className="font-medium">Vandaag geselecteerd: {selected.size}</p><p className="text-sm text-stone-300">Maakt per gekozen bedrijf één conceptmail en één persoonlijke product-preview.</p></div>
        <button disabled={busy || selected.size === 0} onClick={prepare} className="rounded bg-white px-4 py-2 text-sm font-medium text-stone-900 disabled:opacity-50">{busy ? "Concepten maken…" : "Maak dagconcepten"}</button>
      </div>
      <div className="sr-only" aria-live="polite">{selected.size} bedrijven geselecteerd</div>
      <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-100"><tr><th className="w-12 px-4 py-2 text-left">Vandaag</th><th className="text-left px-4 py-2 font-medium">Bedrijf</th><th className="text-left px-4 py-2 font-medium">Jubileum</th><th className="text-left px-4 py-2 font-medium">Score</th><th className="text-left px-4 py-2 font-medium">Klaar voor contact</th></tr></thead>
          <tbody>{leads.map((lead) => {
            const recipient = lead.company.contacts.find((contact: any) => contact.isPrimary && contact.email)
              ?? lead.company.contacts.find((contact: any) => contact.email);

            return <tr key={lead.id} className="border-t border-stone-100"><td className="px-4 py-3"><input aria-label={`${lead.company.name} selecteren voor vandaag`} type="checkbox" checked={selected.has(lead.id)} onChange={() => toggle(lead.id)} className="h-4 w-4 accent-stone-900" /></td><td className="px-4 py-3"><Link href={`/leads/${lead.id}`} className="font-medium hover:underline">{lead.company.name}</Link></td><td className="px-4 py-3">{lead.anniversary.anniversaryAge ? `${lead.anniversary.anniversaryAge} jaar (${lead.anniversary.anniversaryYear})` : "—"}</td><td className="px-4 py-3">{lead.score}</td><td className="px-4 py-3 text-stone-500"><div>{recipient ? `E-mail klaar: ${recipient.email}` : "Zoek contactpersoon met e-mail"}</div><div className="text-xs mt-1">{lead.company.claims.length ? "Historie geverifieerd" : lead.nextAction}</div></td></tr>;
          })}</tbody>
        </table>
      </div>
    </>
  );
}
