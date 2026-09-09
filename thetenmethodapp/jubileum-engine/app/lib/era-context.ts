export type EraContext = {
  period: string;
  headline: string;
  description: string;
  sourceLabel: string;
  sourceUrl: string;
};

const ERAS: Array<{ from: number; to: number; context: EraContext }> = [
  { from: 1700, to: 1799, context: { period: "De Verlichting", headline: "Nieuwe ideeën over kennis en samenleving", description: "In Europa kregen wetenschap, handel en het publieke debat een andere plaats. Een tijd waarin ambacht en ondernemerschap steeds zichtbaarder werden.", sourceLabel: "British Library: The Enlightenment", sourceUrl: "https://www.bl.uk/restoration-18th-century-literature/articles/the-enlightenment" } },
  { from: 1800, to: 1859, context: { period: "De industriële eeuw", headline: "Steden, spoor en productie veranderen het dagelijks leven", description: "Mechanisatie en nieuwe verbindingen versnelden de manier waarop mensen werkten, reisden en goederen maakten.", sourceLabel: "Science Museum: Industrial Revolution", sourceUrl: "https://www.sciencemuseum.org.uk/objects-and-stories/industrial-revolution" } },
  { from: 1860, to: 1913, context: { period: "Een verbonden wereld", headline: "Techniek en communicatie maken grote sprongen", description: "Elektriciteit, nieuwe vervoersmiddelen en internationale handel veranderden de schaal waarop bedrijven konden werken.", sourceLabel: "Science Museum: Electricity", sourceUrl: "https://www.sciencemuseum.org.uk/objects-and-stories/electricity" } },
  { from: 1914, to: 1918, context: { period: "Eerste Wereldoorlog", headline: "Een wereld in ingrijpende verandering", description: "De oorlog veranderde Europa en het dagelijks leven fundamenteel. Bedrijven en families moesten zich voortdurend aanpassen.", sourceLabel: "Imperial War Museums: First World War", sourceUrl: "https://www.iwm.org.uk/history/first-world-war" } },
  { from: 1919, to: 1929, context: { period: "De jaren twintig", headline: "Herstel, modernisering en nieuwe media", description: "Na de Eerste Wereldoorlog ontstond ruimte voor nieuwe vormen van industrie, cultuur en massacommunicatie.", sourceLabel: "Library of Congress: The 1920s", sourceUrl: "https://www.loc.gov/collections/national-jukebox/articles-and-essays/jukebox-the-early-20th-century/" } },
  { from: 1930, to: 1939, context: { period: "De jaren dertig", headline: "Onzekerheid vraagt om veerkracht", description: "Economische crisis en politieke spanningen bepaalden het tempo van die jaren, ook voor ondernemingen en gezinnen.", sourceLabel: "Library of Congress: Great Depression", sourceUrl: "https://www.loc.gov/classroom-materials/united-states-history-primary-source-timeline/great-depression-and-world-war-ii-1929-1945/" } },
  { from: 1940, to: 1945, context: { period: "Tweede Wereldoorlog", headline: "Een tijd van schaarste en ingrijpende verandering", description: "De oorlog raakte het leven en werk in heel Europa. De jaren erna stonden in het teken van herstel en opnieuw opbouwen.", sourceLabel: "Imperial War Museums: Second World War", sourceUrl: "https://www.iwm.org.uk/history/second-world-war" } },
  { from: 1946, to: 1959, context: { period: "Wederopbouw", headline: "Europa bouwt opnieuw aan de toekomst", description: "Na de oorlog groeiden woningbouw, infrastructuur en internationale samenwerking snel. Een nieuwe generatie bedrijven kreeg ruimte.", sourceLabel: "European Union: Schuman Declaration", sourceUrl: "https://european-union.europa.eu/principles-countries-history/history-eu/1945-59_en" } },
  { from: 1960, to: 1969, context: { period: "De jaren zestig", headline: "Technologie krijgt een nieuwe horizon", description: "De ruimtevaart en snelle innovatie maakten vooruitgang tastbaar en voedden optimisme over wat techniek mogelijk kon maken.", sourceLabel: "NASA: Apollo 11", sourceUrl: "https://www.nasa.gov/history/apollo-11/" } },
  { from: 1970, to: 1979, context: { period: "De jaren zeventig", headline: "Energie en economie vragen om nieuwe keuzes", description: "De oliecrisis maakte duidelijk hoe verweven economie, energie en dagelijks leven waren. Efficiëntie werd belangrijker.", sourceLabel: "International Energy Agency: Oil crisis", sourceUrl: "https://www.iea.org/reports/oil-1974" } },
  { from: 1980, to: 1989, context: { period: "De jaren tachtig", headline: "De computer vindt zijn weg naar werk en huishouden", description: "Digitalisering begon steeds zichtbaarder te worden in kantoor, productie en communicatie.", sourceLabel: "Computer History Museum", sourceUrl: "https://www.computerhistory.org/timeline/1980/" } },
  { from: 1990, to: 1999, context: { period: "De jaren negentig", headline: "Het web verandert communicatie", description: "Met het wereldwijde web werd informatie sneller vindbaar en ontstonden nieuwe manieren om klanten en markten te bereiken.", sourceLabel: "CERN: Birth of the Web", sourceUrl: "https://home.cern/science/computing/birth-web" } },
];

export function getEraContext(year?: number | null) {
  if (!year) return null;
  return ERAS.find((era) => year >= era.from && year <= era.to)?.context ?? null;
}
