"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { approveOutreach, generateOutreach, markOutreachSent, sendOutreach, updateOutreachMessage } from "@/app/actions/companies";

export function OutreachWorkspace({ lead, mailConfigured }: { lead: any; mailConfigured: boolean }) {
  const router = useRouter();
  const latest = lead.outreachMessages[0];
  const [subject, setSubject] = useState(latest?.subject ?? "");
  const [body, setBody] = useState(latest?.body ?? "");
  const [busy, setBusy] = useState(false);
  const contact = lead.company.contacts.find((item: any) => item.isPrimary) ?? lead.company.contacts[0];
  const evidence = lead.company.foundationEvidence;

  async function run(action: () => Promise<unknown>) {
    setBusy(true);
    try { await action(); router.refresh(); } finally { setBusy(false); }
  }

  async function copyMessage() {
    await navigator.clipboard.writeText(`${subject ? `${subject}\n\n` : ""}${body}`);
  }

  return (
    <section className="space-y-5">
      <div className="bg-stone-900 text-white rounded-lg p-5">
        <p className="text-xs uppercase tracking-wide text-stone-300">Volgende stap</p>
        <p className="text-lg font-medium mt-1">{lead.nextAction ?? "Bereid persoonlijk contact voor"}</p>
        <p className="text-sm text-stone-300 mt-2">Je verstuurt pas nadat je het concept hebt gecontroleerd en zelf op de verzendknop klikt.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="border border-stone-200 rounded-lg p-4 bg-white">
          <h2 className="font-semibold">Contact en bron</h2>
          {contact ? <div className="mt-2 text-sm space-y-1"><p>{contact.name}{contact.role ? ` · ${contact.role}` : ""}</p>{contact.email && <a className="text-blue-700 underline" href={`mailto:${contact.email}`}>{contact.email}</a>}{contact.linkedIn && <a className="block text-blue-700 underline" href={contact.linkedIn} target="_blank" rel="noreferrer">Open LinkedIn</a>}</div> : <p className="mt-2 text-sm text-stone-600">Nog geen contactpersoon. Begin via de bedrijfswebsite en voeg daarna de juiste persoon toe bij het bedrijf.</p>}
          {lead.company.website && <a className="inline-block mt-3 text-sm text-blue-700 underline" href={lead.company.website} target="_blank" rel="noreferrer">Open bedrijfswebsite</a>}
          {evidence && <p className="mt-3 text-xs text-stone-500">Historie: {evidence}</p>}
        </div>
        <div className="border border-stone-200 rounded-lg p-4 bg-white">
          <h2 className="font-semibold">Persoonlijke haak</h2>
          <p className="mt-2 text-sm text-stone-600">Gebruik alleen een historische claim die de app als geverifieerd toont. Noem geen jubileumjaar als dat niet aansluit op de eerstvolgende mijlpaal.</p>
          <p className="mt-3 text-sm font-medium">Volgende mijlpaal: {lead.anniversary.anniversaryAge ? `${lead.anniversary.anniversaryAge} jaar in ${lead.anniversary.anniversaryYear}` : "nog onbekend"}</p>
        </div>
      </div>

      {!latest ? (
        <button disabled={busy} onClick={() => run(() => generateOutreach(lead.id))} className="bg-stone-900 text-white px-4 py-2 rounded text-sm disabled:opacity-50">Maak e-mailconcept</button>
      ) : (
        <div className="border border-stone-200 rounded-lg p-5 bg-white space-y-3">
          <div className="flex items-center justify-between gap-3"><h2 className="font-semibold">E-mailconcept</h2><span className="text-xs text-stone-500">{latest.sentAt ? "Handmatig verstuurd" : latest.isApproved ? "Klaar om te versturen" : "Nog controleren"}</span></div>
          <input value={subject} disabled={Boolean(latest.sentAt)} onChange={(event) => setSubject(event.target.value)} placeholder="Onderwerp" className="w-full rounded border border-stone-300 px-3 py-2 text-sm" />
          <textarea value={body} disabled={Boolean(latest.sentAt)} onChange={(event) => setBody(event.target.value)} rows={14} className="w-full rounded border border-stone-300 px-3 py-2 text-sm leading-6" />
          {!latest.sentAt && <div className="flex flex-wrap gap-2"><button disabled={busy} onClick={() => run(() => updateOutreachMessage(latest.id, { subject, body }))} className="border border-stone-300 px-3 py-2 rounded text-sm disabled:opacity-50">Concept opslaan</button>{!latest.isApproved && <button disabled={busy} onClick={() => run(() => approveOutreach(latest.id))} className="bg-stone-900 text-white px-3 py-2 rounded text-sm disabled:opacity-50">Concept goedkeuren</button>}</div>}
          <div className="pt-2 border-t border-stone-100 flex flex-wrap gap-2"><button disabled={busy} onClick={copyMessage} className="border border-stone-300 px-3 py-2 rounded text-sm disabled:opacity-50">Kopieer tekst</button>{latest.isApproved && !latest.sentAt && <>{mailConfigured && contact?.email && <button disabled={busy} onClick={() => run(() => sendOutreach(latest.id))} className="bg-emerald-700 text-white px-3 py-2 rounded text-sm disabled:opacity-50">Verstuur via Ambachtio</button>}<button disabled={busy} onClick={() => run(() => markOutreachSent(latest.id))} className="bg-blue-700 text-white px-3 py-2 rounded text-sm disabled:opacity-50">Ik heb dit handmatig verstuurd</button></>}</div>
          {!mailConfigured && <p className="text-xs text-amber-700">Automatisch versturen is nog niet gekoppeld aan Infomaniak. Je kunt de tekst wel kopiëren of handmatig als verstuurd registreren.</p>}
          {mailConfigured && !contact?.email && <p className="text-xs text-amber-700">Voeg eerst een contactpersoon met e-mailadres toe voordat je rechtstreeks kunt versturen.</p>}
        </div>
      )}
    </section>
  );
}
