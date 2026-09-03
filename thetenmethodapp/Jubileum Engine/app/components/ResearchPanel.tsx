"use client";

import { useRouter } from "next/navigation";
import { runResearch, addResearchSource } from "@/app/actions/companies";

export function ResearchPanel({ companyId, sources }: { companyId: string; sources: any[] }) {
  const router = useRouter();

  async function handleAddSource(formData: FormData) {
    const data = Object.fromEntries(formData.entries()) as any;
    await addResearchSource(companyId, {
      title: data.title,
      url: data.url,
      sourceType: data.sourceType,
      content: data.content,
    });
    router.refresh();
  }

  async function handleResearch() {
    await runResearch(companyId);
    router.refresh();
  }

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <form action={handleResearch}>
          <button type="submit" className="bg-stone-900 text-white text-sm px-3 py-1 rounded">Start onderzoek</button>
        </form>
      </div>

      <ul className="mb-4 space-y-2 text-sm">
        {sources.map((s) => (
          <li key={s.id} className="border border-stone-100 rounded p-2">
            <div className="font-medium">{s.title}</div>
            <div className="text-stone-500 text-xs">{s.sourceType} {s.url && <a href={s.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">bekijk bron</a>}</div>
          </li>
        ))}
      </ul>

      <form action={handleAddSource} className="space-y-2">
        <input name="title" placeholder="Titel bron" required className="w-full border border-stone-300 rounded px-2 py-1 text-sm" />
        <input name="url" placeholder="URL" className="w-full border border-stone-300 rounded px-2 py-1 text-sm" />
        <input name="sourceType" placeholder="Type (WEBSITE, NEWS, ARCHIVE, MANUAL)" className="w-full border border-stone-300 rounded px-2 py-1 text-sm" />
        <textarea name="content" placeholder="Fragment / notitie" rows={2} className="w-full border border-stone-300 rounded px-2 py-1 text-sm" />
        <button type="submit" className="bg-stone-700 text-white text-sm px-3 py-1 rounded">Bron toevoegen</button>
      </form>
    </div>
  );
}
