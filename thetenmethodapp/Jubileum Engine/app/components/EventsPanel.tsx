"use client";

import { useRouter } from "next/navigation";
import { addHistoricalEvent } from "@/app/actions/companies";

const STATUSES = ["VERIFIED", "LIKELY", "UNCERTAIN", "CONFLICTING", "REJECTED"];

export function EventsPanel({ companyId, events }: { companyId: string; events: any[] }) {
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    const data = Object.fromEntries(formData.entries()) as any;
    await addHistoricalEvent(companyId, {
      year: data.year ? parseInt(data.year) : undefined,
      title: data.title,
      description: data.description,
      source: data.source,
      sourceUrl: data.sourceUrl,
      excerpt: data.excerpt,
      confidence: parseFloat(data.confidence),
      status: data.status,
      isMilestone: data.isMilestone === "on",
    });
    router.refresh();
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Historische gebeurtenissen</h2>
      <ul className="mb-4 space-y-2 text-sm max-h-64 overflow-auto">
        {events.map((e) => (
          <li key={e.id} className="border border-stone-100 rounded p-2">
            <div className="flex justify-between">
              <span className="font-medium">{e.year} — {e.title}</span>
              {e.isMilestone && <span className="text-xs bg-stone-100 px-1 rounded">mijlpaal</span>}
            </div>
            <div className="text-stone-500 text-xs">{e.description}</div>
          </li>
        ))}
      </ul>
      <form action={handleSubmit} className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <input name="year" type="number" placeholder="Jaar" className="border border-stone-300 rounded px-2 py-1 text-sm" />
          <input name="title" placeholder="Titel" required className="border border-stone-300 rounded px-2 py-1 text-sm" />
        </div>
        <textarea name="description" placeholder="Beschrijving" rows={2} className="w-full border border-stone-300 rounded px-2 py-1 text-sm" />
        <input name="source" placeholder="Bron" className="w-full border border-stone-300 rounded px-2 py-1 text-sm" />
        <input name="sourceUrl" placeholder="Bron URL" className="w-full border border-stone-300 rounded px-2 py-1 text-sm" />
        <div className="grid grid-cols-2 gap-2">
          <input name="confidence" type="number" step="0.1" max="1" min="0" placeholder="0.0-1.0" required className="border border-stone-300 rounded px-2 py-1 text-sm" />
          <select name="status" className="border border-stone-300 rounded px-2 py-1 text-sm">
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm"><input name="isMilestone" type="checkbox" /> Mijlpaal</label>
        <button type="submit" className="bg-stone-700 text-white text-sm px-3 py-1 rounded">Gebeurtenis toevoegen</button>
      </form>
    </div>
  );
}
