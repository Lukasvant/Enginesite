"use server";

import { prisma } from "@/app/lib/prisma";
import { requireAuth } from "@/app/lib/auth";

export async function getMetrics() {
  await requireAuth();
  const totalCompanies = await prisma.company.count();
  const totalLeads = await prisma.lead.count();
  const previews = await prisma.preview.count();
  const outreachApproved = await prisma.outreachMessage.count({ where: { isApproved: true } });
  const outreachSent = await prisma.outreachMessage.count({ where: { sentAt: { not: null } } });
  const won = await prisma.lead.count({ where: { stage: "WON" } });
  const lost = await prisma.lead.count({ where: { stage: "LOST" } });
  const highScoreLeads = await prisma.lead.count({ where: { score: { gte: 70 } } });

  const stageCounts = await prisma.lead.groupBy({ by: ["stage"], _count: { stage: true } });

  return {
    totalCompanies,
    totalLeads,
    previews,
    outreachApproved,
    outreachSent,
    won,
    lost,
    highScoreLeads,
    stageCounts,
  };
}
