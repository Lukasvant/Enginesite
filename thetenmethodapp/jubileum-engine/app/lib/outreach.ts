import { prisma } from "./prisma";

export async function generateOutreachDraft(leadId: string, channel: "EMAIL" | "LINKEDIN" = "EMAIL") {
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: {
      company: {
        include: {
          contacts: true,
          events: true,
          previews: { orderBy: { createdAt: "desc" }, take: 1 },
        },
      },
    },
  });

  if (!lead) throw new Error("Lead not found");
  const companyWithFlag = lead.company as typeof lead.company & { doNotContact?: boolean };
  if (companyWithFlag.doNotContact) throw new Error("Company is marked do-not-contact");

  const contact = lead.company.contacts.find((c) => c.isPrimary) ?? lead.company.contacts[0];
  const contactName = contact?.name?.split(" ")[0] ?? "daar";

  const verifiedEvents = lead.company.events
    .filter((e) => e.status !== "REJECTED" && (e.confidence ?? 0) >= 0.6)
    .sort((a, b) => (a.year ?? 0) - (b.year ?? 0))
    .slice(-3);

  const eventSentences = verifiedEvents
    .map((e) => {
      const prefix = e.year ? `In ${e.year} ` : "";
      return `${prefix}${e.title.toLowerCase()}.`;
    })
    .join(" ");

  const preview = lead.company.previews[0];
  const previewUrl = preview ? `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/preview/${preview.token}` : "";

  const subject = `Jullie ${lead.company.name} jubileum — een eerste verkenning`;

  const body =
    `Hoi ${contactName},\n\n` +
    `Ik dook even in de geschiedenis van ${lead.company.name} en kwam onder andere ${eventSentences || "interessante momenten in jullie bedrijfsgeschiedenis"} tegen.\n\n` +
    `Volgens openbare bronnen komt daarnaast jullie jubileum eraan. ` +
    `Ik heb een eerste jubileumpreview gemaakt, met een doorbladerbaar boek en voorbeelden van mogelijke uitvoeringen:\n\n` +
    `${previewUrl}\n\n` +
    `Vanuit Ambachtio help ik bedrijven om losse documenten, foto's en verhalen rond zo'n moment bij elkaar te brengen en er iets van te maken dat ze daadwerkelijk kunnen gebruiken.\n\n` +
    `Mocht dat bij jullie spelen, dan laat ik graag zien wat er mogelijk is.\n\n` +
    `Groeten,\n` +
    `[je naam]`;

  return {
    lead,
    contact,
    channel,
    subject,
    body,
    previewUrl,
  };
}
