"use server";

import { prisma } from "@/app/lib/prisma";
import { calculateAnniversary } from "@/app/lib/anniversary";
import { requireAuth } from "@/app/lib/auth";

export async function getLeads(filters?: { stage?: string; minScore?: number; months?: number }) {
  await requireAuth();
  const where: any = {};
  if (filters?.stage) where.stage = filters.stage;
  if (filters?.minScore !== undefined) where.score = { gte: filters.minScore };

  const leads = await prisma.lead.findMany({
    where,
    include: { company: true },
    orderBy: { score: "desc" },
  });

  return leads.map((l) => ({
    ...l,
    anniversary: calculateAnniversary(l.company.foundationYear),
  }));
}

export async function getLead(id: string) {
  await requireAuth();
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      company: {
        include: {
          contacts: true,
          events: true,
          previews: { orderBy: { createdAt: "desc" } },
          researchSources: true,
          claims: true,
        },
      },
      outreachMessages: { orderBy: { createdAt: "desc" } },
      outreachActivities: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!lead) return null;
  return {
    ...lead,
    anniversary: calculateAnniversary(lead.company.foundationYear),
  };
}
