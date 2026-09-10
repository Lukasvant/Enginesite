"use client";

import { useRef, useState } from "react";
import { getEraContext } from "@/app/lib/era-context";
import s from "./book.module.css";

const chapters = ["Het begin", "Door de jaren", "De wereld toen", "De mensen", "Het volgende hoofdstuk"];
type Props = { name: string; foundationYear: number | null; intro: string; milestones: { year: number; title: string; description?: string }[]; contact: string };

export function InteractiveBook({ name, foundationYear, intro, milestones, contact }: Props) {
  const [opened, setOpened] = useState(false);
  const [chapter, setChapter] = useState(0);
  const [moment, setMoment] = useState(0);
  const touch = useRef<{x: number; y: number} | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const era = getEraContext(foundationYear);
  const events = milestones.filter(m => Number.isFinite(m.year) && m.year > 0).sort((a,b) => a.year-b.year);
  const selected = events[moment];
  function turn(next: number) { setChapter(Math.max(0, Math.min(4, next))); requestAnimationFrame(() => heading.current?.focus({preventScroll:true})); }
  function open() { setOpened(true); requestAnimationFrame(() => heading.current?.focus({preventScroll:true})); }
  return <section id="boek" className={s.section} aria-label="Interactief jubileumboek">
    <div className={s.top}><div><span className={s.label}>JULLIE VERHAAL, BLADZIJDE VOOR BLADZIJDE</span><h2>Neem even de tijd.<br /><em>Blader door jullie geschiedenis.</em></h2></div><p>Een eerste opzet voor {name}.<br />Vijf hoofdstukken om samen verder in te vullen.</p></div>
    {!opened ? <div className={s.closed}><div className={s.closedCover}><span>EEN PERSOONLIJKE JUBILEUMEDITIE</span><h3>{name}</h3><div className={s.coverSymbol}>Toen.<br /><em>Nu.</em><br />Straks.</div><span>{foundationYear ? `SINDS ${foundationYear}` : "HET VERHAAL VAN JULLIE BEDRIJF"}</span></div><div className={s.invite}><span className={s.label}>DIT BOEK BEGINT BIJ JULLIE</span><h3>Achter elk jaartal<br />zit een verhaal.</h3><p>Ontdek de eerste hoofdstukken. Van het begin tot de herinneringen die alleen jullie kennen.</p><button onClick={open} className={s.primary}>Open jullie verhaal <span>↗</span></button><small>Doorbladeren met de knoppen, pijltjestoetsen of een veeg.</small></div></div> : <div className={s.reader} onKeyDown={e => { if (e.target instanceof HTMLSelectElement) return; if(e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); turn(chapter + (e.key === "ArrowRight" ? 1 : -1)); } }}>
      <nav className={s.tabs} aria-label="Hoofdstukken">{chapters.map((title,i) => <button key={title} onClick={() => turn(i)} aria-current={i === chapter ? "step" : undefined}><span>0{i+1}</span>{title}</button>)}</nav>
      <div className={s.spread} onTouchStart={e => {touch.current={x:e.touches[0].clientX,y:e.touches[0].clientY};}} onTouchEnd={e => { const start=touch.current; touch.current=null; if(!start) return; const dx=e.changedTouches[0].clientX-start.x; const dy=e.changedTouches[0].clientY-start.y; if(Math.abs(dx)>60 && Math.abs(dx)>Math.abs(dy)*1.5) turn(chapter+(dx<0?1:-1)); }}>
        <div className={s.artPage} aria-hidden="true"><span>{name}</span><div key={chapter} className={s.artContent}><div className={s.numeral}>{chapter===0 ? foundationYear || "Toen" : chapter===1 ? "↗" : chapter===2 ? "Toen" : chapter===3 ? "Wij." : "→"}</div><p>{["Elk verhaal heeft een eerste bladzijde.","Momenten die samen geschiedenis worden.","Een bedrijf begint. De wereld beweegt mee.","Een naam op de gevel. Mensen in het verhaal.","Het mooiste hoofdstuk schrijven we samen."][chapter]}</p><div className={s.rings} /></div><span>JUBILEUMEDITIE / 0{chapter+1}</span></div>
        <article key={chapter} className={s.page}>
          <span className={s.label}>HOOFDSTUK 0{chapter+1}</span><h3 ref={heading} tabIndex={-1}>{chapters[chapter]}</h3>
          {chapter===0 && <><p className={s.large}>{foundationYear ? `In ${foundationYear} begint het verhaal.` : "Ieder bedrijf begint met een eerste stap."}</p><p>{intro}</p><aside>De eerste opzet is gebaseerd op publieke bronnen. Samen controleren en verrijken we de geschiedenis.</aside></>}
          {chapter===1 && <>{events.length ? <><p>Kies een jaartal en ontdek het moment erachter.</p><div className={s.years} aria-label="Mijlpalen">{events.map((m,i)=><button key={`${m.year}-${i}`} aria-pressed={moment===i} onClick={()=>setMoment(i)}>{m.year}<span className={s.sr}>: {m.title}</span></button>)}</div><div className={s.event} aria-live="polite"><span>{selected.year}</span><h4>{selected.title}</h4><p>{selected.description || "Dit moment werken we samen verder uit."}</p></div></> : <><p className={s.large}>Welke momenten maakten jullie tot wie jullie zijn?</p><p>Er zijn nog geen mijlpalen beschikbaar. Met jullie archief en herinneringen vullen we deze tijdlijn samen in.</p></>}</>}
          {chapter===2 && <>{era ? <><p className={s.large}>{era.headline}</p><p>{era.description}</p><a href={era.sourceUrl} target="_blank" rel="noreferrer">Lees de contextbron ↗</a><aside>Algemene tijdscontext ({era.period}). Dit is geen gebeurtenis uit jullie bedrijfsgeschiedenis.</aside></> : <><p className={s.large}>Hoe zag de wereld eruit toen jullie begonnen?</p><p>Zodra het oprichtingsjaar bekend is, geven we hier een inkijkje in die tijd.</p><aside>Deze pagina is nog in te vullen.</aside></>}</>}
          {chapter===3 && <><div className={s.photo}><span>Jullie foto.<br /><em>Jullie herinnering.</em></span><small>RUIMTE VOOR EIGEN ARCHIEFBEELD</small></div><p className={s.large}>Wie mag er in jullie boek niet ontbreken?</p><p>De oprichter, een collega van het eerste uur of een klant die al jaren meegroeit. Hun herinneringen geven het verhaal een gezicht.</p><aside>Voorbeeldopmaak. Eigen foto’s en interviews worden samen verzameld.</aside></>}
          {chapter===4 && <><p className={s.large}>Zo kan jullie jubileumboek beginnen.</p><p>Stel je deze pagina’s voor met jullie eigen foto’s, bijzondere opdrachten en verhalen van collega’s.</p><p>We bespreken graag de inhoud, uitvoering, planning en kosten voor {name}.</p><a href="#mogelijkheden">Ontdek audio, toen &amp; nu en andere jubileumproducten ↓</a><a className={s.primary} href={contact}>Bespreek ons jubileumboek ↗</a><aside>Vrijblijvend. Je e-mailprogramma opent met een voorstelverzoek voor jullie bedrijf.</aside></>}
          <div className={s.folio}><span>{name}</span><span>0{chapter+1}</span></div>
        </article>
      </div>
      <div className={s.controls}><button onClick={()=>turn(chapter-1)} disabled={chapter===0} aria-label="Vorig hoofdstuk">← <span>Vorige</span></button><p role="status" aria-live="polite">{chapter+1} / 5 <span>— {chapters[chapter]}</span></p><button onClick={()=>turn(chapter+1)} disabled={chapter===4} aria-label="Volgend hoofdstuk"><span>Volgende</span> →</button></div>
      <button className={s.close} onClick={()=>setOpened(false)}>Terug naar de omslag</button>
    </div>}
    <noscript><p>Het interactieve boek werkt met JavaScript. Hieronder lees je de tijdlijn en de mogelijkheden voor jullie jubileumboek.</p></noscript>
  </section>;
}
