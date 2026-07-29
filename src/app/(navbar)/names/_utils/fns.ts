export type NamesSlugParams =
  | { view: "retired" }
  | { view: "list"; showHistory: boolean }
  | { view: "grid"; showName: boolean; showHistory: boolean };

const TOP_LEVEL_SLUGS = ["retired", "history", "current"];
const NESTED_PARENTS = ["history", "current"];
const NESTED_CHILDREN = ["tag", "list"];

export const isValidNamesSlug = (slug: string[] = []): boolean => {
  if (slug.length === 0) return true;
  if (slug.length === 1) return TOP_LEVEL_SLUGS.includes(slug[0]);
  if (slug.length === 2) {
    return NESTED_PARENTS.includes(slug[0]) && NESTED_CHILDREN.includes(slug[1]);
  }
  return false;
};

export const slugToParams = (slug: string[] = []): NamesSlugParams => {
  const [first, second] = slug;

  if (first === "retired") return { view: "retired" };

  if (first === "history" || first === "current") {
    const showHistory = first === "history";
    if (second === "list") return { view: "list", showHistory };
    return { view: "grid", showName: second !== "tag", showHistory };
  }

  return { view: "grid", showName: true, showHistory: false };
};

// Retired has no scope of its own, so the tabs treat it as neither current nor history.
export const isHistoryScope = (params: NamesSlugParams): boolean =>
  params.view !== "retired" && params.showHistory;

export const paramsToPath = (params: NamesSlugParams): string => {
  if (params.view === "retired") return "/names/retired/";

  const base = params.showHistory ? "/names/history" : "/names/current";
  if (params.view === "list") return `${base}/list/`;
  if (!params.showName) return `${base}/tag/`;
  return `${base}/`;
};

export const canonicalPath = (params: NamesSlugParams): string => {
  const path = paramsToPath(params);
  if (path === "/names/current/") return "/names/";
  return path;
};

export const slugToPath = (slug: string[] = []): string =>
  `/names/${slug.join("/")}/`.replace(/\/+/g, "/");

const ALL_SLUGS: string[][] = [
  [],
  ...TOP_LEVEL_SLUGS.map((slug) => [slug]),
  ...NESTED_PARENTS.flatMap((parent) => NESTED_CHILDREN.map((child) => [parent, child])),
];

// Non-canonical slugs resolve to a different canonical URL, so only these belong in the sitemap.
export const getCanonicalNamesSlugs = (): string[][] =>
  ALL_SLUGS.filter((slug) => canonicalPath(slugToParams(slug)) === slugToPath(slug));

export const getNamesTitle = (params: NamesSlugParams): string => {
  if (params.view === "retired") return "Retired Typhoon Names";
  if (params.showHistory) return "Typhoon Name History";
  return "Current Typhoon Names";
};

export const getNamesDescription = (params: NamesSlugParams): string => {
  if (params.view === "retired") {
    return "Browse retired typhoon names that have been permanently removed from the Western Pacific naming rotation due to the severity of their associated storms.";
  }
  if (params.view === "list") {
    return "View all typhoon names in list format with detailed information including country of origin, language, and naming history.";
  }

  if (params.showHistory) {
    return params.showName
      ? "Explore all typhoon names organized by position with name labels and full naming history visible in the grid."
      : "Explore all typhoon names organized by position with naming history visible in the grid.";
  }
  return params.showName
    ? "Explore all typhoon names organized by position with name labels visible in the grid."
    : "Explore all typhoon names organized by position in the Western Pacific naming sequence. View name origins, countries, and storm history.";
};
