import { prisma } from "./prisma";

export interface Milestone {
  year: number;
  title: string;
  description?: string;
}

export async function generatePreviewContent(companyId: string) {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: { events: true, contacts: true, claims: true },
  });

  if (!company) throw new Error("Company not found");

  const verified = company.events
    .filter((e) => e.status !== "REJECTED" && (e.confidence ?? 0) >= 0.5)
    .sort((a, b) => (a.year ?? 0) - (b.year ?? 0));

  const foundation = verified.find((e) => e.title.toLowerCase().includes("opricht") || e.title.toLowerCase().includes("founded"));

  const milestones: Milestone[] = verified.slice(0, 8).map((e) => ({
    year: e.year ?? parseInt(e.date ?? "0"),
    title: e.title,
    description: e.description ?? undefined,
  }));

  const primaryContact = company.contacts.find((c) => c.isPrimary) ?? company.contacts[0];

  const intro =
    `Dit is een eerste verkenning van de geschiedenis van ${company.name}. ` +
    `We hebben publieke bronnen geraadpleegd om de belangrijkste momenten op een tijdlijn te zetten. ` +
    (foundation ? `Het bedrijf werd opgericht in ${foundation.year}.` : "De oprichtingsdatum is nog niet met zekerheid vastgesteld.");

  const closing =
    `Er zit waarschijnlijk nog veel meer verhaal in jullie geschiedenis. ` +
    `Bekijk wat we hiervan kunnen maken.`;

  return {
    company,
    primaryContact,
    title: `${company.name} — een geschiedenis in momenten`,
    intro,
    milestones,
    closing,
    hasUncertainty: company.claims.some((c) => c.status === "UNCERTAIN" || c.status === "CONFLICTING"),
  };
}
