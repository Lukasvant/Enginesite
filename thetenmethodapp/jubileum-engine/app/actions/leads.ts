"use server";

import { prisma } from "@/app/lib/prisma";
import { calculateAnniversary } from "@/app/lib/anniversary";
import { requireAuth } from "@/app/lib/auth";

export async function getLeads(filters?: { stage?: string; minScore?: number; verifiedOnly?: boolean; take?: number }) {
  await requireAuth();
  const where: any = {};
  if (filters?.stage) where.stage = filters.stage;
  if (filters?.minScore !== undefined) where.score = { gte: filters.minScore };
  if (filters?.verifiedOnly) {
    where.company = { foundationConfidence: { gte: 0.8 }, website: { not: null } };
  }

  const leads = await prisma.lead.findMany({
    where,
    include: { company: { include: { contacts: true, claims: { where: { status: "VERIFIED", claimType: "FOUNDATION" } } } } },
    orderBy: [{ score: "desc" }, { updatedAt: "desc" }],
    take: filters?.take ?? 100,
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
