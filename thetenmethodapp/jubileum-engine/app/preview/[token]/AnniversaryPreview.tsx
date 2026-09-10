import { getEraContext } from "@/app/lib/era-context";
import { ProductExperience } from "./ProductExperience";
import { InteractiveBook } from "./InteractiveBook";
import styles from "./preview.module.css";

type Props = {
  name: string;
  foundationYear: number | null;
  intro: string;
  milestones: { year: number; title: string; description?: string }[];
};

export function AnniversaryPreview({ name, foundationYear, intro, milestones }: Props) {
  const currentYear = new Date().getFullYear();
  const age = foundationYear && foundationYear < currentYear ? currentYear - foundationYear : null;
  const era = getEraContext(foundationYear);
  const contact = `mailto:info@ambachtio.nl?subject=${encodeURIComponent(`Jubileumverhaal voor ${name}`)}&body=${encodeURIComponent(`Hallo,\n\nIk heb de jubileumpreview voor ${name} bekeken. Ik ontvang graag een voorstel met de mogelijkheden, planning en kosten.\n\nMet vriendelijke groet,\n`)}`;
  return (
    <div className={styles.preview}>
      <header className={styles.nav}>
        <a href="#" className={styles.brand}>ambachtio<span>®</span></a>
        <span className={styles.private}>Persoonlijk concept voor {name}</span>
        <a href="#voorstel" className={styles.navCta}>Bespreek jullie jubileum <span>↗</span></a>
      </header>
      <main>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}><span /> EEN EERSTE BLIK OP JULLIE JUBILEUM</p>
            <h1>Een geschiedenis<br />om <em>door te geven.</em></h1>
            <p className={styles.lead}>{foundationYear ? `Van ${foundationYear} tot vandaag. ` : "Van het eerste begin tot vandaag. "}Het verhaal van <strong>{name}</strong> verdient een plek buiten het archief.</p>
            <p className={styles.sublead}>Stel je voor: jullie mensen, foto’s en bijzondere momenten, samengebracht in een jubileumboek dat je met trots op tafel legt.</p>
            <a className={styles.primary} href="#boek">Ontdek jullie interactieve boek <span>↓</span></a>
            <p className={styles.note}>Persoonlijk ontwerpconcept · Samen verder in te vullen</p>
          </div>
          <div className={styles.studio}>
            <div className={styles.studioTop}><span>HET JUBILEUMBOEK</span><span>ONTWERPSTUDIE / 01</span></div>
            <div className={styles.book} role="img" aria-label={`Boekimpressie voor ${name}${age ? `, ${age} jaar` : ""}, met een groene omslag en goudkleurige typografie`}>
              <div className={styles.cover}>
                <div className={styles.bookTop}><span>HET VERHAAL VAN</span><span>JUBILEUMEDITIE</span></div>
                <h2>{name}</h2>
                <div className={styles.bookNumber}>{age || "Ons"}<span>{age ? "jaar in verhalen" : "verhaal"}</span></div>
                <div className={styles.arcs}><i /><i /><i /><i /><i /></div>
                <div className={styles.bookBottom}><span>MENSEN. MOMENTEN. HERINNERINGEN.</span><span>{foundationYear ? `${foundationYear} — ${currentYear}` : "TOEN — NU"}</span></div>
              </div>
            </div>
            <div className={styles.studioBottom}><span>Een verhaal dat blijft.</span><span>Omslagconcept<br />Vormgeving ter inspiratie</span></div>
          </div>
        </section>
        <div className={styles.ribbon}><span>Voor de mensen die het maakten.</span><span>Voor de klanten die meegroeiden.</span><span>Voor de generatie die verdergaat.</span></div>
        <InteractiveBook name={name} foundationYear={foundationYear} intro={intro} milestones={milestones} contact={contact} />
        <section id="verhaal" className={styles.story}>
          <div><p className={styles.eyebrow}>01 / JULLIE VERHAAL</p><h2>Het begon met een idee.<br /><em>Wat volgde, is van jullie.</em></h2></div>
          <div><p className={styles.storyIntro}>{intro}</p><p className={styles.muted}>Dit is het begin. Jullie eigen foto’s, herinneringen en verhalen geven het straks een gezicht.</p></div>
        </section>
        <section className={styles.timeline} aria-label="Eerste opzet van de bedrijfstijdlijn">
          {milestones.filter(m => Number.isFinite(m.year) && m.year > 0).map((m, i) => <article key={`${m.year}-${i}`} className={styles.milestone}><span className={styles.index}>{String(i + 1).padStart(2, "0")}</span><div className={styles.year}>{m.year}</div><div><h3>{m.title}</h3>{m.description && <p>{m.description}</p>}</div></article>)}
          <article className={styles.nextChapter}><span>HET VOLGENDE HOOFDSTUK</span><h3>De verhalen die alleen jullie kennen.</h3><p>De eerste werkdag. Die ene grote opdracht. De mensen die het verschil maakten. Die herinneringen maken het boek persoonlijk.</p></article>
        </section>
        <section className={styles.spreadSection}>
          <div className={styles.spread} aria-label="Impressie van een open boek met ruimte voor eigen archieffoto’s">
            <div className={styles.leftPage}><span>DE MENSEN ACHTER DE NAAM</span><h3>Grote verhalen.<br /><em>Kleine momenten.</em></h3><div className={styles.photoPlaceholder}><span>Jullie foto,<br />jullie herinnering.</span><small>RUIMTE VOOR EIGEN ARCHIEFBEELD</small></div><small>02 — {name}</small></div>
            <div className={styles.rightPage}><span>EEN BOEK VOL HERKENNING</span><div className={styles.quoteMark}>“</div><p>Weet je nog<br />hoe het<br /><em>allemaal begon?</em></p><div className={styles.rule} /><small>Hier komt een herinnering van een collega, oprichter of klant.</small><span className={styles.pageNumber}>03</span></div>
          </div>
          <div className={styles.spreadCopy}><p className={styles.eyebrow}>02 / VAN ARCHIEF NAAR BOEK</p><h2>Meer dan jaartallen.<br /><em>Een gevoel van trots.</em></h2><p>Een jubileum is een aanleiding om even stil te staan bij wat jullie samen hebben opgebouwd. Maak er iets van dat collega’s mee naar huis nemen en klanten graag doorbladeren.</p><ul><li>Een tijdlijn die jullie ontwikkeling laat zien</li><li>Persoonlijke verhalen van de mensen erachter</li><li>Eigen fotografie en archiefmateriaal in één stijl</li></ul><p className={styles.note}>Voorbeeldopmaak. Foto’s en interviews worden samen verzameld.</p></div>
        </section>
        {era && <aside className={styles.era}><div><p className={styles.eyebrow}>TUSSEN DE BLADZIJDEN / DE WERELD TOEN</p><h2>{era.headline}</h2><span>{era.period}</span></div><div><p>{era.description}</p><a href={era.sourceUrl} target="_blank" rel="noreferrer">Contextbron: {era.sourceLabel} ↗</a><small>Algemene tijdscontext; geen gebeurtenis uit jullie bedrijfsgeschiedenis.</small></div></aside>}
        <ProductExperience name={name} milestones={milestones} />
        <section id="voorstel" className={styles.proposal}><p className={styles.eyebrow}>03 / SAMEN HET VERHAAL COMPLEET MAKEN</p><h2>Dit is de eerste indruk.<br /><em>Stel je jullie eigen verhalen erbij voor.</em></h2><p>Past deze richting bij {name}? Vertel ons wanneer jullie jubileum is en wat jullie willen maken. Dan bespreken we de inhoud, uitvoering, planning en kosten.</p><a className={styles.primary} href={contact}>Ik wil een voorstel voor ons jubileum <span>↗</span></a><span className={styles.proposalNote}>Vrijblijvend · Je e-mailprogramma opent · Je zit nergens aan vast</span><div className={styles.steps}><span><b>01</b> Jullie wensen bespreken</span><span><b>02</b> Inhoud & vorm bepalen</span><span><b>03</b> Een voorstel op maat</span></div></section>
      </main>
      <footer className={styles.footer}><span className={styles.brand}>ambachtio<span>®</span></span><p>Persoonlijke voorvertoning voor {name}.<br />Eerste opzet op basis van publieke bronnen. Inhoud en ontwerp worden samen afgestemd.</p><a href={contact}>Neem contact op ↗</a></footer>
    </div>
  );
}
