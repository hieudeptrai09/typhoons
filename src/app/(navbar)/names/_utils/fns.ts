import { normalizeParam } from "@/lib/utils/fns";

export interface NamesSlugParams {
  view: string;
  showName: boolean;
  showHistory: boolean;
}

const TOP_LEVEL_SLUGS = ["list", "retired", "history", "current"];
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

  if (first === "list") return { view: "list", showName: false, showHistory: false };
  if (first === "retired") return { view: "retired", showName: false, showHistory: false };

  if (first === "history") {
    if (second === "list") return { view: "list", showName: false, showHistory: true };
    return { view: "grid", showName: second !== "tag", showHistory: true };
  }
  if (first === "current") {
    if (second === "list") return { view: "list", showName: false, showHistory: false };
    return { view: "grid", showName: second !== "tag", showHistory: false };
  }

  return { view: "grid", showName: true, showHistory: false };
};

export const paramsToPath = (view: string, showHistory = false, showName = false): string => {
  if (view === "list") return showHistory ? "/names/history/list/" : "/names/list/";
  if (view === "retired") return "/names/retired/";

  const base = showHistory ? "/names/history" : "/names/current";
  if (!showName) return `${base}/tag/`;
  return `${base}/`;
};

export const canonicalPath = (view: string, showHistory: boolean, showName: boolean): string => {
  const path = paramsToPath(view, showHistory, showName);
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
  ALL_SLUGS.filter((slug) => {
    const { view, showName, showHistory } = slugToParams(slug);
    return canonicalPath(view, showHistory, showName) === slugToPath(slug);
  });

export const getNamesTitle = (
  view: string | string[] | undefined,
  showHistory?: string | string[] | undefined,
): string => {
  const viewStr = normalizeParam(view) || "grid";

  if (viewStr === "retired") return "Retired Typhoon Names";
  if (normalizeParam(showHistory) === "true") return "Typhoon Name History";
  return "Current Typhoon Names";
};

export const getNamesDescription = (
  view: string | string[] | undefined,
  showName?: string | string[] | undefined,
  showHistory?: string | string[] | undefined,
): string => {
  const viewStr = normalizeParam(view) || "grid";

  if (viewStr === "retired") {
    return "Browse retired typhoon names that have been permanently removed from the Western Pacific naming rotation due to the severity of their associated storms.";
  }
  if (viewStr === "list") {
    return "View all typhoon names in list format with detailed information including country of origin, language, and naming history.";
  }

  const nameOn = normalizeParam(showName) === "true";
  const historyOn = normalizeParam(showHistory) === "true";

  if (historyOn) {
    return nameOn
      ? "Explore all typhoon names organized by position with name labels and full naming history visible in the grid."
      : "Explore all typhoon names organized by position with naming history visible in the grid.";
  }
  return nameOn
    ? "Explore all typhoon names organized by position with name labels visible in the grid."
    : "Explore all typhoon names organized by position in the Western Pacific naming sequence. View name origins, countries, and storm history.";
};
