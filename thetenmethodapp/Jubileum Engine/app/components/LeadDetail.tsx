"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { addActivity, updateLeadStage } from "@/app/actions/companies";

export default function LeadDetailPage({ lead }: { lead: any }) {
  const router = useRouter();

  async function handleNote(formData: FormData) {
    const note = formData.get("note") as string;
    await addActivity(lead.id, "NOTE", note);
    router.refresh();
  }

  async function handleStage(stage: string) {
    await updateLeadStage(lead.id, stage);
    router.refresh();
  }

  const scoreReasons = lead.scoreReasons ? (JSON.parse(lead.scoreReasons) as string[]) : [];

  return (
    <div>
      <Link href="/leads" className="text-sm text-stone-500 hover:underline">← Terug naar leads</Link>
      <h1 className="text-2xl font-semibold mt-1 mb-2">{lead.company.name}</h1>
      <div className="text-stone-500 mb-6">Stage: {lead.stage} · Score: {lead.score}</div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-stone-200">
          <h2 className="text-lg font-semibold mb-4">Score uitleg</h2>
          <ul className="text-sm space-y-1">
            {scoreReasons.map((r: string, i: number) => (
              <li key={i} className="text-stone-700">• {r}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg border border-stone-200">
          <h2 className="text-lg font-semibold mb-4">Pipeline</h2>
          <div className="flex flex-wrap gap-2">
            {["FOUND", "RESEARCHING", "QUALIFIED", "PREVIEW_READY", "OUTREACH_READY", "CONTACTED", "FOLLOW_UP", "REPLIED", "MEETING", "PROPOSAL", "WON", "LOST", "DO_NOT_CONTACT"].map((stage) => (
              <button
                key={stage}
                onClick={() => handleStage(stage)}
                className={`text-xs px-2 py-1 rounded border ${lead.stage === stage ? "bg-stone-900 text-white" : "bg-white border-stone-300"}`}
              >
                {stage}
              </button>
            ))}
          </div>
          <div className="mt-4 text-sm font-medium">Next action: {lead.nextAction}</div>
        </div>
      </div>

      {lead.outreachMessages.length > 0 && (
        <div className="bg-white p-6 rounded-lg border border-stone-200 mb-8">
          <h2 className="text-lg font-semibold mb-4">Outreach</h2>
          {lead.outreachMessages.map((m: any) => (
            <div key={m.id} className="mb-4 border border-stone-100 rounded p-3">
              <div className="text-sm font-medium">{m.subject}</div>
              <div className="text-xs text-stone-500 mb-2">{m.isApproved ? (m.sentAt ? "Verzonden" : "Goedgekeurd") : "Concept"}</div>
              <pre className="whitespace-pre-wrap font-sans text-sm text-stone-700 bg-stone-50 p-2 rounded">{m.body}</pre>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg border border-stone-200 mb-8">
        <h2 className="text-lg font-semibold mb-4">Activiteit</h2>
        <ul className="text-sm space-y-2 mb-4 max-h-64 overflow-auto">
          {lead.outreachActivities.map((a: any) => (
            <li key={a.id} className="border border-stone-100 rounded p-2">
              <span className="font-medium">{a.type}</span>
              <span className="text-stone-500 ml-2">{new Date(a.createdAt).toLocaleString("nl-NL")}</span>
              {a.note && <p className="text-stone-600 mt-1">{a.note}</p>}
            </li>
          ))}
        </ul>
        <form action={handleNote} className="space-y-2">
          <textarea name="note" rows={2} placeholder="Notitie..." className="w-full border border-stone-300 rounded px-2 py-1 text-sm" />
          <button type="submit" className="bg-stone-900 text-white text-sm px-3 py-1 rounded">Notitie toevoegen</button>
        </form>
      </div>
    </div>
  );
}
