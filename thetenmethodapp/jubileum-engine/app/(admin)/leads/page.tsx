export const dynamic = "force-dynamic";

import Link from "next/link";
import { getLeads } from "@/app/actions/leads";
import { getTodayOutreachBatch } from "@/app/actions/leads";
import { DailyOutreachSelector } from "@/app/components/DailyOutreachSelector";

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
  const todayBatch = await getTodayOutreachBatch();
  const selectedToday = todayBatch?.items.map((item) => item.leadId) ?? [];

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

      <DailyOutreachSelector leads={leads} initialIds={selectedToday} />
    </div>
  );
}
