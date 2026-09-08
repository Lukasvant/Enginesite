"use server";

import { prisma } from "@/app/lib/prisma";
import { calculateAnniversary } from "@/app/lib/anniversary";
import { requireAuth } from "@/app/lib/auth";

export async function getCompanies() {
  await requireAuth();
  const companies = await prisma.company.findMany({
    include: { leads: true, contacts: true, events: true },
    orderBy: { createdAt: "desc" },
  });
  return companies.map((c) => ({
    ...c,
    anniversary: calculateAnniversary(c.foundationYear),
    lead: c.leads[0] ?? null,
  }));
}

export async function getCompany(id: string) {
  await requireAuth();
  const company = await prisma.company.findUnique({
    where: { id },
    include: {
      contacts: true,
      leads: true,
      researchSources: true,
      claims: true,
      events: { orderBy: { year: "asc" } },
      previews: { orderBy: { createdAt: "desc" } },
      costRecords: true,
    },
  });
  if (!company) return null;
  return {
    ...company,
    anniversary: calculateAnniversary(company.foundationYear),
  };
}
