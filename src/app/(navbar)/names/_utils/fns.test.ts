import {
  canonicalPath,
  getCanonicalNamesSlugs,
  getNamesDescription,
  getNamesTitle,
  isHistoryScope,
  isValidNamesSlug,
  paramsToPath,
  slugToParams,
  slugToPath,
  type NamesSlugParams,
} from "@/app/(navbar)/names/_utils/fns";

// The eight slugs the route serves, with the params each one resolves to.
const SERVED_SLUGS: [string, string[], NamesSlugParams][] = [
  ["/names/", [], { view: "grid", showName: true, showHistory: false }],
  ["/names/retired/", ["retired"], { view: "retired" }],
  ["/names/current/", ["current"], { view: "grid", showName: true, showHistory: false }],
  [
    "/names/current/tag/",
    ["current", "tag"],
    { view: "grid", showName: false, showHistory: false },
  ],
  ["/names/current/list/", ["current", "list"], { view: "list", showHistory: false }],
  ["/names/history/", ["history"], { view: "grid", showName: true, showHistory: true }],
  ["/names/history/tag/", ["history", "tag"], { view: "grid", showName: false, showHistory: true }],
  ["/names/history/list/", ["history", "list"], { view: "list", showHistory: true }],
];

describe("isValidNamesSlug", () => {
  it.each(SERVED_SLUGS)("accepts %s", (_path, slug) => {
    expect(isValidNamesSlug(slug)).toBe(true);
  });

  it.each([
    [["bogus"]],
    [["list"]],
    [["tag"]],
    [["retired", "list"]],
    [["history", "bogus"]],
    [["history", "tag", "extra"]],
  ])("rejects %j", (slug) => {
    expect(isValidNamesSlug(slug)).toBe(false);
  });

  it("accepts the missing slug an optional catch-all route passes", () => {
    expect(isValidNamesSlug()).toBe(true);
  });
});

describe("slugToParams", () => {
  it.each(SERVED_SLUGS)("maps %s", (_path, slug, params) => {
    expect(slugToParams(slug)).toEqual(params);
  });

  it("falls back to the default grid for an unrecognised slug", () => {
    expect(slugToParams(["bogus"])).toEqual({ view: "grid", showName: true, showHistory: false });
  });

  it("treats the missing slug of an optional catch-all route as the default grid", () => {
    expect(slugToParams()).toEqual({ view: "grid", showName: true, showHistory: false });
  });
});

describe("isHistoryScope", () => {
  it("reads the flag off the views that carry one", () => {
    expect(isHistoryScope({ view: "grid", showName: true, showHistory: true })).toBe(true);
    expect(isHistoryScope({ view: "list", showHistory: true })).toBe(true);
    expect(isHistoryScope({ view: "grid", showName: true, showHistory: false })).toBe(false);
    expect(isHistoryScope({ view: "list", showHistory: false })).toBe(false);
  });

  it("puts retired outside the history scope", () => {
    expect(isHistoryScope({ view: "retired" })).toBe(false);
  });
});

describe("paramsToPath", () => {
  it("routes the list view under the scope history selects", () => {
    expect(paramsToPath({ view: "list", showHistory: false })).toBe("/names/current/list/");
    expect(paramsToPath({ view: "list", showHistory: true })).toBe("/names/history/list/");
  });

  it("routes the retired view, which carries no other flags", () => {
    expect(paramsToPath({ view: "retired" })).toBe("/names/retired/");
  });

  it("appends tag/ to the grid views when names are hidden", () => {
    expect(paramsToPath({ view: "grid", showName: true, showHistory: false })).toBe(
      "/names/current/",
    );
    expect(paramsToPath({ view: "grid", showName: false, showHistory: false })).toBe(
      "/names/current/tag/",
    );
    expect(paramsToPath({ view: "grid", showName: true, showHistory: true })).toBe(
      "/names/history/",
    );
    expect(paramsToPath({ view: "grid", showName: false, showHistory: true })).toBe(
      "/names/history/tag/",
    );
  });
});

describe("canonicalPath", () => {
  it("shortens the default current grid to /names/", () => {
    const params: NamesSlugParams = { view: "grid", showName: true, showHistory: false };
    expect(paramsToPath(params)).toBe("/names/current/");
    expect(canonicalPath(params)).toBe("/names/");
  });

  it("leaves every other path as-is", () => {
    expect(canonicalPath({ view: "retired" })).toBe("/names/retired/");
    expect(canonicalPath({ view: "grid", showName: true, showHistory: true })).toBe(
      "/names/history/",
    );
    expect(canonicalPath({ view: "grid", showName: false, showHistory: false })).toBe(
      "/names/current/tag/",
    );
  });
});

describe("slugToPath", () => {
  it("collapses the doubled slash left by an empty slug", () => {
    expect(slugToPath([])).toBe("/names/");
    expect(slugToPath(["history", "tag"])).toBe("/names/history/tag/");
  });

  it("maps the missing slug of an optional catch-all route to the base path", () => {
    expect(slugToPath()).toBe("/names/");
  });
});

describe("getCanonicalNamesSlugs", () => {
  const canonical = getCanonicalNamesSlugs();

  it("only returns slugs the route accepts", () => {
    for (const slug of canonical) {
      expect(isValidNamesSlug(slug)).toBe(true);
    }
  });

  it("returns slugs that already sit at their own canonical path", () => {
    for (const slug of canonical) {
      expect(canonicalPath(slugToParams(slug))).toBe(slugToPath(slug));
    }
  });

  it("gives the sitemap no duplicate URLs", () => {
    const paths = canonical.map((slug) => slugToPath(slug));
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("drops the slugs that resolve to another URL", () => {
    // /names/current/ is the one served path that shortens to another URL, so /names/ stands in.
    expect(canonical).not.toContainEqual(["current"]);
    expect(canonical).toContainEqual(["current", "list"]);
    expect(canonical).toContainEqual([]);
    expect(canonical).toContainEqual(["retired"]);
  });

  it("lists every served slug except the one /names/ already covers", () => {
    expect(canonical.map((slug) => slugToPath(slug)).sort()).toEqual([
      "/names/",
      "/names/current/list/",
      "/names/current/tag/",
      "/names/history/",
      "/names/history/list/",
      "/names/history/tag/",
      "/names/retired/",
    ]);
  });

  it("gives current and history the same children", () => {
    const childrenOf = (scope: string) =>
      canonical.filter((slug) => slug[0] === scope && slug.length === 2).map((slug) => slug[1]);

    expect(childrenOf("current").sort()).toEqual(childrenOf("history").sort());
    expect(childrenOf("current").sort()).toEqual(["list", "tag"]);
  });
});

describe("getNamesTitle", () => {
  it("titles by view, with history taking precedence over the default", () => {
    expect(getNamesTitle({ view: "retired" })).toBe("Retired Typhoon Names");
    expect(getNamesTitle({ view: "grid", showName: true, showHistory: true })).toBe(
      "Typhoon Name History",
    );
    expect(getNamesTitle({ view: "grid", showName: true, showHistory: false })).toBe(
      "Current Typhoon Names",
    );
    expect(getNamesTitle({ view: "list", showHistory: false })).toBe("Current Typhoon Names");
  });

  it("gives every served slug a title", () => {
    for (const [, slug] of SERVED_SLUGS) {
      expect(getNamesTitle(slugToParams(slug)).length).toBeGreaterThan(0);
    }
  });
});

describe("getNamesDescription", () => {
  it("describes each view distinctly", () => {
    const retired = getNamesDescription({ view: "retired" });
    const list = getNamesDescription({ view: "list", showHistory: false });
    const grid = getNamesDescription({ view: "grid", showName: true, showHistory: false });
    expect(new Set([retired, list, grid]).size).toBe(3);
  });

  it("varies the grid description by the name and history toggles", () => {
    const variants = [
      getNamesDescription({ view: "grid", showName: true, showHistory: true }),
      getNamesDescription({ view: "grid", showName: false, showHistory: true }),
      getNamesDescription({ view: "grid", showName: true, showHistory: false }),
      getNamesDescription({ view: "grid", showName: false, showHistory: false }),
    ];
    expect(new Set(variants).size).toBe(4);
  });

  it("has a description for every canonical slug", () => {
    for (const slug of getCanonicalNamesSlugs()) {
      expect(getNamesDescription(slugToParams(slug)).length).toBeGreaterThan(0);
    }
  });
});
