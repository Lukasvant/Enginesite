# Astra design handoff — Jubileum Engine

Bijgewerkt: 10 september 2026. Deze overdracht is voor een volgende ontwerp- of implementatieronde. De werkboom bevat lokale, niet-gecommitte wijzigingen; behoud die en ruim niets op zonder gerichte controle.

## Doel en stijl

Jubileum Engine helpt directies, marketing, communicatie, HR en jubileumorganisatoren een jubileumprogramma samen te stellen. De kern: mensen herkennen hun eigen bijdrage, ontdekken onbekende verhalen en geven iets door.

De vaste visuele taal is:

- donkergroen als rustige basis;
- warm papier en zachte salietinten;
- goud voor terughoudende accenten;
- grote, rustige serifkoppen en compacte, heldere sans-serif tekst;
- een persoonlijke boekimpressie, geen generieke SaaS-kaarten;
- concrete, menselijke Nederlandse copy zonder verzonnen claims, klanten of resultaten.

Voorbeelden zijn altijd zichtbaar fictief of conceptueel gelabeld. Respecteer reduced motion, toetsenbordbediening en kleine schermen.

## Huidige publieke ervaring

- `/` is de aanbod-homepage: hero, doelen, volledige catalogus, één verhaal in meerdere vormen, vier programma’s, werkwijze en zorgvuldigheidsgrenzen.
- `/mogelijkheden` toont de volledige gedeelde catalogus, gegroepeerd in boeken en uitgaven, geschiedenis en verhalen, film en belevenissen, en communicatie en vervolg.
- `/mogelijkheden/[id]` is een statische productdetailpagina met wat de opdrachtgever ontvangt, doelgroep/aanleiding, fictief voorbeeld, benodigde input, uitvoeringen, combinaties en kennismakingspunten.
- `/programmas` toont vier aanpasbare startpunten: medewerkers bedanken, samen vieren, klanten en relaties betrekken, en geschiedenis bewaren en overdragen.
- `/samenstellen` bevat de stapsgewijze samensteller en de blijvende selectie.
- `/demo` en `/preview/[token]` blijven de bestaande persoonlijke boekpreview gebruiken. Persoonlijke previews zijn noindex en mogen dat blijven.

## Gedeelde inhoud en interactie

`app/lib/jubilee-products.ts` is de enige productbron voor de publieke catalogus, detailroutes, programma’s, samensteller, bestaande preview en de beheercatalogus.

De catalogus bevat negentien zelfstandig vindbare mogelijkheden. Audio en de persoonlijke medewerkereditie zijn apart vindbaar, maar inhoudelijk herkenbaar verbonden met het jubileumboek.

`app/components/JubileeComposer.tsx` bewaart alleen niet-gevoelige keuzes in `localStorage` onder `jubileum-engine-wensen-v1`:

- aanleiding, jubileumjaar en gewenste datum (inclusief ‘Nog onbekend’);
- doelgroep, doel en optioneel aantal ontvangers;
- beschikbare materialen en vrije budgetindicatie;
- gekozen producten en aanvullende wensen.

Er worden geen verhalen, uploads of audiobestanden opgeslagen. Download resulteert in een tekstbestand `jubileumwensen.txt`. De e-mailknop opent uitsluitend een mailconcept; de interface beweert nooit dat een aanvraag is ontvangen.

`ProductConceptDemo.tsx` bevat lichte, duidelijk conceptuele interacties zoals de beeldschuif, stamboom, kaart, quiz en storyboard. Een storyboard is nooit een geproduceerde film.

## Ontwerpgrenzen

- Maak geen vaste prijzen, planningen, levertijden, reviews, logo’s, keurmerken of omzetclaims zichtbaar.
- Maak geen technisch productiesysteem voor uploads, redactie, vertalingen, mediaopslag, QR-hosting, drukwerk of fulfilment zonder aparte opdracht.
- Houd de bestaande beheer-, lead- en e-mailflows gescheiden van de publieke samensteller. Een mailconcept is geen CRM-inschrijving.
- Behoud de bestaande previewroutes, de noindex-instelling en auth-bescherming voor de beheeromgeving.

## Belangrijke bestanden

- `app/components/jubilee-public.module.css` — publieke ontwerpregels en responsive lay-out.
- `app/page.tsx` — publieke homepage.
- `app/mogelijkheden/page.tsx` en `app/mogelijkheden/[id]/page.tsx` — catalogus en details.
- `app/programmas/page.tsx` en `app/components/ProgramStartButton.tsx` — programma’s die de samensteller vooraf vullen.
- `app/components/JubileeComposer.tsx` — lokale keuzehulp, selectie, download en e-mailconcept.
- `app/preview/[token]/AnniversaryPreview.tsx`, `InteractiveBook.tsx` en `ProductExperience.tsx` — bestaande gedeelde persoonlijke preview.

## Validatie en beste volgende stap

De laatste lokale controle was succesvol: `npm test -- --runInBand` (18 tests) en `npm run build`. De build genereert alle negentien productdetailroutes.

De browsercontrole van de nieuwe publieke pagina’s kon nog niet plaatsvinden omdat de lokale browserbeveiligingscontrole tijdelijk niet beschikbaar was. Zodra die beschikbaar is, controleer op desktop en mobiel:

1. `/`, `/mogelijkheden`, een detailpagina en `/samenstellen`;
2. een product toevoegen, verwijderen, herladen en opnieuw openen;
3. een programma starten en de vooraf ingevulde selectie controleren;
4. lange bedrijfsnaam, lege velden, ontbrekend materiaal, download en e-mailconcept;
5. `/demo` en een bestaande `/preview/[token]` zonder een bericht te versturen.
