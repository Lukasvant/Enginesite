import { AnniversaryResult } from "./anniversary";

export interface ScoringInput {
  anniversary: AnniversaryResult;
  employeeSize?: string | null;
  hasWebsite?: boolean;
  hasContact?: boolean;
  historyStrength?: number; // 0-1 based on number/quality of claims
  isFamilyBusiness?: boolean;
  status?: string;
  industry?: string | null;
  hasFoundationDateConfidence?: boolean;
  foundationConfidence?: number | null;
}

export interface ScoreResult {
  score: number;
  reasons: string[];
}

const EMPLOYEE_WEIGHTS: Record<string, number> = {
  "10-50": 5,
  "50-250": 10,
  "250+": 5,
  "10-500": 10,
};

export function scoreLead(input: ScoringInput): ScoreResult {
  const reasons: string[] = [];
  let score = 0;

  // Anniversary timing
  if (input.anniversary.monthsUntil !== null) {
    if (input.anniversary.monthsUntil >= 6 && input.anniversary.monthsUntil <= 18) {
      score += 25;
      reasons.push("Jubileum valt binnen 6-18 maanden");
    } else if (input.anniversary.monthsUntil >= 0 && input.anniversary.monthsUntil < 6) {
      score += 15;
      reasons.push("Jubileum binnenkort, mogelijk te kort dag");
    } else if (input.anniversary.monthsUntil > 18 && input.anniversary.monthsUntil <= 24) {
      score += 10;
      reasons.push("Jubileum binnen 24 maanden");
    }
  }

  // Milestone age
  const age = input.anniversary.anniversaryAge;
  if (age === 50 || age === 75 || age === 100) {
    score += 20;
    reasons.push(`Belangrijk jubileum: ${age} jaar`);
  } else if (age === 25 || age === 40 || age === 125 || age === 150) {
    score += 10;
    reasons.push(`Mooi jubileum: ${age} jaar`);
  }

  // Employee size
  const empKey = input.employeeSize ?? "";
  if (EMPLOYEE_WEIGHTS[empKey]) {
    score += EMPLOYEE_WEIGHTS[empKey];
    reasons.push(`Bedrijfsgrootte: ${empKey} medewerkers`);
  }

  // Website
  if (input.hasWebsite) {
    score += 5;
    reasons.push("Actieve website aanwezig");
  }

  // Contact
  if (input.hasContact) {
    score += 10;
    reasons.push("Relevante contactpersoon gevonden");
  }

  // History strength
  const strength = input.historyStrength ?? 0;
  if (strength >= 0.7) {
    score += 10;
    reasons.push("Sterke publieke geschiedenis");
  } else if (strength >= 0.4) {
    score += 5;
    reasons.push("Redelijke publieke geschiedenis");
  }

  // Family business
  if (input.isFamilyBusiness) {
    score += 5;
    reasons.push("Familiebedrijf");
  }

  // Foundation confidence
  if (input.hasFoundationDateConfidence && (input.foundationConfidence ?? 0) >= 0.8) {
    score += 10;
    reasons.push("Duidelijke oprichtingsdatum");
  } else {
    score -= 10;
    reasons.push("Oprichtingsdatum onzeker");
  }

  // Status penalties
  if (input.status === "INACTIVE" || input.status === "BANKRUPT") {
    score -= 30;
    reasons.push("Bedrijf niet actief of failliet");
  }

  const clamped = Math.max(0, Math.min(100, score));
  return { score: clamped, reasons };
}
