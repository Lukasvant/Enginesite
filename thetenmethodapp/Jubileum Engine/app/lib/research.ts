import { ClaimStatus } from "./constants";

export interface ResearchSourceInput {
  title: string;
  url?: string;
  sourceType: string;
  content?: string;
}

export interface HistoricalClaimOutput {
  claim: string;
  claimType: string;
  sourceExcerpt?: string;
  sourceDate?: string;
  confidence: number;
  status: ClaimStatus;
}

export interface HistoricalEventOutput {
  year?: number;
  date?: string;
  title: string;
  description?: string;
  source?: string;
  sourceUrl?: string;
  excerpt?: string;
  confidence: number;
  status: ClaimStatus;
  isMilestone: boolean;
}

export interface ResearchResult {
  sources: ResearchSourceInput[];
  claims: HistoricalClaimOutput[];
  events: HistoricalEventOutput[];
  notFound: string[];
}

/**
 * Adapter interface for company research.
 * First implementation is deterministic/manual; replace with real provider later.
 */
export interface ResearchProvider {
  name: string;
  research(company: { name: string; website?: string | null }): Promise<ResearchResult>;
}

export const manualResearchProvider: ResearchProvider = {
  name: "manual",
  async research(company) {
    return {
      sources: company.website
        ? [
            {
              title: `${company.name} website`,
              url: company.website,
              sourceType: "WEBSITE",
              content: "Source discovered; manual review required.",
            },
          ]
        : [],
      claims: [],
      events: [],
      notFound: ["Automated research not configured. Add sources and claims manually."],
    };
  },
};

export const researchProviders: ResearchProvider[] = [manualResearchProvider];

export async function researchCompany(company: {
  name: string;
  website?: string | null;
}): Promise<ResearchResult> {
  const results = await Promise.all(researchProviders.map((p) => p.research(company)));
  return results.reduce(
    (acc, r) => ({
      sources: [...acc.sources, ...r.sources],
      claims: [...acc.claims, ...r.claims],
      events: [...acc.events, ...r.events],
      notFound: [...acc.notFound, ...r.notFound],
    }),
    { sources: [], claims: [], events: [], notFound: [] } as ResearchResult
  );
}

export function determineNextMilestoneEvents(events: HistoricalEventOutput[]): HistoricalEventOutput[] {
  return events
    .filter((e) => e.isMilestone && (e.confidence ?? 0) >= 0.5)
    .sort((a, b) => (a.year ?? 0) - (b.year ?? 0));
}
