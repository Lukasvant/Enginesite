export const dynamic = "force-dynamic";

import Link from "next/link";
import { getLeads } from "@/app/actions/leads";

const VIEWS = [
  { key: "ready", label: "Klaar om te benaderen" },
  { key: "follow-up", label: "Opvolgen" },
  { key: "all", label: "Alle werkleads" },
];

export default async function LeadsPage({ searchParams }: { searchParams?: { view?: string } }) {
  const view = searchParams?.view ?? "ready";
  const filters = view === "follow-up"
    ? { stage: "FOLLOW_UP", take: 100 }
    : view === "all"
      ? { take: 100 }
      : { verifiedOnly: true, take: 100 };
  const leads = await getLeads(filters);

  return (
    <div>
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-2xl font-semibold">Werkvoorraad</h1>
        <p className="text-sm text-stone-600">Kies een bedrijf, maak een persoonlijk concept en verstuur het zelf vanuit je eigen e-mail of LinkedIn.</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {VIEWS.map((item) => (
          <Link key={item.key} href={item.key === "ready" ? "/leads" : `/leads?view=${item.key}`} className={`rounded-full px-3 py-1.5 text-sm ${view === item.key ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-700 hover:bg-stone-200"}`}>
            {item.label}
          </Link>
        ))}
      </div>

      <p className="text-sm text-stone-500 mb-3">{leads.length} bedrijven getoond (maximaal 100 per werklijst).</p>

      <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-100">
            <tr>
              <th className="text-left px-4 py-2 font-medium">Bedrijf</th>
              <th className="text-left px-4 py-2 font-medium">Jubileum</th>
              <th className="text-left px-4 py-2 font-medium">Score</th>
              <th className="text-left px-4 py-2 font-medium">Stage</th>
              <th className="text-left px-4 py-2 font-medium">Klaar voor contact</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((l) => (
              <tr key={l.id} className="border-t border-stone-100">
                <td className="px-4 py-2">
                  <Link href={`/leads/${l.id}`} className="font-medium hover:underline">
                    {l.company.name}
                  </Link>
                </td>
                <td className="px-4 py-2">
                  {l.anniversary.anniversaryAge ? `${l.anniversary.anniversaryAge} jaar (${l.anniversary.anniversaryYear})` : "—"}
                </td>
                <td className="px-4 py-2">{l.score}</td>
                <td className="px-4 py-2">
                  <span className="px-2 py-1 rounded-full bg-stone-100 text-xs">{l.stage}</span>
                </td>
                <td className="px-4 py-2 text-stone-500">
                  <div>{l.company.contacts.length ? "Contactpersoon bekend" : "Zoek contactpersoon"}</div>
                  <div className="text-xs mt-1">{l.company.claims.length ? "Historie geverifieerd" : l.nextAction}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
