import { buildPreviewExperience, demoPreviewExperience } from "../app/lib/preview-experience";

describe("preview experience data", () => {
  test("parses live data without inventing people or memories", () => {
    const data = buildPreviewExperience({ name: "  Acme  ", foundationYear: 1976, milestones: [{ year: "1987", title: " Groei ", description: "Uitbreiding" }, { year: 2030, title: "Future" }], website: "example.com" }, 2026);
    expect(data.name).toBe("Acme"); expect(data.age).toBe(50); expect(data.website).toBe("https://example.com/");
    expect(data.milestones).toHaveLength(1); expect(data.people).toEqual([]); expect(data.memoryAnswers).toEqual([]); expect(data.sources[0].isDemo).toBe(false);
  });
  test("rejects malformed, unsafe and future values safely", () => {
    const data = buildPreviewExperience({ name: "X", foundationYear: 2030, website: "javascript:alert(1)", milestones: [null, {}, { year: "nope", title: "x" }, { year: 2020, title: "Ok" }] }, 2026);
    expect(data.foundationYear).toBeNull(); expect(data.age).toBeNull(); expect(data.website).toBeNull(); expect(data.milestones).toEqual([{ year: 2020, title: "Ok" }]);
  });
  test("demo is internally labelled and chronologically complete", () => {
    expect(demoPreviewExperience.isDemo).toBe(true); expect(demoPreviewExperience.milestones.map(m => m.year)).toEqual([1976, 1987, 1999, 2008, 2018, 2026]);
    expect(demoPreviewExperience.people).toHaveLength(3); expect(demoPreviewExperience.people.every(p => p.isDemo)).toBe(true); expect(demoPreviewExperience.memoryAnswers).toHaveLength(5); expect(demoPreviewExperience.sources.every(s => s.isDemo)).toBe(true);
  });
});
