"use client";

import { useRouter } from "next/navigation";
import { generateOutreach, approveOutreach, sendOutreach, updateLeadStage } from "@/app/actions/companies";

export function OutreachPanel({ lead }: { lead?: any }) {
  const router = useRouter();
  const message = lead?.outreachMessages?.[0];

  async function handleGenerate() {
    if (!lead) return;
    await generateOutreach(lead.id);
    router.refresh();
  }

  async function handleApprove() {
    if (!message) return;
    await approveOutreach(message.id);
    router.refresh();
  }

  async function handleSend() {
    if (!message) return;
    await sendOutreach(message.id);
    router.refresh();
  }

  if (!lead) return <div className="text-stone-500 text-sm">Geen lead voor dit bedrijf.</div>;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Outreach</h2>
      <div className="flex gap-2 mb-4">
        <form action={handleGenerate}><button type="submit" className="bg-stone-900 text-white text-sm px-3 py-1 rounded">Genereer concept</button></form>
        {message && (
          <>
            {!message.isApproved && <form action={handleApprove}><button type="submit" className="bg-green-700 text-white text-sm px-3 py-1 rounded">Goedkeuren</button></form>}
            {message.isApproved && !message.sentAt && <form action={handleSend}><button type="submit" className="bg-blue-700 text-white text-sm px-3 py-1 rounded">Verzenden</button></form>}
          </>
        )}
      </div>

      {message && (
        <div className="text-sm border border-stone-200 rounded p-3 bg-stone-50 space-y-2">
          <div><strong>Onderwerp:</strong> {message.subject}</div>
          <div><strong>Status:</strong> {message.isApproved ? (message.sentAt ? "Verzonden" : "Goedgekeurd") : "Concept"}</div>
          <pre className="whitespace-pre-wrap font-sans text-stone-700 bg-white p-2 rounded border border-stone-200">{message.body}</pre>
        </div>
      )}

      <div className="mt-4">
        <h3 className="text-sm font-medium mb-2">Stage wijzigen</h3>
        <div className="flex flex-wrap gap-2">
          {["FOUND", "RESEARCHING", "QUALIFIED", "PREVIEW_READY", "OUTREACH_READY", "CONTACTED", "FOLLOW_UP", "REPLIED", "MEETING", "PROPOSAL", "WON", "LOST", "DO_NOT_CONTACT"].map((stage) => (
            <form key={stage} action={() => updateLeadStage(lead.id, stage).then(() => router.refresh())}>
              <button type="submit" className={`text-xs px-2 py-1 rounded border ${lead.stage === stage ? "bg-stone-900 text-white" : "bg-white border-stone-300"}`}>
                {stage}
              </button>
            </form>
          ))}
        </div>
      </div>
    </div>
  );
}
