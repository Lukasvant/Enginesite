export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";

export default async function PreviewPage({ params }: { params: { token: string } }) {
  const preview = await prisma.preview.findUnique({
    where: { token: params.token },
    include: { company: { include: { contacts: true, events: true } } },
  });

  if (!preview || !preview.isPublished) notFound();

  const milestones = JSON.parse(preview.milestones || "[]") as { year: number; title: string; description?: string }[];
  const foundationYear = preview.company.foundationYear;
  const currentYear = new Date().getFullYear();
  const age = foundationYear ? currentYear - foundationYear : null;

  return (
    <div className="min-h-screen bg-stone-50">
      <main className="max-w-3xl mx-auto px-6 py-16">
        <header className="mb-12 text-center">
          <div className="text-stone-500 text-sm uppercase tracking-widest mb-2">Ambachtio · Jubileum Engine</div>
          <h1 className="text-4xl md:text-5xl font-semibold text-stone-900 mb-4">{preview.company.name}</h1>
          <p className="text-xl text-stone-600">{preview.title}</p>
        </header>

        <section className="mb-10 overflow-hidden rounded-2xl bg-stone-900 p-5 md:p-8 text-stone-100 shadow-xl">
          <div className="mb-6 flex items-center justify-between text-xs uppercase tracking-[0.22em] text-stone-400"><span>Voorstel jubileumverhaal</span><span>Ambachtio</span></div>
          <div className="grid gap-5 md:grid-cols-[1.15fr_0.85fr] md:items-end">
            <div className="min-h-64 rounded-xl border border-stone-700 bg-gradient-to-br from-stone-700 via-stone-800 to-stone-950 p-7 flex flex-col justify-between">
              <div className="text-xs uppercase tracking-[0.2em] text-stone-300">{foundationYear ? `Sinds ${foundationYear}` : "Een verhaal in wording"}</div>
              <div><h2 className="text-3xl font-semibold leading-tight">{preview.company.name}</h2><p className="mt-3 text-stone-300">Een tastbare tijdlijn van mensen, momenten en vakmanschap.</p></div>
              <div className="mt-8 h-px w-20 bg-stone-400" />
            </div>
            <div className="rounded-xl bg-[#e7dfd2] p-6 text-stone-900 rotate-1 shadow-2xl">
              <p className="text-xs uppercase tracking-[0.18em] text-stone-500">Jubileumeditie</p>
              <p className="mt-8 text-5xl font-semibold">{age ? `${age}` : "—"}</p>
              <p className="text-lg">jaar vakmanschap</p>
              <div className="mt-8 border-t border-stone-300 pt-3 text-sm text-stone-600">Tijdlijn · portretten · mijlpalen</div>
            </div>
          </div>
          <p className="mt-5 text-xs text-stone-400">Visuele indruk van een mogelijke digitale jubileumpagina of gedrukt verhaal. De uiteindelijke vormgeving wordt samen bepaald.</p>
        </section>

        <section className="bg-white p-8 md:p-10 rounded-lg border border-stone-200 shadow-sm mb-10">
          <p className="text-lg text-stone-700 leading-relaxed">{preview.intro}</p>
        </section>

        <section className="relative border-l-2 border-stone-300 ml-4 md:ml-8 mb-12">
          {milestones.map((m, i) => (
            <div key={i} className="mb-10 pl-8 relative">
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-stone-900 border-4 border-stone-50" />
              <div className="text-3xl font-bold text-stone-900 mb-1">{m.year}</div>
              <h3 className="text-lg font-semibold text-stone-800 mb-1">{m.title}</h3>
              {m.description && <p className="text-stone-600 text-sm leading-relaxed">{m.description}</p>}
            </div>
          ))}
        </section>

        <section className="bg-stone-900 text-stone-100 p-8 md:p-10 rounded-lg">
          <p className="text-lg leading-relaxed mb-6">{preview.closing}</p>
          <a
            href="mailto:info@ambachtio.nl?subject=Vrijblijvende kennismaking jubileum"
            className="inline-block bg-stone-100 text-stone-900 px-6 py-3 rounded font-medium hover:bg-white transition"
          >
            Plan een vrijblijvende kennismaking
          </a>
          <p className="text-xs text-stone-400 mt-6">
            Dit is een privévoorvertoning gebaseerd op publieke bronnen. Verzonden op persoonlijke titel.
          </p>
        </section>
      </main>
    </div>
  );
}
