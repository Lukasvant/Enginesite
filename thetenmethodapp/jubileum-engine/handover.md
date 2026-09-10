# Jubileum Engine — overdracht

Bijgewerkt: 10 september 2026. Dit bestand beschrijft de nieuwe preview- en productfunctionaliteit en vervangt voor dit werk de oudere stand in `HANDOFF.md`.

## Project en werkstatus

- Repository: `Lukasvant/jubileum-engine`, branch `main`, huidige HEAD `3b84592` (`docs: add project handoff`).
- Appmap: `thetenmethodapp/jubileum-engine` binnen de repository.
- De implementatie staat lokaal als gewijzigde en niet-gevolgde bestanden. Niet gecommit of gepusht in deze taak. Niet resetten of opruimen; inspecteer `git status` voor vervolgwerk.
- Ook bestaande wijzigingen in `app/layout.tsx`, `package.json`, `package-lock.json` (Vercel Analytics) en `app/components/DailyOutreachSelector.tsx` aanwezig. Behoud die; schrijf ze niet zonder controle aan deze taak toe.
- Synced bestanden onder `sources/` zijn alleen-lezen.

## Gebruikerskeuzes

- De gebruiker heeft het nieuwe ontwerp goedgekeurd: donkergroen, warm papier, goudkleurige accenten, grote seriftypografie en een persoonlijke boekimpressie.
- Dit is het vaste template voor alle previews vanuit de app, inclusief losse previews, dagselecties, outreachlinks en eerder aangemaakte previewlinks.
- Het template vult bedrijfsgegevens deterministisch in. Er is geen Terra-, Astra- of andere AI-aanroep voor het renderen van previews.
- Het interactieve boek vult de bestaande pagina aan. Desktop toont een dubbele pagina, mobiel één inhoudspagina.
- Expliciet gekozen scope: **aanbod en interactieve voorbeelden**, niet de volledige productieomgeving voor uploads, interviews, audio, films of drukwerk.
- Geen verzonnen bedrijfsfeiten, foto's, citaten, projectlocaties of verkoopresultaten. Voorbeelden zijn duidelijk als concept of fictief gemarkeerd.

## Wat gebouwd is

### Preview en interactief boek

- `app/preview/[token]/page.tsx` laadt de gepubliceerde preview en gebruikt het gedeelde `AnniversaryPreview`-template. Ongepubliceerde/ontbrekende previews blijven niet toegankelijk; pagina's zijn noindex.
- `AnniversaryPreview.tsx` en `preview.module.css`: omslag, tijdlijn, boekspread, tijdscontext, productmogelijkheden en contactstap.
- `InteractiveBook.tsx` en `book.module.css`: openen/sluiten, vijf hoofdstukken, aanklikbare mijlpalen, vorige/volgende, pijltjestoetsen en horizontaal vegen. Lege gegevens krijgen eerlijke lege toestanden; reduced-motion wordt gerespecteerd.
- Hoofdstukken: het begin, door de jaren, de wereld toen, de mensen, het volgende hoofdstuk.
- `app/demo/page.tsx`: fictief voorbeeldbedrijf en voorbeeldgegevens, zichtbaar gemarkeerd. `/design-review` hergebruikt dezelfde demo.

### Productaanbod

- `app/lib/jubilee-products.ts` is de gedeelde catalogus plus de generator voor een wensenlijst.
- Acht mogelijkheden: boek met audio; toen & nu; persoonlijke medewerkereditie; interactieve tentoonstelling; jubileumfilm; herinneringen verzamelen; projectatlas; overdrachtsboek.
- `ProductExperience.tsx` en `products.module.css` tonen per product een interactieve conceptimpressie en de inhoud, aanleiding en benodigde materialen.
- Demo's: schematische beeldschuif, lokaal afspelen van een eigen audiobestand, personaliseerbare openingspagina, tentoonstelling met beschikbare mijlpalen, filmstoryboard, downloadbare herinnering, fictieve projectkaart en interviewopzet voor generatiewissel.
- Producten kunnen worden toegevoegd/verwijderd uit één wensenlijst met aanleiding en vrije wensen. De selectie gaat mee in een mailto-aanvraag of tekstdownload.
- Niets wordt automatisch verzonden, opgeslagen of naar het CRM geschreven. Audio blijft lokaal via object-URL; geschreven concepten en selectie verdwijnen bij verlaten/herladen tenzij gedownload.
- Geen backend voor inzendingen, mediaopslag, filmproductie, QR-hosting, geocoding of print fulfilment. Geen vaste prijs, boeking of leverbelofte.

### App en sales

- `app/(admin)/products/page.tsx`: beschermde productcatalogus met leveringsscope, benodigde input en opvolginstructies.
- `app/(admin)/layout.tsx`: navigatie naar Producten, ook bereikbaar op mobiel.
- `app/components/PreviewPanel.tsx`: toelichting op de uitgebreide preview en link naar het aanbod.
- `app/lib/outreach.ts`: nieuwe concepten noemen het doorbladerbare boek en mogelijke uitvoeringen. Bestaande berichten niet herschreven; niets verstuurd.
- Ontvangen aanvragen moeten via het bestaande leadproces worden opgevolgd. De demo legt geen CRM-aanvraag vast.
- `docs/JUBILEUM_ENGINE.md` bevat de productgrenzen en het gedrag van de voorbeelden.

## Publicatie en links

- Productie: https://jubileum-engine.vercel.app
- Productdemo: https://jubileum-engine.vercel.app/demo#mogelijkheden
- Boekdemo: https://jubileum-engine.vercel.app/demo#boek
- Beheer: https://jubileum-engine.vercel.app/products (inloggen vereist).
- Bestaande voorbeeldpreview: https://jubileum-engine.vercel.app/preview/c5ff220d-bd7e-42ac-849d-0d77d300d5b6
- Laatste succesvolle publicatie in deze taak: `dpl_3Da46Fq6Bm9MHor29kqhmFK4nmvb`, productie-alias toegewezen. Niet opnieuw live gecontroleerd op 10 september.
- Vercel-project `prj_0pthVcgXpruBEiUMcCdrPVSbJgj4`, team `team_zHEEt1JP09iqhYH7JWXLGzzt`. Root directory op Vercel: `thetenmethodapp/jubileum-engine`.
- CLI-deploy liep vanaf de repositoryroot met tijdelijk de bestaande `.vercel/project.json` uit de appmap gekopieerd. Tijdelijke rootkoppeling daarna verwijderd; laat de oorspronkelijke appkoppeling intact.
- Build voert Prisma generate en migrate deploy uit. Laatste publicatie had geen openstaande migraties; deze feature voegde geen schemawijziging toe.
- Vercel waarschuwde dat Node 20 voor nieuwe deployments vanaf 1 oktober 2026 niet meer ondersteund wordt. Plan een afzonderlijke compatibiliteitscontrole en upgrade; nog niet uitgevoerd.

## Validatie en beperkingen

- Laatste `npm test -- --runInBand`: 5 suites, 15 tests geslaagd.
- Tests: `__tests__/interactive-book.test.ts` en `__tests__/jubilee-products.test.ts`, naast bestaande tests.
- Dekking: hoofdstukken, grenzen, mijlpalen, toetsenbord, swipe versus verticale beweging, ontbrekende gegevens, alle productvoorbeelden, selectiebehoud/verwijderen en bedrijfsspecifieke aanvraagtekst.
- `jest.config.js` ondersteunt TSX en de `@/`-alias; UI-tests gebruiken jsdom.
- TypeScript, gerichte lintcontrole en productiebuild geslaagd.
- Alleen het eerdere statische ontwerp is visueel op desktop en mobiel bekeken. Voor het interactieve boek en de productuitbreiding blokkeerde browsergebruik op localhost én productie doordat de admin-beveiligingscontrole niet beschikbaar was. Niet omzeilen. Geen visuele eindcontrole of bewijs van betere conversie claimen.
- De lokale demo gebruikte poort 3147. Controleer of de server nog draait; zo nodig `npm run dev -- --port 3147` vanuit de appmap.
- SMTP-verzending, productiecredentials en daadwerkelijke CRM-registratie zijn niet opnieuw getest. Verstuur geen berichten zonder expliciete gebruikersopdracht.

## Beste volgende stap

Zodra de browsercontrole weer beschikbaar is: loop `/demo#mogelijkheden` en een bestaande preview visueel door op desktop en mobiel. Controleer lange bedrijfsnamen, het boek, alle acht productkeuzes, selectie/verwijderen, aanvraaglink, downloads en eigen audio. Controleer ook `/products` na inloggen. Geen mail verzenden tijdens die controle. Daarna de gecontroleerde wijzigingen gericht vastleggen in Git, met behoud van ander werk.
