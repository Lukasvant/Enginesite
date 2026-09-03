export const dynamic = "force-dynamic";

import Link from "next/link";
import { getLeads } from "@/app/actions/leads";

export default async function LeadsPage() {
  const leads = await getLeads();

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Leads</h1>

      <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-100">
            <tr>
              <th className="text-left px-4 py-2 font-medium">Bedrijf</th>
              <th className="text-left px-4 py-2 font-medium">Jubileum</th>
              <th className="text-left px-4 py-2 font-medium">Score</th>
              <th className="text-left px-4 py-2 font-medium">Stage</th>
              <th className="text-left px-4 py-2 font-medium">Next action</th>
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
                <td className="px-4 py-2 text-stone-500">{l.nextAction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
