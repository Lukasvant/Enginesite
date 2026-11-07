import Link from "next/link";
import { notFound } from "next/navigation";
import { jubileePrograms, productById } from "@/app/lib/jubilee-products";
import { JubileeComposer } from "@/app/components/JubileeComposer";
import { breadcrumbs, jsonLd, pageMetadata } from "@/app/lib/seo";
import s from "../../components/jubilee-public.module.css";
export function generateStaticParams() { return jubileePrograms.map(program => ({ id: program.id })); }
export function generateMetadata({ params }: { params: { id: string } }) {
  const program = jubileePrograms.find(item => item.id === params.id);
  if (!program) notFound();
  return pageMetadata(`/programmas/${program.id}`, program.title, `${program.text} Bekijk de voorgestelde onderdelen en pas de selectie aan in de samensteller.`);
}
export default function ProgramPage({ params }: { params: { id: string } }) {
  const program = jubileePrograms.find(item => item.id === params.id);
  if (!program) notFound();
  const trail = breadcrumbs([{ name: "Jubileum Engine", path: "/" }, { name: "Programma’s", path: "/programmas" }, { name: program.title, path: `/programmas/${program.id}` }]);
  return <main className={s.page}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(trail) }} />
    <header className={s.nav}><Link className={s.brand} href="/">Jubileum Engine</Link><nav className={s.navLinks}><Link href="/mogelijkheden">Mogelijkheden</Link><Link href="/programmas">Programma’s</Link><Link href="/samenstellen">Samenstellen</Link></nav></header>
    <section className={s.section}><Link className={s.crumb} href="/programmas">← Alle programma’s</Link><p className={s.eyebrow}>JUBILEUMPROGRAMMA</p><h1>{program.title}</h1><p>{program.text}</p><h2>Onderdelen om te bespreken</h2><p>Deze onderdelen zijn alvast geselecteerd in de samensteller hieronder. Je kunt ze weghalen of andere mogelijkheden toevoegen.</p>
      <div className={s.catalogGrid}>{program.products.map(id => { const product = productById(id); return product ? <article className={s.card} key={id}><h3>{product.title}</h3><p>{product.short}</p><Link href={`/mogelijkheden/${id}`}>Bekijk mogelijkheid →</Link></article> : null; })}</div>
    </section><JubileeComposer initialSelected={[...program.products]} />
  </main>;
}
