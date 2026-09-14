import type { DashboardParams } from "@/lib/types";
import { INTENSITY_SLUGS_BY_STRENGTH } from "@/lib/utils/intensity";

// Records and Stats each gather related pages under tabs; Storms and Calendar have none.
export const VIEW_TABS: Record<string, string[]> = {
  all: [],
  records: ["season", "category"],
  stats: ["intensity", "dates", "gap"],
  calendar: [],
};

// A panel is one page of the dashboard: its tab where the view has tabs, else the view.
// Tab and view names never collide, so one key picks filters, legends, titles and content.
export const getPanel = ({ view, tab }: Pick<DashboardParams, "view" | "tab">): string =>
  tab || view;

const VALID_FILTERS: Record<string, string[]> = {
  all: ["position", "name"],
  season: ["strongest", "first", "last"],
  category: INTENSITY_SLUGS_BY_STRENGTH,
  intensity: ["position", "name", "country", "year", "month"],
  dates: ["position", "name", "country", "year"],
  gap: ["position", "name"],
  calendar: ["started", "ended", "active", "todate"],
};

// Filters with no grid of their own: they only ever render as a list.
const LIST_ONLY_FILTERS: Record<string, string[]> = {
  intensity: ["country", "month", "year"],
  dates: ["country", "year"],
  calendar: ["started", "ended", "active", "todate"],
};

export const DEFAULT_FILTER: Record<string, string> = {
  all: "position",
  season: "strongest",
  category: "md",
  intensity: "position",
  dates: "position",
  gap: "position",
  calendar: "started",
};

interface ParsedSlug {
  view: string;
  tab: string;
  rest: string[];
}

// Every URL is /storms/<view>/[<tab>/]<filter>/[list/]; the tab segment exists only for tabbed views.
const parseSlug = (slug: string[]): ParsedSlug | null => {
  const [view, ...afterView] = slug;
  const tabs = VIEW_TABS[view];
  if (!tabs) return null;
  if (tabs.length === 0) return { view, tab: "", rest: afterView };

  const [tab, ...rest] = afterView;
  return tabs.includes(tab) ? { view, tab, rest } : null;
};

export const isValidStormsSlug = (slug: string[]): boolean => {
  const parsed = parseSlug(slug);
  if (!parsed) return false;

  const [filter, list, ...extra] = parsed.rest;
  const validFilters = VALID_FILTERS[getPanel(parsed)] ?? [];
  if (!validFilters.includes(filter) || extra.length > 0) return false;
  return list === undefined || list === "list";
};

export const isListOnly = (panel: string, filter: string): boolean =>
  LIST_ONLY_FILTERS[panel]?.includes(filter) ?? false;

export const isGridOnly = (panel: string, filter: string): boolean =>
  panel === "all" && filter === "position";

const legalMode = (panel: string, filter: string, requested: string): string => {
  if (isGridOnly(panel, filter)) return "table";
  if (isListOnly(panel, filter)) return "list";
  return requested;
};

export const paramsForTab = (view: string, tab: string): DashboardParams => {
  const panel = getPanel({ view, tab });
  const filter = DEFAULT_FILTER[panel] ?? "";
  return { view, tab, filter, mode: legalMode(panel, filter, "table") };
};

// A view opens on its first tab.
export const paramsForView = (view: string): DashboardParams =>
  paramsForTab(view, VIEW_TABS[view]?.[0] ?? "");

export const paramsForFilter = (params: DashboardParams, filter: string): DashboardParams => ({
  ...params,
  filter,
  mode: legalMode(getPanel(params), filter, params.mode),
});

export const slugToParams = (slug: string[]): DashboardParams => {
  const parsed = parseSlug(slug) ?? { view: slug[0] ?? "", tab: "", rest: slug.slice(1) };
  const [filter = "", third] = parsed.rest;
  const mode = legalMode(getPanel(parsed), filter, third === "list" ? "list" : "table");

  return { view: parsed.view, tab: parsed.tab, mode, filter };
};

export const paramsToPath = ({ view, tab, mode, filter }: DashboardParams): string => {
  const base = `/storms/${view}/${tab ? `${tab}/` : ""}${filter}/`;
  return mode === "list" ? `${base}list/` : base;
};

export const slugToPath = (slug: string[]): string => `/storms/${slug.join("/")}/`;

const ALL_SLUGS: string[][] = Object.entries(VIEW_TABS).flatMap(([view, tabs]) =>
  (tabs.length > 0 ? tabs : [""]).flatMap((tab) => {
    const prefix = tab ? [view, tab] : [view];
    return (VALID_FILTERS[tab || view] ?? []).flatMap((filter) => [
      [...prefix, filter],
      [...prefix, filter, "list"],
    ]);
  }),
);

// Non-canonical slugs redirect, so prerendering them would only cache the redirect.
export const getCanonicalStormsSlugs = (): string[][] =>
  ALL_SLUGS.filter((slug) => paramsToPath(slugToParams(slug)) === slugToPath(slug));

export type LegendKind = "intensity" | "recurrence" | "avgdate" | "highlight" | null;

// Which legend a page needs is decided by the same params that pick the page itself.
export const getLegendKind = (params: DashboardParams): LegendKind => {
  const { mode, filter } = params;
  switch (getPanel(params)) {
    case "gap":
      return "recurrence";
    case "dates":
      return "avgdate";
    case "calendar":
      return filter === "todate" ? null : "intensity";
    case "season":
      return mode === "list" ? "intensity" : "highlight";
    case "category":
    case "intensity":
      return "intensity";
    case "all":
      return mode === "list" && filter === "name" ? "intensity" : null;
    default:
      return null;
  }
};
