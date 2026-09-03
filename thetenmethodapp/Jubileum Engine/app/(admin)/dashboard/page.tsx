export const dynamic = "force-dynamic";

import Link from "next/link";
import { getMetrics } from "@/app/actions/metrics";

export default async function DashboardPage() {
  const m = await getMetrics();

  const cards = [
    { label: "Bedrijven", value: m.totalCompanies, href: "/companies" },
    { label: "Leads", value: m.totalLeads, href: "/leads" },
    { label: "Previews", value: m.previews, href: "/previews" },
    { label: "Goedgekeurde outreach", value: m.outreachApproved, href: "/leads" },
    { label: "Verzonden outreach", value: m.outreachSent, href: "/leads" },
    { label: "Won deals", value: m.won, href: "/leads" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white p-6 rounded-lg border border-stone-200 shadow-sm hover:shadow transition"
          >
            <div className="text-3xl font-bold">{card.value}</div>
            <div className="text-stone-500 mt-1">{card.label}</div>
          </Link>
        ))}
      </div>

      <h2 className="text-lg font-semibold mb-4">Pipeline stages</h2>
      <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-100">
            <tr>
              <th className="text-left px-4 py-2 font-medium">Stage</th>
              <th className="text-right px-4 py-2 font-medium">Aantal</th>
            </tr>
          </thead>
          <tbody>
            {m.stageCounts.map((s) => (
              <tr key={s.stage} className="border-t border-stone-100">
                <td className="px-4 py-2">{s.stage}</td>
                <td className="px-4 py-2 text-right">{s._count.stage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
