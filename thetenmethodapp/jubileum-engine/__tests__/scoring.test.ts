import { scoreLead } from "../app/lib/scoring";
import { calculateAnniversary } from "../app/lib/anniversary";

describe("Lead scoring", () => {
  it("gives high score for strong anniversary prospect", () => {
    const anniversary = calculateAnniversary(1977, new Date("2027-01-01"));
    const result = scoreLead({
      anniversary,
      employeeSize: "50-250",
      hasWebsite: true,
      hasContact: true,
      historyStrength: 0.8,
      isFamilyBusiness: true,
      status: "ACTIVE",
      hasFoundationDateConfidence: true,
      foundationConfidence: 0.9,
    });
    expect(result.score).toBeGreaterThanOrEqual(70);
    expect(result.reasons.length).toBeGreaterThan(0);
  });

  it("penalizes inactive or bankrupt companies", () => {
    const anniversary = calculateAnniversary(1977, new Date("2027-01-01"));
    const result = scoreLead({
      anniversary,
      status: "BANKRUPT",
      hasFoundationDateConfidence: false,
    });
    expect(result.score).toBeLessThanOrEqual(30);
    expect(result.reasons.some((r) => r.includes("niet actief") || r.includes("failliet"))).toBe(true);
  });

  it("clamps score between 0 and 100", () => {
    const result = scoreLead({
      anniversary: calculateAnniversary(1977, new Date("2027-01-01")),
      status: "ACTIVE",
      hasFoundationDateConfidence: true,
      foundationConfidence: 0.9,
    });
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });
});
