"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import { calculateAnniversary } from "@/app/lib/anniversary";
import { scoreLead } from "@/app/lib/scoring";
import { researchCompany } from "@/app/lib/research";
import { generatePreviewContent } from "@/app/lib/preview";
import { generateOutreachDraft } from "@/app/lib/outreach";
import { CLAIM_STATUS, LEAD_STAGE } from "@/app/lib/constants";
import Papa from "papaparse";
import { requireAuth } from "@/app/lib/auth";
import { getMailConfiguration } from "@/app/lib/email";

export type CompanyInput = {
  name: string;
  domain?: string;
  website?: string;
  city?: string;
  province?: string;
  industry?: string;
  employeeSize?: string;
  foundationYear?: number;
  foundationDate?: string;
  foundationConfidence?: number;
  foundationEvidence?: string;
  status?: string;
  notes?: string;
  isDemo?: boolean;
};

export async function createCompany(data: CompanyInput) {
  await requireAuth();
  const anniversary = calculateAnniversary(data.foundationYear);
  const company = await prisma.company.create({
    data: {
      name: data.name,
      domain: data.domain,
      website: data.website,
      city: data.city,
      province: data.province,
      industry: data.industry,
      employeeSize: data.employeeSize,
      foundationYear: data.foundationYear,
      foundationDate: data.foundationDate,
      foundationConfidence: data.foundationConfidence,
      foundationEvidence: data.foundationEvidence,
      status: data.status ?? "ACTIVE",
      notes: data.notes,
      isDemo: data.isDemo ?? false,
    },
  });

  const scoreResult = scoreLead({
    anniversary,
    employeeSize: company.employeeSize,
    hasWebsite: !!company.website,
    hasContact: false,
    historyStrength: 0,
    status: company.status,
    hasFoundationDateConfidence: (company.foundationConfidence ?? 0) > 0,
    foundationConfidence: company.foundationConfidence,
  });

  await prisma.lead.upsert({
    where: { companyId: company.id },
    create: {
      companyId: company.id,
      stage: LEAD_STAGE.FOUND,
      score: scoreResult.score,
      scoreReasons: JSON.stringify(scoreResult.reasons),
      nextAction: "Research company",
    },
    update: {
      score: scoreResult.score,
      scoreReasons: JSON.stringify(scoreResult.reasons),
    },
  });

  revalidatePath("/companies");
  revalidatePath("/leads");
  return company;
}

export async function updateCompany(id: string, data: CompanyInput) {
  await requireAuth();
  const existing = await prisma.company.findUnique({ where: { id }, include: { contacts: true, events: true } });
  if (!existing) throw new Error("Company not found");

  const anniversary = calculateAnniversary(data.foundationYear);
  const company = await prisma.company.update({
    where: { id },
    data: {
      name: data.name,
      domain: data.domain,
      website: data.website,
      city: data.city,
      province: data.province,
      industry: data.industry,
      employeeSize: data.employeeSize,
      foundationYear: data.foundationYear,
      foundationDate: data.foundationDate,
      foundationConfidence: data.foundationConfidence,
      foundationEvidence: data.foundationEvidence,
      status: data.status ?? existing.status,
      notes: data.notes,
      isDemo: data.isDemo ?? existing.isDemo,
    },
  });

  const historyStrength = existing.events.length > 5 ? 0.7 : existing.events.length > 2 ? 0.4 : 0;
  const scoreResult = scoreLead({
    anniversary,
    employeeSize: company.employeeSize,
    hasWebsite: !!company.website,
    hasContact: existing.contacts.length > 0,
    historyStrength,
    status: company.status,
    hasFoundationDateConfidence: (company.foundationConfidence ?? 0) > 0,
    foundationConfidence: company.foundationConfidence,
  });

  await prisma.lead.upsert({
    where: { companyId: company.id },
    create: {
      companyId: company.id,
      stage: LEAD_STAGE.FOUND,
      score: scoreResult.score,
      scoreReasons: JSON.stringify(scoreResult.reasons),
      nextAction: "Research company",
    },
    update: {
      score: scoreResult.score,
      scoreReasons: JSON.stringify(scoreResult.reasons),
    },
  });

  revalidatePath("/companies");
  revalidatePath("/leads");
  return company;
}

export async function deleteCompany(id: string) {
  await requireAuth();
  await prisma.company.delete({ where: { id } });
  revalidatePath("/companies");
  revalidatePath("/leads");
}

export async function createContact(companyId: string, data: { name: string; role?: string; email?: string; linkedIn?: string; isPrimary?: boolean }) {
  await requireAuth();
  if (data.isPrimary) {
    await prisma.contact.updateMany({ where: { companyId }, data: { isPrimary: false } });
  }
  const contact = await prisma.contact.create({
    data: { companyId, ...data },
  });
  await refreshLeadScore(companyId);
  revalidatePath(`/companies/${companyId}`);
  return contact;
}

export async function deleteContact(id: string, companyId: string) {
  await requireAuth();
  await prisma.contact.delete({ where: { id } });
  await refreshLeadScore(companyId);
  revalidatePath(`/companies/${companyId}`);
}

async function refreshLeadScore(companyId: string) {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: { contacts: true, events: true, leads: true },
  });
  if (!company) return;
  const anniversary = calculateAnniversary(company.foundationYear);
  const historyStrength = company.events.length > 5 ? 0.7 : company.events.length > 2 ? 0.4 : 0;
  const scoreResult = scoreLead({
    anniversary,
    employeeSize: company.employeeSize,
    hasWebsite: !!company.website,
    hasContact: company.contacts.length > 0,
    historyStrength,
    status: company.status,
    hasFoundationDateConfidence: (company.foundationConfidence ?? 0) > 0,
    foundationConfidence: company.foundationConfidence,
  });

  const lead = company.leads[0];
  if (lead) {
    await prisma.lead.update({
      where: { id: lead.id },
      data: { score: scoreResult.score, scoreReasons: JSON.stringify(scoreResult.reasons) },
    });
  }
}

export async function addResearchSource(companyId: string, data: { title: string; url?: string; sourceType: string; content?: string }) {
  await requireAuth();
  const source = await prisma.researchSource.create({
    data: { companyId, ...data },
  });
  revalidatePath(`/companies/${companyId}`);
  return source;
}

export async function addHistoricalClaim(
  companyId: string,
  data: { claim: string; claimType?: string; sourceId?: string; sourceExcerpt?: string; sourceDate?: string; confidence: number; status?: string }
) {
  await requireAuth();
  const claim = await prisma.historicalClaim.create({
    data: {
      companyId,
      ...data,
      status: data.status ?? CLAIM_STATUS.UNCERTAIN,
    },
  });
  revalidatePath(`/companies/${companyId}`);
  return claim;
}

export async function addHistoricalEvent(
  companyId: string,
  data: { year?: number; date?: string; title: string; description?: string; source?: string; sourceUrl?: string; excerpt?: string; confidence: number; status?: string; isMilestone?: boolean }
) {
  await requireAuth();
  const event = await prisma.historicalEvent.create({
    data: {
      companyId,
      ...data,
      status: data.status ?? CLAIM_STATUS.VERIFIED,
    },
  });
  await refreshLeadScore(companyId);
  revalidatePath(`/companies/${companyId}`);
  return event;
}

export async function runResearch(companyId: string) {
  await requireAuth();
  const company = await prisma.company.findUnique({ where: { id: companyId } });
  if (!company) throw new Error("Company not found");

  const result = await researchCompany(company);

  for (const source of result.sources) {
    await prisma.researchSource.create({ data: { companyId, ...source } });
  }
  for (const claim of result.claims) {
    await prisma.historicalClaim.create({
      data: {
        companyId,
        claim: claim.claim,
        claimType: claim.claimType,
        sourceExcerpt: claim.sourceExcerpt,
        sourceDate: claim.sourceDate,
        confidence: claim.confidence,
        status: claim.status,
      },
    });
  }
  for (const event of result.events) {
    await prisma.historicalEvent.create({
      data: {
        companyId,
        year: event.year,
        date: event.date,
        title: event.title,
        description: event.description,
        source: event.source,
        sourceUrl: event.sourceUrl,
        excerpt: event.excerpt,
        confidence: event.confidence,
        status: event.status,
        isMilestone: event.isMilestone,
      },
    });
  }

  await refreshLeadScore(companyId);

  const lead = await prisma.lead.findUnique({ where: { companyId } });
  if (lead && lead.stage === LEAD_STAGE.FOUND) {
    await prisma.lead.update({ where: { id: lead.id }, data: { stage: LEAD_STAGE.RESEARCHING, nextAction: "Review research claims" } });
  }

  revalidatePath(`/companies/${companyId}`);
  revalidatePath("/leads");
  return result;
}

export async function generatePreview(companyId: string) {
  await requireAuth();
  const content = await generatePreviewContent(companyId);
  const preview = await prisma.preview.create({
    data: {
      companyId,
      title: content.title,
      intro: content.intro,
      milestones: JSON.stringify(content.milestones),
      closing: content.closing,
      isPublished: true,
    },
  });

  const lead = await prisma.lead.findUnique({ where: { companyId } });
  if (lead && [LEAD_STAGE.RESEARCHING, LEAD_STAGE.QUALIFIED].includes(lead.stage as any)) {
    await prisma.lead.update({ where: { id: lead.id }, data: { stage: LEAD_STAGE.PREVIEW_READY, nextAction: "Generate outreach" } });
  }

  revalidatePath(`/companies/${companyId}`);
  revalidatePath("/previews");
  revalidatePath("/leads");
  return preview;
}

export async function generateOutreach(leadId: string) {
  await requireAuth();
  const draft = await generateOutreachDraft(leadId);
  const message = await prisma.outreachMessage.create({
    data: {
      leadId,
      channel: draft.channel,
      subject: draft.subject,
      body: draft.body,
      isApproved: false,
    },
  });

  await prisma.lead.update({
    where: { id: leadId },
    data: { stage: LEAD_STAGE.OUTREACH_READY, nextAction: "Approve outreach" },
  });

  revalidatePath(`/leads/${leadId}`);
  revalidatePath("/leads");
  return message;
}

export async function approveOutreach(messageId: string) {
  await requireAuth();
  const message = await prisma.outreachMessage.update({
    where: { id: messageId },
    data: { isApproved: true },
  });
  await prisma.lead.update({
    where: { id: message.leadId },
    data: { stage: LEAD_STAGE.OUTREACH_READY, nextAction: "Send outreach" },
  });
  revalidatePath(`/leads/${message.leadId}`);
  return message;
}

export async function updateOutreachMessage(messageId: string, data: { subject: string; body: string }) {
  await requireAuth();
  const message = await prisma.outreachMessage.findUnique({ where: { id: messageId } });
  if (!message) throw new Error("Message not found");
  if (message.sentAt) throw new Error("A sent message cannot be edited");

  const updated = await prisma.outreachMessage.update({
    where: { id: messageId },
    data: { subject: data.subject.trim() || null, body: data.body.trim() },
  });
  revalidatePath(`/leads/${message.leadId}`);
  return updated;
}

export async function markOutreachSent(messageId: string) {
  await requireAuth();
  const message = await prisma.outreachMessage.findUnique({ where: { id: messageId }, include: { lead: { include: { company: true } } } });
  if (!message) throw new Error("Message not found");
  if (!message.isApproved) throw new Error("Message must be approved before sending");

  // Sending happens outside this app. This only records the user's confirmed action.
  await prisma.outreachMessage.update({
    where: { id: messageId },
    data: { sentAt: new Date() },
  });
  await prisma.lead.update({
    where: { id: message.leadId },
    data: { stage: LEAD_STAGE.CONTACTED, nextAction: "Follow up" },
  });
  await prisma.outreachActivity.create({
    data: {
      leadId: message.leadId,
      type: "FOLLOW_UP",
      note: `Handmatig verstuurd via ${message.channel}.`,
    },
  });

  revalidatePath(`/leads/${message.leadId}`);
  revalidatePath("/leads");
  return message;
}

export async function sendOutreach(messageId: string) {
  await requireAuth();
  const message = await prisma.outreachMessage.findUnique({
    where: { id: messageId },
    include: { lead: { include: { company: { include: { contacts: true } } } } },
  });
  if (!message) throw new Error("Message not found");
  if (!message.isApproved) throw new Error("Message must be approved before sending");
  if (message.sentAt) throw new Error("Message has already been sent");

  const recipient = message.lead.company.contacts.find((contact) => contact.isPrimary && contact.email)
    ?? message.lead.company.contacts.find((contact) => contact.email);
  if (!recipient?.email) throw new Error("Voeg eerst een contactpersoon met e-mailadres toe");

  const mail = getMailConfiguration();
  if (!mail.transporter) throw new Error("Infomaniak is nog niet ingesteld. Voeg INFOMANIAK_SMTP_PASSWORD toe in Vercel.");

  await mail.transporter.sendMail({
    from: mail.from,
    to: recipient.email,
    subject: message.subject ?? `Jubileumverhaal voor ${message.lead.company.name}`,
    text: message.body,
  });

  await prisma.outreachMessage.update({ where: { id: messageId }, data: { sentAt: new Date() } });
  await prisma.lead.update({ where: { id: message.leadId }, data: { stage: LEAD_STAGE.CONTACTED, nextAction: "Follow up" } });
  await prisma.outreachActivity.create({ data: { leadId: message.leadId, type: "FOLLOW_UP", note: `Verstuurd via Infomaniak naar ${recipient.email}.` } });
  revalidatePath(`/leads/${message.leadId}`);
  revalidatePath("/leads");
  return message;
}

export async function addActivity(leadId: string, type: string, note?: string) {
  await requireAuth();
  const activity = await prisma.outreachActivity.create({
    data: { leadId, type, note },
  });
  let stage: string | undefined;
  if (type === "REPLY") stage = LEAD_STAGE.REPLIED;
  if (type === "MEETING") stage = LEAD_STAGE.MEETING;
  if (type === "PROPOSAL") stage = LEAD_STAGE.PROPOSAL;
  if (type === "WON") stage = LEAD_STAGE.WON;
  if (type === "LOST") stage = LEAD_STAGE.LOST;
  if (type === "FOLLOW_UP") stage = LEAD_STAGE.FOLLOW_UP;

  if (stage) {
    await prisma.lead.update({
      where: { id: leadId },
      data: { stage, nextAction: deriveNextAction(stage) },
    });
  }

  revalidatePath(`/leads/${leadId}`);
  revalidatePath("/leads");
  return activity;
}

function deriveNextAction(stage: string): string {
  const map: Record<string, string> = {
    FOUND: "Research company",
    RESEARCHING: "Review claims",
    QUALIFIED: "Generate preview",
    PREVIEW_READY: "Generate outreach",
    OUTREACH_READY: "Approve and send outreach",
    CONTACTED: "Follow up",
    FOLLOW_UP: "Follow up again",
    REPLIED: "Reply",
    MEETING: "Prepare proposal",
    PROPOSAL: "Close deal",
    WON: "Start production",
    LOST: "Archive lead",
    DO_NOT_CONTACT: "No action",
  };
  return map[stage] ?? "Review";
}

export async function updateLeadStage(leadId: string, stage: string) {
  await requireAuth();
  const lead = await prisma.lead.update({
    where: { id: leadId },
    data: { stage, nextAction: deriveNextAction(stage) },
  });
  revalidatePath(`/leads/${leadId}`);
  revalidatePath("/leads");
  return lead;
}

function localDateKey(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris" }).format(date);
}

export async function toggleTodayOutreachLead(leadId: string, selected: boolean) {
  await requireAuth();
  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead) throw new Error("Lead not found");
  const batch = await prisma.dailyOutreachBatch.upsert({
    where: { date: localDateKey() },
    create: { date: localDateKey() },
    update: {},
  });

  if (selected) {
    await prisma.dailyOutreachItem.upsert({
      where: { batchId_leadId: { batchId: batch.id, leadId } },
      create: { batchId: batch.id, leadId, companyId: lead.companyId },
      update: {},
    });
  } else {
    await prisma.dailyOutreachItem.deleteMany({ where: { batchId: batch.id, leadId } });
  }
  revalidatePath("/leads");
}

export async function prepareTodayOutreach() {
  await requireAuth();
  const batch = await prisma.dailyOutreachBatch.findUnique({
    where: { date: localDateKey() },
    include: { items: { include: { lead: true } }, },
  });
  if (!batch?.items.length) return { prepared: 0 };

  let prepared = 0;
  for (const item of batch.items) {
    const existingPreview = await prisma.preview.findFirst({ where: { companyId: item.companyId, isPublished: true }, orderBy: { createdAt: "desc" } });
    if (!existingPreview) {
      const content = await generatePreviewContent(item.companyId);
      await prisma.preview.create({ data: { companyId: item.companyId, title: content.title, intro: content.intro, milestones: JSON.stringify(content.milestones), closing: content.closing, isPublished: true } });
    }
    const unsent = await prisma.outreachMessage.findFirst({ where: { leadId: item.leadId, sentAt: null }, orderBy: { createdAt: "desc" } });
    if (!unsent) {
      const draft = await generateOutreachDraft(item.leadId);
      await prisma.outreachMessage.create({ data: { leadId: item.leadId, channel: draft.channel, subject: draft.subject, body: draft.body } });
    }
    await prisma.lead.update({ where: { id: item.leadId }, data: { stage: LEAD_STAGE.OUTREACH_READY, nextAction: "Controleer concept en verstuur handmatig" } });
    prepared++;
  }
  revalidatePath("/leads");
  revalidatePath("/previews");
  return { prepared };
}

export async function importCompaniesCsv(csvText: string) {
  await requireAuth();
  const parsed = Papa.parse<Record<string, string>>(csvText, { header: true, skipEmptyLines: true });
  const rows = parsed.data;
  const created: string[] = [];

  for (const row of rows) {
    const name = row.name || row.bedrijf || row.company || row["Bedrijfsnaam"];
    if (!name) continue;
    const foundationYear = parseInt(row.foundationYear || row["Oprichtingsjaar"] || "") || undefined;
    await createCompany({
      name,
      domain: row.domain || row["Domein"],
      website: row.website || row["Website"],
      city: row.city || row["Plaats"],
      province: row.province || row["Provincie"],
      industry: row.industry || row["Branche"],
      employeeSize: row.employeeSize || row["Medewerkers"],
      foundationYear,
      foundationConfidence: foundationYear ? 0.5 : undefined,
      foundationEvidence: foundationYear ? "Imported from CSV" : undefined,
      isDemo: true,
    });
    created.push(name);
  }

  revalidatePath("/companies");
  revalidatePath("/leads");
  return created;
}
