export const COMPANY_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  BANKRUPT: "BANKRUPT",
  ACQUIRED: "ACQUIRED",
  MERGED: "MERGED",
} as const;

export const LEAD_STAGE = {
  FOUND: "FOUND",
  RESEARCHING: "RESEARCHING",
  QUALIFIED: "QUALIFIED",
  PREVIEW_READY: "PREVIEW_READY",
  OUTREACH_READY: "OUTREACH_READY",
  CONTACTED: "CONTACTED",
  FOLLOW_UP: "FOLLOW_UP",
  REPLIED: "REPLIED",
  MEETING: "MEETING",
  PROPOSAL: "PROPOSAL",
  WON: "WON",
  LOST: "LOST",
  DO_NOT_CONTACT: "DO_NOT_CONTACT",
} as const;

export const CLAIM_STATUS = {
  VERIFIED: "VERIFIED",
  LIKELY: "LIKELY",
  UNCERTAIN: "UNCERTAIN",
  CONFLICTING: "CONFLICTING",
  REJECTED: "REJECTED",
} as const;

export const SOURCE_TYPE = {
  WEBSITE: "WEBSITE",
  NEWS: "NEWS",
  ARCHIVE: "ARCHIVE",
  MANUAL: "MANUAL",
  IMPORT: "IMPORT",
  OTHER: "OTHER",
} as const;

export const OUTREACH_CHANNEL = {
  EMAIL: "EMAIL",
  LINKEDIN: "LINKEDIN",
} as const;

export const COST_CATEGORY = {
  LLM: "LLM",
  SEARCH: "SEARCH",
  OCR: "OCR",
  STORAGE: "STORAGE",
  EMAIL: "EMAIL",
  OTHER: "OTHER",
} as const;

export type CompanyStatus = (typeof COMPANY_STATUS)[keyof typeof COMPANY_STATUS];
export type LeadStage = (typeof LEAD_STAGE)[keyof typeof LEAD_STAGE];
export type ClaimStatus = (typeof CLAIM_STATUS)[keyof typeof CLAIM_STATUS];
export type SourceType = (typeof SOURCE_TYPE)[keyof typeof SOURCE_TYPE];
export type OutreachChannel = (typeof OUTREACH_CHANNEL)[keyof typeof OUTREACH_CHANNEL];
export type CostCategory = (typeof COST_CATEGORY)[keyof typeof COST_CATEGORY];
