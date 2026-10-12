# Enginesite — reproduceerbare bron na reconciliatie

Gecontroleerd op 11 oktober 2026. Deze repository is de bron van de openbare Jubileum-aanbodsite. De private CRM-backend en de persoonlijke statische previews zijn afzonderlijke projecten.

| Onderdeel | Vaststelling |
| --- | --- |
| Canonical productiehost | https://www.jubileumengine.nl |
| Andere actieve aliases | enginesite.vercel.app; jubileumengine.nl redirect naar www |
| Actieve productie bij vergelijking | dpl_3Qq4Q9AcF5GxmXopKxDbVAJz85Rq, Vercel-project enginesite / prj_35euOnu5QqJzuR9PrmT2xBjPgVGG; source redeploy; geen Git-SHA in deploymentmetadata |
| Gitbasis | Lukasvant/Enginesite main 3180a49479f6d3db2d6e16ba5142ce1c633eca53 |
| Reviewbranch | feat/reconcile-live-seo |
| Applicatieroot | thetenmethodapp/jubileum-engine |
| Private CRM-bron | Lukasvant/jubileum-engine, eigen gelijknamige applicatieroot |
| Persoonlijke previewbron | Private recovery/jubileum-previews-archief in Lukasvant/jubileum-engine, hashmanifest en approved-routes.json |

## Wat is gereconcilieerd?

De CLI-bronstructuur is via Vercel vastgesteld, maar de connector kapt diep geneste bestanden af. De oorspronkelijke niet-gecommitte TSX-diff is daarom niet byte voor byte teruggevonden. De openbare SEO-/routeverschillen zijn expliciet gereconstrueerd vanuit actuele, publiek geleverde HTML/JSON-LD, robots en sitemap, en bestaande catalogusdata. Dit is een geteste vervanging voor die ontbrekende wijzigingen, geen identieke historische checkout.

- Alle 32 sitemaproutes bestaan in deze bron: 4 algemene pagina's, 20 productconcepten, 4 categorieën en 4 programma's.
- De bestaande demo en design-review blijven beschikbaar en noindex; persoonlijke previews blijven noindex en buiten de sitemap.
- De live boekafbeelding is opgehaald vanaf /images/jubilee/jubilee-book-concept-v1.png, 2.640.659 bytes, SHA256 f696ae3fe2e10091f0e2ea960e917457c7bcd45c641769adfa8518b4ab7a966f. Bijbehorende openbare CSS, alt-teksten en fictief-labels zijn behouden.
- Bekende originele JSX-/typefouten zijn alleen in deze branch gerepareerd: twee sluitaccolades en een door InteractiveBook niet gebruikte visuals-prop. Het private originele herstelarchief is intact gebleven.
- Historische backend-acties, Prisma-schema/migraties, SMTP, authenticatie, catalogusdata, boekinteracties, wensenexport en localStorage-selectie zijn behouden. De vergelijking bewijst de publieke uitvoer, niet de volledige byte-identiteit van onbekende private productiecode.

## Bewuste verbeteringen ten opzichte van live

Eigen canonicals en unieke metadata voor alle publieke routes, zonder dubbele merknaam; Open Graph en Twitter-metadata. Op /samenstellen staat nu één H1. De bestaande categorie- en programmaroutes zijn rechtstreeks gelinkt. De sitemap krijgt geen fictieve lastmod op ieder buildmoment. Bestaand demo-crawlbeleid blijft behouden. Private routes krijgen aanvullend X-Robots-Tag; previewdeployments krijgen overal noindex, robots Disallow: / en een lege sitemap.

## Veilige releasegrens

Na expliciet gebruikersakkoord is PR #1 samengevoegd en naar productie gepubliceerd: mergecommit 5b0023b374517606f3c22580d5037f7786c9e9ba, deployment dpl_C62xmvPZTEeP5r4X2iSfoZge8puz, READY. Alle 32 publieke SEO-routes en browserinteracties zijn live gecontroleerd. Rollback: dpl_3Qq4Q9AcF5GxmXopKxDbVAJz85Rq. Er is geen DNS-, domein-, hosting- of databaseconfiguratie gewijzigd. Builds van Vercel-previews voeren nooit prisma migrate deploy uit, ook niet bij CI=true of ontbrekende VERCEL_ENV. Automatische migraties op productie/CI vereisen voortaan expliciet JUBILEUM_RUN_MIGRATIONS=1; previews migreren nooit. Het bestaande handmatige db:deploy-commando blijft beschikbaar. Voor deze SEO-release is geen opt-in ingesteld.

Publiceer deze code alleen naar project enginesite met de bovenstaande root; nooit vanuit de CRM-directory of het previewarchief. Voor een toekomstige productie-uitrol: controleer actuele deployment-ID/aliases opnieuw, test een preview met gescheiden databinding, controleer bestaande private backendflows zonder uitgaande mail en leg het vorige deployment-ID als rollback vast. Deze opdracht heeft geen echte mail, formulieraanvraag, seed of databasemigratie uitgevoerd.

De live logcontrole bevestigde een al bestaande melding op /previews (ook op de vorige deployment): de paginacomponent startte de Prisma-query voordat de layout naar login redirectte. De opvolgende herstelwijziging voert requireAuth eerst uit in de paginacomponent. De query voor ingelogde gebruikers en de aparte CRM-database blijven behouden; geen databasecredentials toegevoegd, geen migratie nodig. Twee regressietests controleren queryvolgorde en behoud van de bestaande query.
