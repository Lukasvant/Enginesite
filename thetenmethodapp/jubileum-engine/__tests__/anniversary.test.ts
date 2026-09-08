import { calculateAnniversary, filterByAnniversaryWindow, ANNIVERSARY_AGES } from "../app/lib/anniversary";

describe("Anniversary engine", () => {
  it("returns null for missing foundation year", () => {
    const result = calculateAnniversary(null);
    expect(result.anniversaryAge).toBeNull();
    expect(result.monthsUntil).toBeNull();
    expect(result.isUpcoming).toBe(false);
  });

  it("calculates upcoming 50-year anniversary", () => {
    const referenceDate = new Date("2027-01-01");
    const result = calculateAnniversary(1977, referenceDate);
    expect(result.anniversaryAge).toBe(50);
    expect(result.anniversaryYear).toBe(2027);
    expect(result.monthsUntil).toBeGreaterThanOrEqual(0);
    expect(result.isUpcoming).toBe(true);
  });

  it("calculates next 25-year anniversary after milestone passed", () => {
    const referenceDate = new Date("2028-06-01");
    const result = calculateAnniversary(1977, referenceDate);
    expect(result.anniversaryAge).toBe(75);
    expect(result.anniversaryYear).toBe(2052);
    expect(result.monthsUntil).toBeGreaterThan(0);
  });

  it("filters companies by window and ages", () => {
    const companies = [
      { foundationYear: 1977 },
      { foundationYear: 2000 },
      { foundationYear: null as unknown as number },
    ];
    const referenceDate = new Date("2027-01-01");
    const filtered = filterByAnniversaryWindow(companies, 12, ANNIVERSARY_AGES, referenceDate);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].foundationYear).toBe(1977);
  });
});
