import Link from "next/link";
import { notFound } from "next/navigation";
import { productCategories, jubileeProducts } from "@/app/lib/jubilee-products";
import { breadcrumbs, jsonLd, pageMetadata, siteUrl } from "@/app/lib/seo";
import s from "../../components/jubilee-public.module.css";
export function generateStaticParams() { return productCategories.map(category => ({ category: category.id })); }
export function generateMetadata({ params }: { params: { category: string } }) {
  const category = productCategories.find(item => item.id === params.category);
  if (!category) notFound();
  return pageMetadata(`/soorten/${category.id}`, category.title, `${category.intro} Ontdek de mogelijkheden voor een jubileum en stel een passende combinatie samen.`);
}
export default function CategoryPage({ params }: { params: { category: string } }) {
  const category = productCategories.find(item => item.id === params.category);
  if (!category) notFound();
  const products = jubileeProducts.filter(item => item.category === category.id);
  const trail = breadcrumbs([{ name: "Jubileum Engine", path: "/" }, { name: "Mogelijkheden", path: "/mogelijkheden" }, { name: category.title, path: `/soorten/${category.id}` }]);
  const list = { "@context": "https://schema.org", "@type": "ItemList", name: category.title, itemListElement: products.map((product, index) => ({ "@type": "ListItem", position: index + 1, name: product.title, url: `${siteUrl}/mogelijkheden/${product.id}` })) };
  return <main className={s.page}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(trail) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(list) }} />
    <header className={s.nav}><Link className={s.brand} href="/">Jubileum Engine</Link><nav className={s.navLinks}><Link href="/mogelijkheden">Mogelijkheden</Link><Link href="/programmas">Programma’s</Link><Link href="/samenstellen">Samenstellen</Link></nav></header>
    <section className={s.section}><Link className={s.crumb} href="/mogelijkheden">← Alle mogelijkheden</Link><p className={s.eyebrow}>MOGELIJKHEDEN VOOR JULLIE JUBILEUM</p><h1>{category.title}</h1><p>{category.intro}</p><p>Deze mogelijkheden zijn geen vaste pakketten: we bepalen samen wat bij jullie mensen, verhaal en moment past.</p>
      <div className={s.catalogGrid}>{products.map(product => <article className={s.card} key={product.id}><h2>{product.title}</h2><p>{product.description}</p><Link href={`/mogelijkheden/${product.id}`}>Bekijk mogelijkheid →</Link></article>)}</div>
    </section>
    <section className={s.section}><p className={s.eyebrow}>VAAK GESTELD</p><h2>Hoe kiezen we een passende vorm?</h2><p>Begin bij het doel van jullie jubileum. Willen jullie mensen bedanken, relaties betrekken, geschiedenis bewaren of samen vieren? Daarna kiezen we de vorm, inhoud en uitvoering.</p><Link className={s.button} href="/samenstellen">Stel jullie jubileumwensen samen</Link></section>
  </main>;
}
