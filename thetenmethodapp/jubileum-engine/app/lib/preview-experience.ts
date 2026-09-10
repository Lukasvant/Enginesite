export type PreviewMilestone = { year: number; title: string; description?: string };
export type PreviewPerson = { id: string; name: string; role: string; tenure: string; quote: string; story: string; portraitIndex: number; isDemo: boolean };
export type PreviewSource = { id: string; label: string; kind: string; excerpt: string; isDemo: boolean };
export type PreviewMemoryAnswer = { id: string; question: string; answer: string; sourceIds: string[]; isDemo: boolean };

export type PreviewExperienceData = {
  name: string;
  foundationYear: number | null;
  currentYear: number;
  age: number | null;
  city: string | null;
  industry: string | null;
  website: string | null;
  isDemo: boolean;
  intro: string;
  milestones: PreviewMilestone[];
  people: PreviewPerson[];
  sources: PreviewSource[];
  memoryAnswers: PreviewMemoryAnswer[];
  impactKind: "projects" | "locations" | "products" | "milestones";
};

const text = (value: unknown, max = 500) => typeof value === "string" ? value.trim().slice(0, max) : "";

function parseMilestones(input: unknown, currentYear: number): PreviewMilestone[] {
  if (!Array.isArray(input)) return [];
  return input.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const row = item as Record<string, unknown>;
    const year = typeof row.year === "number" ? row.year : typeof row.year === "string" && /^\d{4}$/.test(row.year.trim()) ? Number(row.year) : NaN;
    const title = text(row.title, 180);
    if (!Number.isInteger(year) || year < 1000 || year > currentYear || !title) return [];
    const description = text(row.description, 600);
    return [{ year, title, ...(description ? { description } : {}) }];
  }).filter((item, index, all) => all.findIndex((other) => other.year === item.year && other.title === item.title) === index).sort((a, b) => a.year - b.year);
}

function safeWebsite(value: unknown): string | null {
  const candidate = text(value, 300);
  if (!candidate) return null;
  try {
    const url = new URL(/^https?:\/\//i.test(candidate) ? candidate : `https://${candidate}`);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch { return null; }
}

function impactKind(milestones: PreviewMilestone[]): PreviewExperienceData["impactKind"] {
  const haystack = milestones.map((m) => `${m.title} ${m.description ?? ""}`).join(" ").toLowerCase();
  if (/locatie|vestiging|pand|kantoor/.test(haystack)) return "locations";
  if (/product|collectie|assortiment|ontwikkel/.test(haystack)) return "products";
  if (/project|opdracht|bouw|realis/.test(haystack)) return "projects";
  return "milestones";
}

export function buildPreviewExperience(input: { name: string; foundationYear?: number | null; intro?: string | null; milestones?: unknown; city?: string | null; industry?: string | null; website?: string | null; isDemo?: boolean }, currentYear = new Date().getFullYear()): PreviewExperienceData {
  const year = Number.isInteger(currentYear) && currentYear >= 1000 && currentYear <= 9999 ? currentYear : new Date().getFullYear();
  const foundationYear = Number.isInteger(input.foundationYear) && (input.foundationYear as number) >= 1000 && (input.foundationYear as number) <= year ? input.foundationYear as number : null;
  const milestones = parseMilestones(input.milestones, year);
  return { name: text(input.name, 180) || "Jullie bedrijf", foundationYear, currentYear: year, age: foundationYear === null ? null : year - foundationYear, city: text(input.city, 120) || null, industry: text(input.industry, 120) || null, website: safeWebsite(input.website), isDemo: input.isDemo === true, intro: text(input.intro, 1200) || "Een eerste verkenning van jullie bedrijfsgeschiedenis, op basis van de beschikbare informatie.", milestones, people: [], sources: milestones.map((m, i) => ({ id: `milestone-${i + 1}`, label: m.title, kind: "milestone", excerpt: m.description ?? `${m.year}: ${m.title}`, isDemo: false })), memoryAnswers: [], impactKind: impactKind(milestones) };
}

export const demoPreviewExperience: PreviewExperienceData = {
  name: "Van Dijk & Zonen", foundationYear: 1976, currentYear: 2026, age: 50, city: "Utrecht", industry: "Installatietechniek", website: "https://vandijkenzonen.example/", isDemo: true,
  intro: "Een fictieve jubileumverkenning van Van Dijk & Zonen: vijftig jaar vakmanschap, groei en mensen die het werk elke dag waarmaken.",
  milestones: [1976, 1987, 1999, 2008, 2018, 2026].map((year, i) => ({ year, title: ["De eerste werkplaats", "De tweede generatie stapt in", "Een nieuwe serviceploeg", "Groei naar de regio", "Duurzame installaties", "Vijftig jaar samen"] [i], description: ["Fictief oprichtingsjaar uit het demo-archief.", "Fictieve familiewissel beschreven in het demo-interview.", "Fictieve uitbreiding uit het demo-projectarchief.", "Fictieve regionale groei uit het demo-jaarverslag.", "Fictieve stap naar duurzame techniek.", "Fictief jubileummoment voor deze preview."][i] })),
  people: [
    { id: "demo-jan", name: "Jan van Dijk", role: "Oprichter", tenure: "1976–2008", quote: "Goed werk begint met goed luisteren.", story: "Fictief portret van de oprichter en de eerste werkplaats.", portraitIndex: 1, isDemo: true },
    { id: "demo-samira", name: "Samira de Boer", role: "Projectleider", tenure: "2008–heden", quote: "Iedere installatie vertelt iets over hoe je samenwerkt.", story: "Fictief verhaal over de groei van de serviceploeg.", portraitIndex: 2, isDemo: true },
    { id: "demo-luc", name: "Luc van Dijk", role: "Tweede generatie", tenure: "1999–heden", quote: "Je bewaart de lessen en bouwt verder.", story: "Fictief perspectief op de generatiewissel.", portraitIndex: 3, isDemo: true },
  ],
  sources: [
    { id: "demo-interview", label: "Demo-interview met Jan van Dijk", kind: "interview", excerpt: "Fictief interviewfragment over de eerste werkplaats in 1976.", isDemo: true },
    { id: "demo-photo", label: "Demo-archieffoto werkplaats", kind: "photo", excerpt: "Fictieve fotoverwijzing naar de werkplaats uit 1976.", isDemo: true },
    { id: "demo-book", label: "Demo jubileumboek", kind: "book", excerpt: "Fictieve boekpassage over de overgang naar de tweede generatie in 1999.", isDemo: true },
    { id: "demo-report", label: "Demo jaarverslag 2018", kind: "annual-report", excerpt: "Fictieve jaarverslagpassage over duurzame installaties.", isDemo: true },
    { id: "demo-projects", label: "Demo projectarchief", kind: "project-archive", excerpt: "Fictieve projectnotitie over regionale groei in 2008.", isDemo: true },
  ],
  memoryAnswers: [
    { id: "demo-memory-1", question: "Welke werkdag vergeet je nooit?", answer: "De eerste grote regionale opdracht in 2008, toen de nieuwe serviceploeg samen op pad ging.", sourceIds: ["demo-interview", "demo-projects"], isDemo: true },
    { id: "demo-memory-2", question: "Welk beeld moet in het boek?", answer: "De werkplaats met de eerste bus uit 1976, naast een beeld van het team van nu.", sourceIds: ["demo-photo", "demo-interview"], isDemo: true },
    { id: "demo-memory-3", question: "Wat mag de volgende generatie weten?", answer: "Bewaar de aandacht voor mensen en leer van elke opdracht.", sourceIds: ["demo-book", "demo-interview"], isDemo: true },
    { id: "demo-memory-4", question: "Wanneer voelde de groei echt?", answer: "Bij de regionale uitbreiding in 2008 werd de nieuwe schaal zichtbaar.", sourceIds: ["demo-projects", "demo-report"], isDemo: true },
    { id: "demo-memory-5", question: "Waar zijn jullie nu trots op?", answer: "Op duurzame installaties en vijftig jaar samenwerken.", sourceIds: ["demo-report", "demo-book"], isDemo: true },
  ], impactKind: "projects",
};
