import Link from "next/link";
import { jubileeProducts } from "@/app/lib/jubilee-products";
export default function ProductsPage() { return <div>
  <h1 className="text-3xl font-semibold mb-3">Jubileumproducten</h1>
  <p className="text-stone-600 max-w-3xl">De basis is een jubileumboek met een interactieve digitale editie. Alle previews tonen onderstaande aanvullingen en laten de bezoeker een wensenlijst samenstellen.</p>
  <Link href="/demo#mogelijkheden" target="_blank" className="inline-block my-5 bg-stone-900 text-white px-5 py-3 rounded">Open de interactieve productdemo ↗</Link>
  <div className="bg-amber-50 border border-amber-200 p-5 rounded mb-6 text-sm"><strong>Van interesse naar opdracht</strong><p className="mt-2">De bezoeker opent een e-mail met de gekozen producten, aanleiding en wensen, of downloadt de wensenlijst. Er wordt niets automatisch ingestuurd of in het CRM opgeslagen. Noteer een ontvangen aanvraag bij de lead en stem inhoud, rechten, uitvoering, planning en kosten af voordat je iets toezegt.</p><p className="mt-2">De voorbeelden zijn demonstraties. Productie van drukwerk, interviews, film, QR-luisterpagina’s en een inzendportaal vraagt een afzonderlijke afspraak.</p></div>
  <div className="grid md:grid-cols-2 gap-4">{jubileeProducts.map(p=><article key={p.id} className="bg-white border border-stone-200 p-6 rounded"><h2 className="text-xl font-semibold">{p.title}</h2><p className="text-sm mt-2 text-stone-600">{p.description}</p><dl className="text-sm mt-4 space-y-2"><dt className="font-semibold">Aanleiding</dt><dd>{p.occasion}</dd><dt className="font-semibold">Voorstel omvat</dt><dd>{p.deliverable}</dd><dt className="font-semibold">Vooraf verzamelen en afspreken</dt><dd>{p.needs}</dd></dl></article>)}</div>
</div> }
