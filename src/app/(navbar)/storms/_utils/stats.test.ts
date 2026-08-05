import {
  calculateDistances,
  calculateGapAverage,
  formatDistance,
  getEffectiveMonth,
  getHighlights,
} from "@/app/(navbar)/storms/_utils/stats";
import { storm } from "@/lib/testFixtures";

describe("getHighlights", () => {
  const storms = [
    storm({ name: "Yagi", isStrongest: true }),
    storm({ name: "Haiyan", isFirst: true }),
    storm({ name: "Nakri", isLast: true }),
    storm({ name: "Krathon", intensity: "NT" }),
  ];

  it("selects by the requested flag", () => {
    expect(getHighlights(storms, "strongest").map((s) => s.name)).toEqual(["Yagi"]);
    expect(getHighlights(storms, "first").map((s) => s.name)).toEqual(["Haiyan"]);
    expect(getHighlights(storms, "last").map((s) => s.name)).toEqual(["Nakri"]);
    expect(getHighlights(storms, "untracked").map((s) => s.name)).toEqual(["Krathon"]);
  });

  it("returns nothing for an unknown highlight type", () => {
    expect(getHighlights(storms, "bogus")).toEqual([]);
  });
});

describe("calculateGapAverage / calculateDistances", () => {
  it("averages the year gaps between appearances", () => {
    const storms = [storm({ year: 2000 }), storm({ year: 2004 }), storm({ year: 2006 })];
    expect(calculateGapAverage(storms)).toBe(3); // gaps of 4 and 2
  });

  it("sorts before measuring, so input order does not matter", () => {
    const ascending = [storm({ year: 2000 }), storm({ year: 2006 })];
    const descending = [storm({ year: 2006 }), storm({ year: 2000 })];
    expect(calculateGapAverage(descending)).toBe(calculateGapAverage(ascending));
  });

  it("returns -1 when there is no gap to measure", () => {
    expect(calculateGapAverage([storm({ year: 2024 })])).toBe(-1);
    expect(calculateGapAverage([])).toBe(-1);
  });

  it("measures each group independently", () => {
    const distances = calculateDistances(
      [
        storm({ name: "Yagi", year: 2000 }),
        storm({ name: "Yagi", year: 2006 }),
        storm({ name: "Nakri", year: 2024 }),
      ],
      "name",
    );
    expect(distances).toEqual({ Yagi: 6, Nakri: -1 });
  });
});

describe("formatDistance", () => {
  it("renders a gap to two decimals", () => {
    expect(formatDistance(3)).toBe("3.00");
    expect(formatDistance(4.5)).toBe("4.50");
  });

  it("renders the no-gap sentinel as N/A", () => {
    expect(formatDistance(-1)).toBe("N/A");
  });
});

describe("getEffectiveMonth", () => {
  it("uses the start month for an ordinary storm", () => {
    expect(getEffectiveMonth(storm({ year: 2024, dateStart: "2024-08-31" }))).toBe(8);
  });

  it("counts a carried-over storm toward January", () => {
    expect(getEffectiveMonth(storm({ year: 2001, dateStart: "2000-12-28" }))).toBe(1);
  });

  it("ignores seasons before the 2000 cutoff and storms with no start date", () => {
    expect(getEffectiveMonth(storm({ year: 1999, dateStart: "1999-08-31" }))).toBeNull();
    expect(getEffectiveMonth(storm({ year: 2024 }))).toBeNull();
  });
});
