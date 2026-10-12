# SEO/GEO — Jubileum-aanbodsite, 11 oktober 2026

## Situatie en prioriteiten

P0: de niet-gecommitte live aanbodsite had acht routes en een boekvisual die ontbraken in de gevonden Gitbasis. De CRM-repository is een ander project. Reconciliatie gebeurt daarom in Lukasvant/Enginesite met behoud van de afzonderlijke backend en previews.

P1: live sitemap/robots, eigen canonicals, unieke metadata, structured data, betrouwbare SSR-inhoud en uitsluiting van private pagina's in een geteste Gitbranch vastleggen. P2: latere commerciële verdieping en meting; geen extra jubileumlandingspagina's of SEO-tools tijdens bronherstel.

## Uitgevoerde wijzigingen

- Vier categorieroutes en vier programmaroutes gereconstrueerd vanuit echte bestaande catalogusdata en live inhoud; onbekende IDs geven 404.
- Robots/sitemap teruggebracht in code. Alle 32 publieke sitemaproutes blijven behouden; demo, prospectpreviews, login en beheer ontbreken in de sitemap.
- Canonicals gebruiken de geverifieerde bestaande www.jubileumengine.nl-host en het eigen pad. Meta descriptions en titels zijn specifiek; dubbele merknaam voorkomen; sociale metadata toegevoegd.
- BreadcrumbList, ItemList en Service-uitvoer gereconcilieerd met live JSON-LD. Geen ratings, reviews, offertes, prijzen of nieuwe beschikbaarheidsclaims.
- Bestaande boekvisual en fictief-bijschriften hersteld. Geen persoonlijke prospectassets overgebracht naar deze openbare repository.
- Ontbrekende H1 op samenstellen aangevuld; categorie- en programmadetails crawlbaar gelinkt.
- Private routes hebben noindex-headers. Previewdeployments zijn volledig noindex en migreren geen mogelijk gedeelde productiedatabase.
- Bestaande dependencies, catalogusdata en productfuncties behouden. Drie reeds gedocumenteerde syntax/typefouten minimaal gerepareerd.

## Zoekintentie en concurrentie

De bestaande boeken/bedrijfsgeschiedenis-, categorie- en doelgerichte programmapagina's beantwoorden concrete jubileumvragen. Dit herstel maakt de al aanwezige inhoud reproduceerbaar; het is geen nieuwe zoekvolume- of concurrentiestudie. Geen actuele zoekvolumes, rankings, AI-vermeldingen of bewezen klantresultaten geclaimd. Conceptvoorbeelden blijven als fictief aangeduid; uitvoering/planning/kosten worden afgesproken.

## Validatie

Productiebuild en typecheck geslaagd; lint zonder waarschuwingen/fouten; 23/23 tests geslaagd. SEO-regressie voor alle 32 publieke pagina’s geslaagd. Alle 34 openbare uitvoervergelijkingen hebben gelijke genormaliseerde tekst en JSON-LD, met de genoemde H1-uitzondering. Zes mobiele routes geven 200 zonder horizontale overflow; afbeelding geladen, boekdemo met knoppen/toetsen, wensenstap, programma-start en selectie na herladen getest. Browser zonder applicatiefouten of mislukte assets na expliciete lokale analytics-stub. Zie SEO_RECONCILIATION_CHECKS.json. De referentie is de actuele publiek geleverde HTML van 32 sitemaproutes plus /demo en /design-review. Genormaliseerde zichtbare tekst en JSON-LD zijn vergeleken; alleen de expliciete H1-toevoeging wordt uitgezonderd. Dit bewijst openbare uitvoerpariteit, geen byte-identieke recovery of volledige private backendpariteit.

`npm run test:seo -- http://localhost:3004` controleert een draaiende productiebuild: 32 publieke routes, unieke titels, descriptions, canonicals, H1, JSON-LD, robots/sitemap, private noindex en echte 404s. Het script doet uitsluitend GET-verzoeken. Browsercontroles blokkeren POSTs; het hostinggebonden analytics-script wordt lokaal gestubd. Bestaande analytics is niet gewijzigd.

## Risico's en handmatige vervolgstappen

- PR #1 is na expliciet akkoord gepubliceerd. Alle 32 publieke SEO-routes en mobiele interacties zijn live gecontroleerd. De vervolgpatch zet logincontrole vóór de bestaande previews-query; dit voorkomt de tijdens releasecontrole ook op oude productie bevestigde databaseconfiguratiemelding bij anonieme bezoeken. 25 tests, lint en typecheck slagen; geen databaseconfiguratie of gegevens gewijzigd.
- Volledige CLI-source/ongecommitte backendverschillen zijn niet bewezen. Controleer afzonderlijke backendflows voor een toekomstige release; verstuur geen mail als test zonder expliciete richting.
- Sitemapweergave bewijst indexeerbaarheid, geen indexering. Google Search Console/Bing Webmaster Tools moeten het bestaande www-domein meten: geïndexeerde publieke routes, zoekvragen, organische bezoeken, samenstellergebruik en gekwalificeerde aanvragen afzonderlijk volgen.
- Bestaande analytics blijven beschikbaar. Geen Search Console/Bing-accounttoegang of export gekregen; geen kwantitatieve nulmeting of AI-citatiebaseline verzonnen. AI-referrers en vaste Nederlandse koopvragen later afzonderlijk volgen.
- Runtime/backend-database, SMTP en prospectprivacy zijn tijdens deze opdracht niet live getest of gewijzigd. robots/noindex zijn indexeringsinstructies, geen toegangscontrole.
- Nieuwe SEO-code is lokaal getest; geen crawlerindexering, AI-citaties of Core Web Vitals-verbetering geclaimd.

## Aangepaste bestanden

app/lib/seo.ts, app/robots.ts, app/sitemap.ts, app/layout.tsx, app/page.tsx, app/mogelijkheden/page.tsx, app/mogelijkheden/[id]/page.tsx, app/programmas/page.tsx, app/programmas/[id]/page.tsx, app/soorten/[category]/page.tsx, app/samenstellen/page.tsx, app/components/ProductConceptDemo.tsx, app/components/jubilee-public.module.css, app/preview/[token]/PreviewJourney.tsx, public/images/jubilee/jubilee-book-concept-v1.png, next.config.mjs, scripts/build.js, scripts/check-seo.mjs, package.json, __tests__/build-guard.test.ts, __tests__/seo.test.ts en deze documentatie. Geen Prisma-schema, SMTP-, auth- of catalogusdatawijzigingen.
