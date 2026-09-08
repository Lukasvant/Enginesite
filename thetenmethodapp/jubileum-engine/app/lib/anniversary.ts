export const ANNIVERSARY_AGES = [25, 40, 50, 75, 100, 125, 150];

export interface AnniversaryResult {
  foundationYear: number | null;
  anniversaryYear: number | null;
  anniversaryAge: number | null;
  monthsUntil: number | null;
  isUpcoming: boolean;
  nextMilestoneAge: number | null;
  nextMilestoneYear: number | null;
}

export function calculateAnniversary(
  foundationYear: number | null | undefined,
  referenceDate = new Date()
): AnniversaryResult {
  if (!foundationYear) {
    return {
      foundationYear: null,
      anniversaryYear: null,
      anniversaryAge: null,
      monthsUntil: null,
      isUpcoming: false,
      nextMilestoneAge: null,
      nextMilestoneYear: null,
    };
  }

  const refYear = referenceDate.getFullYear();
  const refMonth = referenceDate.getMonth(); // 0-11

  // Find the next meaningful anniversary age
  let nextAge: number | null = null;
  for (const age of ANNIVERSARY_AGES) {
    const milestoneYear = foundationYear + age;
    if (milestoneYear >= refYear) {
      nextAge = age;
      break;
    }
  }

  // If no listed milestone in the future, compute next multiple of 25
  if (!nextAge) {
    const yearsSince = refYear - foundationYear;
    nextAge = Math.ceil(yearsSince / 25) * 25;
  }

  const nextMilestoneYear = foundationYear + nextAge;
  const monthsUntil = (nextMilestoneYear - refYear) * 12 - refMonth;

  return {
    foundationYear,
    anniversaryYear: nextMilestoneYear,
    anniversaryAge: nextAge,
    monthsUntil,
    isUpcoming: monthsUntil >= 0 && monthsUntil <= 24,
    nextMilestoneAge: nextAge,
    nextMilestoneYear,
  };
}

export function filterByAnniversaryWindow(
  companies: { foundationYear: number | null }[],
  months: number,
  ages: number[],
  referenceDate = new Date()
) {
  return companies.filter((c) => {
    const ann = calculateAnniversary(c.foundationYear, referenceDate);
    if (ann.monthsUntil === null) return false;
    if (ann.monthsUntil < 0 || ann.monthsUntil > months) return false;
    if (!ages.includes(ann.anniversaryAge ?? 0)) return false;
    return true;
  });
}
