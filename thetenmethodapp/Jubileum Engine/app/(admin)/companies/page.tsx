export const dynamic = "force-dynamic";

import Link from "next/link";
import { getCompanies } from "@/app/actions/data";
import { CompanyForm, CsvImport } from "@/app/components/CompanyForm";

export default async function CompaniesPage() {
  const companies = await getCompanies();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Bedrijven</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-stone-200">
          <h2 className="text-lg font-semibold mb-4">Nieuw bedrijf</h2>
          <CompanyForm />
        </div>
        <div className="bg-white p-6 rounded-lg border border-stone-200">
          <h2 className="text-lg font-semibold mb-4">CSV import</h2>
          <CsvImport />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-100">
            <tr>
              <th className="text-left px-4 py-2 font-medium">Naam</th>
              <th className="text-left px-4 py-2 font-medium">Plaats</th>
              <th className="text-left px-4 py-2 font-medium">Oprichting</th>
              <th className="text-left px-4 py-2 font-medium">Jubileum</th>
              <th className="text-left px-4 py-2 font-medium">Score</th>
              <th className="text-left px-4 py-2 font-medium">Stage</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((c) => (
              <tr key={c.id} className="border-t border-stone-100">
                <td className="px-4 py-2">
                  <Link href={`/companies/${c.id}`} className="font-medium hover:underline">
                    {c.name}
                  </Link>
                  {c.isDemo && <span className="ml-2 text-xs text-stone-400">DEMO</span>}
                </td>
                <td className="px-4 py-2">{c.city}</td>
                <td className="px-4 py-2">{c.foundationYear ?? "—"}</td>
                <td className="px-4 py-2">
                  {c.anniversary.anniversaryAge ? `${c.anniversary.anniversaryAge} jaar (${c.anniversary.anniversaryYear})` : "—"}
                </td>
                <td className="px-4 py-2">{c.lead?.score ?? "—"}</td>
                <td className="px-4 py-2">
                  <span className="px-2 py-1 rounded-full bg-stone-100 text-xs">{c.lead?.stage ?? "—"}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
