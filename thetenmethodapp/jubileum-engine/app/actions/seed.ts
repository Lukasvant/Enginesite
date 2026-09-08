"use server";

import { prisma } from "@/app/lib/prisma";
import { requireAuth } from "@/app/lib/auth";

export async function seedDemoData() {
  await requireAuth();
  const existing = await prisma.company.count();
  if (existing > 0) return { created: 0, message: "Database already contains companies; skipping seed." };

  const company = await prisma.company.create({
    data: {
      name: "Bakkerij De Gouden Korst B.V.",
      domain: "degoudenkorst.nl",
      website: "https://degoudenkorst.nl",
      city: "Utrecht",
      province: "Utrecht",
      industry: "Food / retail",
      employeeSize: "10-50",
      foundationYear: 1977,
      foundationDate: "1977-03-15",
      foundationConfidence: 0.92,
      foundationEvidence: "KvK inschrijving en bedrijfswebsite",
      status: "ACTIVE",
      isDemo: true,
      notes: "Demo bedrijf voor ontwikkeling.",
    },
  });

  await prisma.contact.create({
    data: {
      companyId: company.id,
      name: "Marieke van Dijk",
      role: "Marketing & Communicatie",
      email: "marieke@degoudenkorst.demo",
      isPrimary: true,
    },
  });

  await prisma.researchSource.create({
    data: {
      companyId: company.id,
      title: "Bedrijfswebsite — Over ons",
      url: "https://degoudenkorst.nl/over-ons",
      sourceType: "WEBSITE",
      content: "Bakkerij De Gouden Korst is in 1977 opgericht door familie Van Dijk in Utrecht. In 1998 verhuisden we naar onze huidige locatie aan de Croeselaan.",
    },
  });

  await prisma.historicalEvent.createMany({
    data: [
      {
        companyId: company.id,
        year: 1977,
        title: "Oprichting van de bakkerij",
        description: "Familie Van Dijk start Bakkerij De Gouden Korst in Utrecht.",
        source: "Bedrijfswebsite — Over ons",
        sourceUrl: "https://degoudenkorst.nl/over-ons",
        excerpt: "in 1977 opgericht door familie Van Dijk in Utrecht",
        confidence: 0.92,
        status: "VERIFIED",
        isMilestone: true,
      },
      {
        companyId: company.id,
        year: 1998,
        title: "Verhuizing naar Croeselaan",
        description: "De bakkerij verhuist naar een grotere locatie aan de Croeselaan.",
        source: "Bedrijfswebsite — Over ons",
        sourceUrl: "https://degoudenkorst.nl/over-ons",
        excerpt: "In 1998 verhuisden we naar onze huidige locatie aan de Croeselaan.",
        confidence: 0.85,
        status: "VERIFIED",
        isMilestone: true,
      },
      {
        companyId: company.id,
        year: 2007,
        title: "Tweede vestiging geopend",
        description: "Een tweede winkel wordt geopend in een buurtwinkelcentrum.",
        source: "Bedrijfswebsite — Vestigingen",
        sourceUrl: "https://degoudenkorst.nl/vestigingen",
        excerpt: "Sinds 2007 zijn wij ook te vinden aan de...",
        confidence: 0.65,
        status: "LIKELY",
        isMilestone: true,
      },
      {
        companyId: company.id,
        year: 2027,
        title: "50-jarig jubileum",
        description: "Het bedrijf viert 50 jaar bestaan.",
        source: "Anniversary calculation",
        confidence: 1,
        status: "VERIFIED",
        isMilestone: true,
      },
    ],
  });

  const lead = await prisma.lead.create({
    data: {
      companyId: company.id,
      stage: "PREVIEW_READY",
      score: 85,
      scoreReasons: JSON.stringify([
        "Jubileum valt binnen 6-18 maanden",
        "Belangrijk jubileum: 50 jaar",
        "Bedrijfsgrootte: 10-50 medewerkers",
        "Actieve website aanwezig",
        "Relevante contactpersoon gevonden",
        "Familiebedrijf",
        "Duidelijke oprichtingsdatum",
      ]),
      nextAction: "Generate outreach",
    },
  });

  return { created: 1, message: "Demo company created.", companyId: company.id, leadId: lead.id };
}
