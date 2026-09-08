import { PrismaClient } from "@prisma/client";
import { calculateAnniversary } from "../app/lib/anniversary";
import { scoreLead } from "../app/lib/scoring";
import { LEAD_STAGE } from "../app/lib/constants";

const prisma = new PrismaClient();
const SOURCE_URL = process.env.SOURCE_SUPABASE_URL;
const SOURCE_KEY = process.env.SOURCE_SUPABASE_ANON_KEY;
const BATCH_SIZE = 500;

type SourceCompany = {
  kvk_number: string;
  company_name: string;
  sbi_description: string | null;
  city: string;
  website_url: string | null;
  employee_count: number | null;
  registration_date: string | null;
};

function requireEnv(value: string | undefined, name: string): string {
  if (!value) throw new Error(`${name} is required.`);
  return value;
}

function employeeSize(count: number | null): string | undefined {
  if (count === null) return undefined;
  if (count < 10) return "1-9";
  if (count < 50) return "10-50";
  if (count < 250) return "50-250";
  return "250+";
}

function domainFromWebsite(website: string | null): string | undefined {
  if (!website) return undefined;
  try {
    return new URL(website).hostname.replace(/^www\./, "");
  } catch {
    return undefined;
  }
}

function foundationYear(registrationDate: string | null): number | undefined {
  if (!registrationDate || !/^\d{4}-\d{2}-\d{2}$/.test(registrationDate)) return undefined;
  return Number(registrationDate.slice(0, 4));
}

async function fetchBatch(offset: number): Promise<SourceCompany[]> {
  const query = new URLSearchParams({
    select: "kvk_number,company_name,sbi_description,city,website_url,employee_count,registration_date",
    order: "kvk_number.asc",
    offset: String(offset),
    limit: String(BATCH_SIZE),
  });
  const response = await fetch(`${requireEnv(SOURCE_URL, "SOURCE_SUPABASE_URL")}/rest/v1/companies?${query}`, {
    headers: { apikey: requireEnv(SOURCE_KEY, "SOURCE_SUPABASE_ANON_KEY") },
  });
  if (!response.ok) throw new Error(`Ambachtregister export failed: ${response.status} ${await response.text()}`);
  return response.json() as Promise<SourceCompany[]>;
}

async function importBatch(records: SourceCompany[]) {
  await prisma.company.createMany({
    data: records.map((record) => {
      const year = foundationYear(record.registration_date);
      return {
        sourceKvkNumber: record.kvk_number,
        name: record.company_name,
        domain: domainFromWebsite(record.website_url),
        website: record.website_url ?? undefined,
        city: record.city,
        industry: record.sbi_description ?? undefined,
        employeeSize: employeeSize(record.employee_count),
        foundationYear: year,
        foundationDate: record.registration_date ?? undefined,
        foundationConfidence: year ? 0.5 : undefined,
        foundationEvidence: year ? "KVK registratiedatum via Ambachtregister; verifieer historische oprichting." : undefined,
        status: "ACTIVE",
        isDemo: false,
        notes: "Imported from Ambachtregister KVK dataset.",
      };
    }),
    skipDuplicates: true,
  });

  const companies = await prisma.company.findMany({
    where: { sourceKvkNumber: { in: records.map((record) => record.kvk_number) } },
    select: { id: true, foundationYear: true, foundationConfidence: true, employeeSize: true, website: true, status: true },
  });

  await prisma.lead.createMany({
    data: companies.map((company) => {
      const anniversary = calculateAnniversary(company.foundationYear);
      const score = scoreLead({
        anniversary,
        employeeSize: company.employeeSize,
        hasWebsite: Boolean(company.website),
        hasContact: false,
        historyStrength: 0,
        status: company.status,
        hasFoundationDateConfidence: Boolean(company.foundationConfidence),
        foundationConfidence: company.foundationConfidence,
      });
      return {
        companyId: company.id,
        stage: LEAD_STAGE.FOUND,
        score: score.score,
        scoreReasons: JSON.stringify(score.reasons),
        nextAction: company.foundationYear ? "Verify foundation date" : "Research foundation date",
      };
    }),
    skipDuplicates: true,
  });
}

async function main() {
  const requestedLimit = Number(process.argv[2] ?? "0");
  let imported = 0;

  for (let offset = 0; requestedLimit === 0 || imported < requestedLimit; offset += BATCH_SIZE) {
    const records = await fetchBatch(offset);
    if (records.length === 0) break;
    const batch = requestedLimit > 0 ? records.slice(0, requestedLimit - imported) : records;
    if (batch.length === 0) break;
    await importBatch(batch);
    imported += batch.length;
    console.log(`Imported ${imported} companies`);
    if (records.length < BATCH_SIZE || batch.length < records.length) break;
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
