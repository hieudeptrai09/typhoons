import {
  getCanonicalStormsSlugs,
  getLegendKind,
  getPanel,
  isGridOnly,
  isListOnly,
  isValidStormsSlug,
  paramsForFilter,
  paramsForTab,
  paramsForView,
  paramsToPath,
  slugToParams,
  slugToPath,
} from "@/app/(navbar)/storms/_utils/routing";

describe("isValidStormsSlug", () => {
  it("rejects the empty slug — /storms/ is a 404, not a page", () => {
    expect(isValidStormsSlug([])).toBe(false);
  });

  it("rejects bare views and bare tabs — the filter is never optional", () => {
    for (const slug of [["all"], ["records"], ["stats"], ["calendar"]]) {
      expect(isValidStormsSlug(slug)).toBe(false);
    }
    expect(isValidStormsSlug(["records", "season"])).toBe(false);
    expect(isValidStormsSlug(["stats", "gap"])).toBe(false);
  });

  it("requires a tab on the tabbed views, and only one they offer", () => {
    expect(isValidStormsSlug(["records", "season", "strongest"])).toBe(true);
    expect(isValidStormsSlug(["records", "category", "cat5"])).toBe(true);
    expect(isValidStormsSlug(["stats", "intensity", "country"])).toBe(true);
    expect(isValidStormsSlug(["stats", "dates", "position"])).toBe(true);
    expect(isValidStormsSlug(["stats", "gap", "name"])).toBe(true);
    expect(isValidStormsSlug(["records", "strongest"])).toBe(false); // tab missing
    expect(isValidStormsSlug(["stats", "season", "position"])).toBe(false); // a records tab
    expect(isValidStormsSlug(["records", "gap", "position"])).toBe(false); // a stats tab
  });

  it("takes no tab on the untabbed views", () => {
    expect(isValidStormsSlug(["all", "position"])).toBe(true);
    expect(isValidStormsSlug(["calendar", "started"])).toBe(true);
    expect(isValidStormsSlug(["all", "season", "position"])).toBe(false);
  });

  it("accepts a filter only when the panel offers it", () => {
    expect(isValidStormsSlug(["all", "country"])).toBe(false); // country is a stats grouping
    expect(isValidStormsSlug(["stats", "gap", "country"])).toBe(false); // gap is position/name only
    expect(isValidStormsSlug(["stats", "dates", "month"])).toBe(false); // month is intensity only
    expect(isValidStormsSlug(["stats", "intensity", "month"])).toBe(true);
    expect(isValidStormsSlug(["calendar", "starts"])).toBe(false); // the labels read as past tense
    expect(isValidStormsSlug(["records", "category", "untracked"])).toBe(false);
    expect(isValidStormsSlug(["records", "category", "5"])).toBe(false); // slug, not the enum
  });

  it("no longer accepts the pre-merge view names", () => {
    expect(isValidStormsSlug(["highlights", "strongest"])).toBe(false);
    expect(isValidStormsSlug(["intensity", "md"])).toBe(false);
    expect(isValidStormsSlug(["average", "country"])).toBe(false);
    expect(isValidStormsSlug(["recurrence", "position"])).toBe(false);
    expect(isValidStormsSlug(["avgdate", "year"])).toBe(false);
  });

  it("accepts list as the segment after the filter only", () => {
    expect(isValidStormsSlug(["stats", "intensity", "country", "list"])).toBe(true);
    expect(isValidStormsSlug(["all", "name", "list"])).toBe(true);
    expect(isValidStormsSlug(["stats", "intensity", "country", "grid"])).toBe(false);
    expect(isValidStormsSlug(["stats", "intensity", "country", "list", "extra"])).toBe(false);
    expect(isValidStormsSlug(["all", "name", "list", "extra"])).toBe(false);
  });
});

describe("getPanel", () => {
  it("is the tab on a tabbed view and the view otherwise", () => {
    expect(getPanel({ view: "stats", tab: "gap" })).toBe("gap");
    expect(getPanel({ view: "records", tab: "category" })).toBe("category");
    expect(getPanel({ view: "all", tab: "" })).toBe("all");
    expect(getPanel({ view: "calendar", tab: "" })).toBe("calendar");
  });
});

describe("slugToParams", () => {
  it("reads view, tab, filter and mode straight off the slug", () => {
    expect(slugToParams(["all", "name", "list"])).toEqual({
      view: "all",
      tab: "",
      mode: "list",
      filter: "name",
    });
    expect(slugToParams(["stats", "dates", "name", "list"])).toEqual({
      view: "stats",
      tab: "dates",
      mode: "list",
      filter: "name",
    });
    expect(slugToParams(["records", "season", "first"])).toEqual({
      view: "records",
      tab: "season",
      mode: "table",
      filter: "first",
    });
  });

  it("drops a list request the pairing cannot honour", () => {
    expect(slugToParams(["all", "position", "list"]).mode).toBe("table");
  });

  it("forces list mode for filters that have no grid", () => {
    expect(slugToParams(["stats", "intensity", "country"]).mode).toBe("list");
    expect(slugToParams(["stats", "intensity", "month"]).mode).toBe("list");
    expect(slugToParams(["stats", "intensity", "year"]).mode).toBe("list");
    expect(slugToParams(["stats", "intensity", "position"]).mode).toBe("table");
    expect(slugToParams(["stats", "dates", "country"]).mode).toBe("list");
    expect(slugToParams(["stats", "dates", "year"]).mode).toBe("list");
    expect(slugToParams(["stats", "dates", "position"]).mode).toBe("table");
    expect(slugToParams(["calendar", "started"]).mode).toBe("list");
    expect(slugToParams(["calendar", "todate"]).mode).toBe("list");
  });
});

describe("isListOnly / isGridOnly", () => {
  it("marks the avg-intensity groupings that only render as a list", () => {
    expect(isListOnly("intensity", "country")).toBe(true);
    expect(isListOnly("intensity", "month")).toBe(true);
    expect(isListOnly("intensity", "year")).toBe(true);
    expect(isListOnly("intensity", "position")).toBe(false);
    expect(isListOnly("gap", "position")).toBe(false);
  });

  it("marks the avg-dates groupings that have no grid to fall back on", () => {
    expect(isListOnly("dates", "country")).toBe(true);
    expect(isListOnly("dates", "year")).toBe(true);
    expect(isListOnly("dates", "position")).toBe(false);
    expect(isListOnly("dates", "name")).toBe(false);
  });

  it("marks every calendar filter as list only — a date fills no grid", () => {
    for (const filter of ["started", "ended", "active", "todate"]) {
      expect(isListOnly("calendar", filter)).toBe(true);
    }
  });

  it("marks all-storms-by-position as grid only", () => {
    expect(isGridOnly("all", "position")).toBe(true);
    expect(isGridOnly("all", "name")).toBe(false);
  });
});

describe("paramsForView / paramsForTab / paramsForFilter", () => {
  it("opens a tabbed view on its first tab with that tab's default filter", () => {
    expect(paramsForView("records")).toEqual({
      view: "records",
      tab: "season",
      filter: "strongest",
      mode: "table",
    });
    expect(paramsForView("stats")).toEqual({
      view: "stats",
      tab: "intensity",
      filter: "position",
      mode: "table",
    });
  });

  it("opens an untabbed view with no tab", () => {
    expect(paramsForView("all")).toEqual({
      view: "all",
      tab: "",
      filter: "position",
      mode: "table",
    });
    expect(paramsForView("calendar")).toEqual({
      view: "calendar",
      tab: "",
      filter: "started",
      mode: "list",
    });
  });

  it("gives each tab its own default filter", () => {
    expect(paramsForTab("records", "category").filter).toBe("md");
    expect(paramsForTab("stats", "dates").filter).toBe("position");
    expect(paramsForTab("stats", "gap").filter).toBe("position");
  });

  it("keeps the tab and overrides the mode when the new filter forbids it", () => {
    const allByName = slugToParams(["all", "name", "list"]);
    expect(paramsForFilter(allByName, "position").mode).toBe("table"); // grid only

    const avgByName = slugToParams(["stats", "intensity", "name"]);
    const byCountry = paramsForFilter(avgByName, "country");
    expect(byCountry).toEqual({ view: "stats", tab: "intensity", filter: "country", mode: "list" });
  });

  it("keeps the requested mode when both are allowed", () => {
    const listed = slugToParams(["stats", "intensity", "position", "list"]);
    expect(paramsForFilter(listed, "name").mode).toBe("list");
    const gridded = slugToParams(["stats", "intensity", "position"]);
    expect(paramsForFilter(gridded, "name").mode).toBe("table");
  });
});

describe("paramsToPath", () => {
  it("leaves the tab segment out of untabbed views", () => {
    expect(paramsToPath({ view: "all", tab: "", mode: "table", filter: "name" })).toBe(
      "/storms/all/name/",
    );
    expect(paramsToPath({ view: "all", tab: "", mode: "list", filter: "name" })).toBe(
      "/storms/all/name/list/",
    );
    expect(paramsToPath({ view: "calendar", tab: "", mode: "list", filter: "ended" })).toBe(
      "/storms/calendar/ended/list/",
    );
  });

  it("puts the tab between the view and the filter", () => {
    expect(paramsToPath({ view: "stats", tab: "intensity", mode: "table", filter: "year" })).toBe(
      "/storms/stats/intensity/year/",
    );
    expect(paramsToPath({ view: "records", tab: "category", mode: "list", filter: "cat5" })).toBe(
      "/storms/records/category/cat5/list/",
    );
  });

  it("round-trips through slugToParams", () => {
    for (const slug of getCanonicalStormsSlugs()) {
      expect(paramsToPath(slugToParams(slug))).toBe(slugToPath(slug));
    }
  });
});

describe("slugToPath", () => {
  it("joins the segments into a trailing-slash path", () => {
    expect(slugToPath(["all", "name"])).toBe("/storms/all/name/");
    expect(slugToPath(["stats", "gap", "name", "list"])).toBe("/storms/stats/gap/name/list/");
  });
});

describe("getCanonicalStormsSlugs", () => {
  const canonical = getCanonicalStormsSlugs();
  const count = (view: string, tab?: string) =>
    canonical.filter(([v, t]) => v === view && (tab === undefined || t === tab)).length;

  it("only returns slugs the route accepts", () => {
    for (const slug of canonical) {
      expect(isValidStormsSlug(slug)).toBe(true);
    }
  });

  it("gives the sitemap no duplicate URLs", () => {
    const paths = canonical.map((slug) => slugToPath(slug));
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("never emits bare views, bare tabs or the empty slug", () => {
    expect(canonical).not.toContainEqual([]);
    expect(canonical).not.toContainEqual(["all"]);
    expect(canonical).not.toContainEqual(["stats", "gap"]);
  });

  it("gives each calendar filter one page, at its list path", () => {
    expect(canonical).toContainEqual(["calendar", "started", "list"]);
    expect(canonical).not.toContainEqual(["calendar", "started"]);
    expect(count("calendar")).toBe(4);
  });

  it("gives every category both a grid and a list page", () => {
    expect(canonical).toContainEqual(["records", "category", "md"]);
    expect(canonical).toContainEqual(["records", "category", "cat5", "list"]);
    expect(count("records", "category")).toBe(18);
  });

  it("covers every stats tab", () => {
    // intensity: position/name both modes + country/year/month list only = 7
    expect(count("stats", "intensity")).toBe(7);
    // dates: position/name both modes + country/year list only = 6
    expect(count("stats", "dates")).toBe(6);
    // gap: position/name both modes = 4
    expect(count("stats", "gap")).toBe(4);
    expect(count("records", "season")).toBe(6);
  });
});

describe("getLegendKind", () => {
  const kind = (slug: string[]) => getLegendKind(slugToParams(slug));

  it("shows no legend where the storms grids render one flat color", () => {
    expect(kind(["all", "position"])).toBeNull();
    expect(kind(["all", "name"])).toBeNull();
  });

  it("shows the intensity scale only where color tracks intensity", () => {
    expect(kind(["all", "name", "list"])).toBe("intensity");
    expect(kind(["records", "season", "strongest", "list"])).toBe("intensity");
    expect(kind(["stats", "intensity", "position"])).toBe("intensity");
    expect(kind(["stats", "intensity", "year", "list"])).toBe("intensity");
    expect(kind(["records", "category", "md"])).toBe("intensity");
    expect(kind(["records", "category", "cat5", "list"])).toBe("intensity");
  });

  it("gives the categorical season-record tints their own mini-key", () => {
    expect(kind(["records", "season", "strongest"])).toBe("highlight");
    expect(kind(["records", "season", "last"])).toBe("highlight");
  });

  it("keys the calendar storm lists on intensity, but not its bare counts", () => {
    expect(kind(["calendar", "started", "list"])).toBe("intensity");
    expect(kind(["calendar", "active", "list"])).toBe("intensity");
    expect(kind(["calendar", "todate", "list"])).toBeNull();
  });

  it("keeps the gap and month legends on their own tabs", () => {
    expect(kind(["stats", "gap", "position"])).toBe("recurrence");
    expect(kind(["stats", "gap", "name", "list"])).toBe("recurrence");
    expect(kind(["stats", "dates", "position"])).toBe("avgdate");
    expect(kind(["stats", "dates", "name", "list"])).toBe("avgdate");
  });

  it("falls back to no legend for an unknown view", () => {
    expect(
      getLegendKind({ view: "nonsense", tab: "", filter: "position", mode: "table" }),
    ).toBeNull();
  });
});
