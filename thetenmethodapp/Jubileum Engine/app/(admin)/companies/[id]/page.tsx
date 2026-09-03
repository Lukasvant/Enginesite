export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { getCompany } from "@/app/actions/data";
import { CompanyForm } from "@/app/components/CompanyForm";
import { ContactForm } from "@/app/components/ContactForm";
import { ResearchPanel } from "@/app/components/ResearchPanel";
import { EventsPanel } from "@/app/components/EventsPanel";
import { ClaimsPanel } from "@/app/components/ClaimsPanel";
import { PreviewPanel } from "@/app/components/PreviewPanel";
import { OutreachPanel } from "@/app/components/OutreachPanel";
import { deleteCompany } from "@/app/actions/companies";

export default async function CompanyDetailPage({ params }: { params: { id: string } }) {
  const company = await getCompany(params.id);
  if (!company) notFound();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/companies" className="text-sm text-stone-500 hover:underline">← Terug naar bedrijven</Link>
          <h1 className="text-2xl font-semibold mt-1">{company.name}</h1>
        </div>
        <form action={deleteCompany.bind(null, company.id)}>
          <button type="submit" className="text-sm text-red-600 hover:text-red-800 border border-red-200 px-3 py-1 rounded">
            Verwijderen
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-stone-200">
          <h2 className="text-lg font-semibold mb-4">Bedrijfsgegevens</h2>
          <CompanyForm company={company} />
        </div>
        <div className="bg-white p-6 rounded-lg border border-stone-200">
          <h2 className="text-lg font-semibold mb-4">Samenvatting</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-stone-500">Oprichting</dt><dd>{company.foundationYear ?? "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-stone-500">Betrouwbaarheid</dt><dd>{company.foundationConfidence ?? "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-stone-500">Volgend jubileum</dt><dd>{company.anniversary.anniversaryAge ? `${company.anniversary.anniversaryAge} jaar` : "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-stone-500">Jubileumjaar</dt><dd>{company.anniversary.anniversaryYear ?? "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-stone-500">Maanden tot</dt><dd>{company.anniversary.monthsUntil ?? "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-stone-500">Lead score</dt><dd>{company.leads[0]?.score ?? "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-stone-500">Stage</dt><dd>{company.leads[0]?.stage ?? "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-stone-500">Next action</dt><dd>{company.leads[0]?.nextAction ?? "—"}</dd></div>
          </dl>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-stone-200">
          <h2 className="text-lg font-semibold mb-4">Contactpersonen</h2>
          <ContactForm companyId={company.id} contacts={company.contacts} />
        </div>
        <div className="bg-white p-6 rounded-lg border border-stone-200">
          <h2 className="text-lg font-semibold mb-4">Onderzoek</h2>
          <ResearchPanel companyId={company.id} sources={company.researchSources} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ClaimsPanel companyId={company.id} claims={company.claims} sources={company.researchSources} />
        <EventsPanel companyId={company.id} events={company.events} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <PreviewPanel companyId={company.id} previews={company.previews} />
        <OutreachPanel lead={company.leads[0]} />
      </div>
    </div>
  );
}
