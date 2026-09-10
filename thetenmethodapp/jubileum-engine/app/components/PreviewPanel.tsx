"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { generatePreview } from "@/app/actions/companies";

export function PreviewPanel({ companyId, previews }: { companyId: string; previews: any[] }) {
  const router = useRouter();

  async function handleGenerate() {
    await generatePreview(companyId);
    router.refresh();
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Preview</h2>
      <p className="text-sm text-stone-500 mb-3">Inclusief interactief boek, acht productmogelijkheden en een persoonlijke wensenlijst. <Link href="/products" className="underline">Bekijk het aanbod</Link></p>
      <form action={handleGenerate} className="mb-4">
        <button type="submit" className="bg-stone-900 text-white text-sm px-3 py-1 rounded">Genereer preview</button>
      </form>
      <ul className="space-y-2 text-sm">
        {previews.map((p) => (
          <li key={p.id} className="border border-stone-100 rounded p-2 flex justify-between items-center">
            <div>
              <div className="font-medium">{p.title}</div>
              <div className="text-stone-500 text-xs">{new Date(p.createdAt).toLocaleDateString("nl-NL")}</div>
            </div>
            <Link href={`/preview/${p.token}`} target="_blank" className="text-blue-600 hover:underline text-sm">Bekijk</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
