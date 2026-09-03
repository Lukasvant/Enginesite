export const dynamic = "force-dynamic";

import { prisma } from "@/app/lib/prisma";

export default async function PreviewsPage() {
  const previews = await prisma.preview.findMany({
    where: { isPublished: true },
    include: { company: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Previews</h1>
      <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-100">
            <tr>
              <th className="text-left px-4 py-2 font-medium">Bedrijf</th>
              <th className="text-left px-4 py-2 font-medium">Aangemaakt</th>
              <th className="text-left px-4 py-2 font-medium">Link</th>
            </tr>
          </thead>
          <tbody>
            {previews.map((p) => (
              <tr key={p.id} className="border-t border-stone-100">
                <td className="px-4 py-2">{p.company.name}</td>
                <td className="px-4 py-2">{new Date(p.createdAt).toLocaleDateString("nl-NL")}</td>
                <td className="px-4 py-2">
                  <a href={`/preview/${p.token}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                    /preview/{p.token}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
