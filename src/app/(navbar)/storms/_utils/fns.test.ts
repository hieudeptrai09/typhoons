import {
  calculateAverage,
  calculateAvgDates,
  calculateAvgDatesByGroup,
  calculateAvgDuration,
  calculateDistances,
  calculateGapAverage,
  formatDayOfYear,
  formatDistance,
  getCanonicalStormsSlugs,
  getDashboardDescription,
  getDashboardTitle,
  getDoyMonth,
  getEffectiveMonth,
  getGroupedStorms,
  getHighlights,
  getIntensityFromNumber,
  isGridOnly,
  isListOnly,
  isValidStormsSlug,
  paramsForFilter,
  paramsForView,
  paramsToPath,
  slugToParams,
  slugToPath,
  sortNamesByFirstYear,
} from "@/app/(navbar)/storms/_utils/fns";
import type { Storm } from "@/lib/types";

const storm = (overrides: Partial<Storm> = {}): Storm => ({
  name: "Yagi",
  year: 2024,
  intensity: "5",
  position: 19,
  country: "Japan",
  map: "",
  ...overrides,
});

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
    expect(getIntensityFromNumber(-5)).toBe("TD");
  });
});

describe("isValidStormsSlug", () => {
  it("rejects the empty slug — /storms/ is a 404, not a page", () => {
    expect(isValidStormsSlug([])).toBe(false);
  });

  it("rejects every one-segment slug — the filter is never optional", () => {
    for (const slug of ["all", "highlights", "average", "distance", "avgdate"]) {
      expect(isValidStormsSlug([slug])).toBe(false);
    }
    for (const slug of ["list", "names", "positions", "storms"]) {
      expect(isValidStormsSlug([slug])).toBe(false);
    }
  });

  it("accepts a filter only when the view offers it", () => {
    expect(isValidStormsSlug(["average", "country"])).toBe(true);
    expect(isValidStormsSlug(["all", "position"])).toBe(true);
    expect(isValidStormsSlug(["all", "country"])).toBe(false); // country is average-only
    expect(isValidStormsSlug(["list", "position"])).toBe(false); // list is not a view
  });

  it("accepts list as the third segment only", () => {
    expect(isValidStormsSlug(["average", "country", "list"])).toBe(true);
    expect(isValidStormsSlug(["average", "country", "grid"])).toBe(false);
    expect(isValidStormsSlug(["average", "bogus", "list"])).toBe(false);
  });

  it("rejects unknown views and over-deep slugs", () => {
    expect(isValidStormsSlug(["bogus"])).toBe(false);
    expect(isValidStormsSlug(["average", "country", "list", "extra"])).toBe(false);
  });
});

describe("slugToParams", () => {
  it("reads the grid coordinates straight off the slug", () => {
    expect(slugToParams(["all", "name", "list"])).toEqual({
      view: "all",
      mode: "list",
      filter: "name",
    });
    expect(slugToParams(["all", "position"])).toEqual({
      view: "all",
      mode: "table",
      filter: "position",
    });
  });

  it("drops a list request the pairing cannot honour", () => {
    expect(slugToParams(["all", "position", "list"]).mode).toBe("table");
  });

  it("forces list mode for filters that have no grid", () => {
    expect(slugToParams(["average", "country"]).mode).toBe("list");
    expect(slugToParams(["average", "month"]).mode).toBe("list");
    expect(slugToParams(["average", "position"]).mode).toBe("table");
  });
});

describe("isListOnly / isGridOnly", () => {
  it("marks the average filters that only render as a list", () => {
    expect(isListOnly("average", "country")).toBe(true);
    expect(isListOnly("average", "month")).toBe(true);
    expect(isListOnly("average", "position")).toBe(false);
    expect(isListOnly("distance", "country")).toBe(false);
  });

  it("marks all-storms-by-position as grid only", () => {
    expect(isGridOnly("all", "position")).toBe(true);
    expect(isGridOnly("all", "name")).toBe(false);
  });
});

describe("paramsForView / paramsForFilter", () => {
  it("pairs a view with its default filter and a legal mode", () => {
    expect(paramsForView("all")).toEqual({ view: "all", filter: "position", mode: "table" });
    expect(paramsForView("average")).toEqual({
      view: "average",
      filter: "position",
      mode: "table",
    });
  });

  it("overrides the requested mode when the pairing forbids it", () => {
    expect(paramsForFilter("all", "position", "list").mode).toBe("table"); // grid only
    expect(paramsForFilter("average", "country", "table").mode).toBe("list"); // list only
  });

  it("keeps the requested mode when both are allowed", () => {
    expect(paramsForFilter("average", "name", "list").mode).toBe("list");
    expect(paramsForFilter("average", "name", "table").mode).toBe("table");
  });
});

describe("paramsToPath", () => {
  it("builds every path from the same view/filter/mode template", () => {
    expect(paramsToPath({ view: "all", mode: "table", filter: "name" })).toBe("/storms/all/name/");
    expect(paramsToPath({ view: "all", mode: "list", filter: "name" })).toBe(
      "/storms/all/name/list/",
    );
    expect(paramsToPath({ view: "all", mode: "table", filter: "position" })).toBe(
      "/storms/all/position/",
    );
  });

  it("appends list/ for the list mode of other views", () => {
    expect(paramsToPath({ view: "average", mode: "table", filter: "year" })).toBe(
      "/storms/average/year/",
    );
    expect(paramsToPath({ view: "average", mode: "list", filter: "year" })).toBe(
      "/storms/average/year/list/",
    );
  });
});

describe("slugToPath", () => {
  it("joins the segments into a trailing-slash path", () => {
    expect(slugToPath(["all", "name"])).toBe("/storms/all/name/");
    expect(slugToPath(["average", "country", "list"])).toBe("/storms/average/country/list/");
  });
});

describe("getCanonicalStormsSlugs", () => {
  const canonical = getCanonicalStormsSlugs();

  it("only returns slugs the route accepts", () => {
    for (const slug of canonical) {
      expect(isValidStormsSlug(slug)).toBe(true);
    }
  });

  it("returns slugs that already sit at their own canonical path", () => {
    for (const slug of canonical) {
      expect(paramsToPath(slugToParams(slug))).toBe(slugToPath(slug));
    }
  });

  it("gives the sitemap no duplicate URLs", () => {
    const paths = canonical.map((slug) => slugToPath(slug));
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("never emits bare views — they are 404s, not redirects", () => {
    expect(canonical).not.toContainEqual(["highlights"]);
    expect(canonical).not.toContainEqual(["all"]);
  });

  it("never emits the empty slug — /storms/ is a 404, not a page", () => {
    expect(canonical).not.toContainEqual([]);
    expect(canonical).toContainEqual(["all", "name"]);
    expect(canonical).toContainEqual(["all", "position"]);
    expect(canonical).toContainEqual(["all", "name", "list"]);
  });
});

describe("getHighlights", () => {
  const storms = [
    storm({ name: "Yagi", isStrongest: true }),
    storm({ name: "Haiyan", isFirst: true }),
    storm({ name: "Nakri", isLast: true }),
    storm({ name: "Krathon", isJtwcForecasted: false }),
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

describe("average storm dates", () => {
  it("round-trips a single storm's dates through the day-of-year math", () => {
    const { startDoy, endDoy } = calculateAvgDates([
      storm({ dateStart: "2024-08-31", dateEnd: "2024-09-09" }),
    ]);
    expect(formatDayOfYear(startDoy)).toBe("31/8");
    expect(formatDayOfYear(endDoy)).toBe("9/9");
  });

  it("collapses 29/2 onto 28/2 so a leap day never appears in the output", () => {
    const leap = calculateAvgDates([storm({ dateStart: "2024-02-29" })]);
    const nonLeap = calculateAvgDates([storm({ dateStart: "2023-02-28" })]);
    expect(leap.startDoy).toBe(nonLeap.startDoy);
    expect(formatDayOfYear(leap.startDoy)).toBe("28/2");
  });

  it("keeps a Dec-to-Jan storm's end after its start", () => {
    const { startDoy, endDoy } = calculateAvgDates([
      storm({ year: 2023, dateStart: "2023-12-30", dateEnd: "2024-01-02" }),
    ]);
    expect(endDoy).toBeGreaterThan(startDoy);
    expect(formatDayOfYear(endDoy)).toBe("2/1"); // wraps back onto a real date
    expect(getDoyMonth(endDoy)).toBe(1);
  });

  it("never averages a new-year-spanning group below 1/1", () => {
    const { endDoy } = calculateAvgDates([
      storm({ year: 2023, dateStart: "2023-12-30", dateEnd: "2024-01-02" }),
      storm({ year: 2023, dateStart: "2023-12-28", dateEnd: "2024-01-06" }),
    ]);
    expect(endDoy).toBeGreaterThan(365);
    expect(formatDayOfYear(endDoy)).toBe("4/1");
  });

  it("reports -1 when no storm in the group carries a date", () => {
    const { startDoy, endDoy } = calculateAvgDates([storm()]);
    expect(startDoy).toBe(-1);
    expect(endDoy).toBe(-1);
    expect(formatDayOfYear(-1)).toBe("N/A");
    expect(getDoyMonth(-1)).toBe(-1);
  });

  it("ignores the storms with no date when averaging the rest", () => {
    const withDate = calculateAvgDates([storm({ dateStart: "2024-08-31" })]);
    const mixed = calculateAvgDates([storm({ dateStart: "2024-08-31" }), storm()]);
    expect(mixed.startDoy).toBe(withDate.startDoy);
  });

  it("averages each group independently", () => {
    const byName = calculateAvgDatesByGroup(
      [
        storm({ name: "Yagi", dateStart: "2024-08-31" }),
        storm({ name: "Nakri", dateStart: "2024-01-01" }),
      ],
      "name",
    );
    expect(formatDayOfYear(byName.Yagi.startDoy)).toBe("31/8");
    expect(formatDayOfYear(byName.Nakri.startDoy)).toBe("1/1");
  });
});

describe("calculateAvgDuration", () => {
  it("averages the whole-day durations", () => {
    expect(
      calculateAvgDuration([
        storm({ dateStart: "2024-08-31", dateEnd: "2024-09-09" }), // 9 days
        storm({ dateStart: "2024-08-01", dateEnd: "2024-08-06" }), // 5 days
      ]),
    ).toBe(7);
  });

  it("skips storms that are still ongoing", () => {
    expect(
      calculateAvgDuration([
        storm({ dateStart: "2024-08-31", dateEnd: "2024-09-09" }),
        storm({ dateStart: "2024-08-31" }),
      ]),
    ).toBe(9);
  });

  it("returns -1 when nothing has a full date range", () => {
    expect(calculateAvgDuration([storm()])).toBe(-1);
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

describe("getDashboardTitle", () => {
  it("titles the storms view by its filter", () => {
    expect(getDashboardTitle("all", "table", "position")).toBe("All Storms by Position");
    expect(getDashboardTitle("all", "table", "name")).toBe("All Storms by Name");
  });

  it("defaults to the storms view", () => {
    expect(getDashboardTitle(undefined, undefined, "name")).toBe("All Storms by Name");
  });

  it("capitalizes the filter into the other view titles", () => {
    expect(getDashboardTitle("highlights", "table", "strongest")).toBe(
      "Strongest Typhoons by Position",
    );
    expect(getDashboardTitle("average", "list", "country")).toBe("Average Intensity by Country");
    expect(getDashboardTitle("distance", "table", "name")).toBe(
      "Average Gap Between Storms by Name",
    );
    expect(getDashboardTitle("avgdate", "table", "position")).toBe(
      "Average Storm Dates by Position",
    );
  });

  it("takes the first value of a repeated query param", () => {
    expect(getDashboardTitle(["average"], "list", ["country"])).toBe(
      "Average Intensity by Country",
    );
  });

  it("falls back to the all-storms title rather than returning nothing", () => {
    expect(getDashboardTitle("bogus", "table", "bogus")).toBe("All Storms by Name");
  });
});

describe("getDashboardDescription", () => {
  it("describes each storms mode differently", () => {
    const table = getDashboardDescription("all", "table", "position");
    const list = getDashboardDescription("all", "list", "name");
    expect(table).not.toBe(list);
    expect(table.length).toBeGreaterThan(0);
  });

  it("has a description for every valid view/filter pairing", () => {
    for (const slug of getCanonicalStormsSlugs()) {
      const { view, mode, filter } = slugToParams(slug);
      expect(getDashboardDescription(view, mode, filter).length).toBeGreaterThan(0);
    }
  });

  it("falls back rather than returning nothing for an unknown filter", () => {
    expect(getDashboardDescription("average", "table", "bogus").length).toBeGreaterThan(0);
    expect(getDashboardDescription("bogus", "table", "bogus").length).toBeGreaterThan(0);
  });
});
