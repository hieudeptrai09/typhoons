import { storm } from "@/lib/testFixtures";
import type { Storm } from "@/lib/types";
import {
  calculateAverage,
  getGroupedStorms,
  getIntensityFromNumber,
  sortNamesByFirstYear,
} from "@/lib/utils/storms";

describe("getIntensityFromNumber", () => {
  it("rounds an averaged rank onto a real intensity", () => {
    expect(getIntensityFromNumber(4.6)).toBe("5");
    expect(getIntensityFromNumber(4)).toBe("4");
    expect(getIntensityFromNumber(3.4)).toBe("3");
    expect(getIntensityFromNumber(1.5)).toBe("2");
  });

  it("clamps above category 5", () => {
    expect(getIntensityFromNumber(7)).toBe("5");
  });

  it("maps the sub-typhoon ranks", () => {
    expect(getIntensityFromNumber(0)).toBe("TS");
    expect(getIntensityFromNumber(0.4)).toBe("TS");
    expect(getIntensityFromNumber(-0.4)).toBe("TS");
    expect(getIntensityFromNumber(-1)).toBe("TD");
  });

  it("maps ranks below TD onto untracked", () => {
    expect(getIntensityFromNumber(-2)).toBe("NT");
    expect(getIntensityFromNumber(-5)).toBe("NT");
  });
});

describe("getGroupedStorms", () => {
  it("groups by the given key", () => {
    const grouped = getGroupedStorms(
      [storm({ name: "Yagi", year: 2018 }), storm({ name: "Yagi", year: 2024 })],
      "name",
    );
    expect(Object.keys(grouped)).toEqual(["Yagi"]);
    expect(grouped.Yagi).toHaveLength(2);
  });
});

describe("calculateAverage", () => {
  it("averages the intensity ranks", () => {
    expect(calculateAverage([storm({ intensity: "5" }), storm({ intensity: "3" })])).toBe(4);
  });

  it("ranks TS and STS the same, below category 1", () => {
    expect(calculateAverage([storm({ intensity: "TS" }), storm({ intensity: "STS" })])).toBe(0);
    expect(calculateAverage([storm({ intensity: "TD" })])).toBe(-1);
  });

  it("ranks storms the JTWC never tracked at -2, below TD", () => {
    expect(calculateAverage([storm({ intensity: "NT" })])).toBe(-2);
    expect(calculateAverage([storm({ intensity: "4" }), storm({ intensity: "NT" })])).toBe(1);
  });
});

describe("sortNamesByFirstYear", () => {
  it("orders groups by their earliest storm", () => {
    const entries: [string, Storm[]][] = [
      ["Nakri", [storm({ year: 2019 }), storm({ year: 2008 })]],
      ["Yagi", [storm({ year: 2000 })]],
    ];
    expect(sortNamesByFirstYear(entries).map(([name]) => name)).toEqual(["Yagi", "Nakri"]);
  });

  it("does not mutate the input", () => {
    const entries: [string, Storm[]][] = [
      ["Nakri", [storm({ year: 2019 })]],
      ["Yagi", [storm({ year: 2000 })]],
    ];
    sortNamesByFirstYear(entries);
    expect(entries.map(([name]) => name)).toEqual(["Nakri", "Yagi"]);
  });
});
