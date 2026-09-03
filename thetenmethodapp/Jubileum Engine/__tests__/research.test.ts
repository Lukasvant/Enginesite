import { manualResearchProvider } from "../app/lib/research";

describe("Research adapter", () => {
  it("manual provider returns placeholder without fabricating facts", async () => {
    const result = await manualResearchProvider.research({ name: "Test BV", website: "https://testbv.nl" });
    expect(result.sources.length).toBe(1);
    expect(result.claims.length).toBe(0);
    expect(result.events.length).toBe(0);
    expect(result.notFound.length).toBeGreaterThan(0);
    expect(result.notFound[0]).toContain("manual");
  });

  it("manual provider handles missing website", async () => {
    const result = await manualResearchProvider.research({ name: "Test BV" });
    expect(result.sources.length).toBe(0);
    expect(result.notFound.length).toBeGreaterThan(0);
  });
});
