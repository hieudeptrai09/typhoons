import { INTENSITY_RANK } from "@/lib/constants";
import type { DashboardParams, IntensityType, Storm } from "@/lib/types";
import { capitalize, normalizeParam } from "@/lib/utils/fns";

const VALID_FILTERS: Record<string, string[]> = {
  storms: ["position", "name"],
  highlights: ["strongest", "first", "last"],
  average: ["position", "name", "country", "year", "month"],
  distance: ["position", "name"],
};

const DEFAULT_FILTER: Record<string, string> = {
  storms: "position",
  highlights: "strongest",
  average: "position",
  distance: "position",
};

export const isValidStormsSlug = (slug: string[] = []): boolean => {
  if (slug.length === 0) return true;

  const [first, second, third] = slug;

  if (slug.length === 1) {
    return ["list", "names", "positions", "storms", "highlights", "average", "distance"].includes(
      first,
    );
  }
  if (slug.length === 2) {
    const validFilters = VALID_FILTERS[first];
    if (!validFilters) return false;
    return validFilters.includes(second);
  }
  if (slug.length === 3) {
    const validFilters = VALID_FILTERS[first];
    if (!validFilters || !validFilters.includes(second)) return false;
    return third === "list";
  }
  return false;
};

export const isListOnly = (view: string, filter: string): boolean =>
  (view === "average" && filter === "country") ||
  (view === "average" && filter === "month") ||
  (view === "distance" && filter === "name");

export const slugToParams = (slug: string[] = []): DashboardParams => {
  if (slug.length === 0) return { view: "storms", mode: "table", filter: "name" };

  const [first, second, third] = slug;

  if (first === "list") return { view: "storms", mode: "list", filter: "name" };
  if (first === "names") return { view: "storms", mode: "table", filter: "name" };
  if (first === "positions") return { view: "storms", mode: "table", filter: "position" };
  const view = first;
  const filter = second || DEFAULT_FILTER[view] || "position";
  const mode = third === "list" || isListOnly(view, filter) ? "list" : "table";

  return { view, mode, filter };
};

export const paramsToPath = (params: DashboardParams): string => {
  const { view, mode, filter } = params;

  if (view === "storms" && filter === "position") return "/storms/positions/";
  if (view === "storms" && filter === "name" && mode === "table") return "/storms/";
  if (view === "storms" && filter === "name" && mode === "list") return "/storms/list/";
  const base = `/storms/${view}/${filter}/`;
  if (mode === "list") return `${base}list/`;
  return base;
};

export const getIntensityFromNumber = (avgNumber: number): IntensityType => {
  const rounded = Math.round(avgNumber);
  if (rounded >= 5) return "5";
  if (rounded === 4) return "4";
  if (rounded === 3) return "3";
  if (rounded === 2) return "2";
  if (rounded === 1) return "1";
  if (rounded === 0) return "TS";
  if (rounded <= -1) return "TD";
  return "TD";
};

export const getHighlights = (stormsData: Storm[], type: string): Storm[] => {
  if (type === "strongest") {
    return stormsData.filter((storm) => Boolean(storm.isStrongest));
  } else if (type === "first") {
    return stormsData.filter((storm) => Boolean(storm.isFirst));
  } else if (type === "last") {
    return stormsData.filter((storm) => Boolean(storm.isLast));
  }
  return [];
};

export const getGroupedStorms = (stormsData: Storm[], groupBy: string): Record<string, Storm[]> => {
  const grouped: Record<string, Storm[]> = {};
  stormsData.forEach((storm) => {
    const key = storm[groupBy as keyof Storm]?.toString() || "";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(storm);
  });
  return grouped;
};

export const calculateAverage = (storms: Storm[]): number => {
  const sum = storms.reduce((acc, s) => acc + INTENSITY_RANK[s.intensity], 0);
  return sum / storms.length;
};

export const calculateDistances = (
  stormsData: Storm[],
  groupBy: "position" | "name",
): Record<string, number> => {
  const grouped = getGroupedStorms(stormsData, groupBy);
  const result: Record<string, number> = {};

  Object.entries(grouped).forEach(([key, groupStorms]) => {
    const years = groupStorms.map((s) => s.year).sort((a, b) => a - b);
    if (years.length <= 1) {
      result[key] = 0;
      return;
    }
    const gaps: number[] = [];
    for (let i = 1; i < years.length; i++) {
      gaps.push(years[i] - years[i - 1]);
    }
    result[key] = gaps.reduce((a, b) => a + b, 0) / gaps.length;
  });

  return result;
};

export const formatDistance = (dist: number): string => (dist === 0 ? "N/A" : dist.toFixed(2));

export const sortNamesByFirstYear = (entries: [string, Storm[]][]): [string, Storm[]][] =>
  [...entries].sort(
    ([, aStorms], [, bStorms]) =>
      Math.min(...aStorms.map((s) => s.year)) - Math.min(...bStorms.map((s) => s.year)),
  );

export const SPECIAL_POSITIONS = [
  { id: 141, label: "CPHC" },
  { id: 142, label: "NHC" },
  { id: 143, label: "IMD" },
] as const;

export const getEffectiveMonth = (storm: Storm): number | null => {
  if (!storm.monthStart || storm.year < 2000) return null;
  return storm.isFromPrevYear ? 1 : storm.monthStart;
};

export const getDashboardTitle = (
  view: string | string[] | undefined,
  mode: string | string[] | undefined,
  filter: string | string[] | undefined,
): string => {
  const viewStr = normalizeParam(view) || "storms";
  const modeStr = normalizeParam(mode) || "table";
  const filterStr = normalizeParam(filter);

  const viewTitles: Record<string, string> = {
    storms:
      modeStr === "list"
        ? "All Typhoon Names"
        : filterStr === "name"
          ? "All Typhoon Names (Grid)"
          : "All Storms",
    highlights: `${capitalize(filterStr)} Typhoons by Position`,
    average: `Average Intensity by ${capitalize(filterStr)}`,
    distance: `Average Gap Between Storms by ${capitalize(filterStr)}`,
  };

  const title = viewTitles[viewStr];
  return modeStr === "list" && viewStr !== "storms" ? `${title} (List View)` : title;
};

export const getDashboardDescription = (
  view: string | string[] | undefined,
  mode: string | string[] | undefined,
  filter: string | string[] | undefined,
): string => {
  const viewStr = normalizeParam(view) || "storms";
  const modeStr = normalizeParam(mode) || "table";
  const filterStr = normalizeParam(filter);

  if (viewStr === "storms") {
    if (modeStr === "list") {
      return "Browse all typhoon names used in the Western Pacific basin. Click any name to see detailed storm history, including years, intensities, and track maps.";
    }
    return "View comprehensive typhoon storm data organized by position in the naming list. Track all typhoons that have occurred in the Western Pacific basin.";
  }

  if (viewStr === "highlights") {
    const highlightDescriptions: Record<string, string> = {
      strongest:
        "Explore the strongest typhoons by position - discover which names have been associated with the most powerful storms in history.",
      first:
        "View the first typhoons of each season by position - track the earliest storms to receive each name in the typhoon naming sequence.",
      last: "Browse the last typhoons of each season by position - see which storms closed out their respective seasons for each name position.",
    };
    return (
      highlightDescriptions[filterStr] ||
      "Discover highlighted typhoons with special characteristics organized by their position in the naming sequence."
    );
  }

  if (viewStr === "average") {
    const averageDescriptions: Record<string, string> = {
      position:
        "Analyze average typhoon intensity by position in the naming list. Compare which positions tend to produce stronger or weaker storms.",
      name: "Compare average intensity across different typhoon names. Discover which names have historically been associated with stronger storms.",
      country:
        "View average typhoon intensity statistics by contributing country. See how different countries' name contributions perform.",
      year: "Track average typhoon intensity trends by year. Analyze how storm strength has evolved over time in the Western Pacific.",
      month:
        "Explore typhoon activity patterns throughout the year. See how many storms form each month and compare their average intensities across the season.",
    };
    return (
      averageDescriptions[filterStr] ||
      "Statistical analysis of typhoon intensity data with comprehensive averaging and comparison tools."
    );
  }

  if (viewStr === "distance") {
    const distanceDescriptions: Record<string, string> = {
      position:
        "View the average number of years between consecutive storms at each naming position. Identify which slots see more or less frequent activity.",
      name: "Explore the average year-gap between storms sharing the same typhoon name. See how often each name is recycled in the naming cycle.",
    };
    return (
      distanceDescriptions[filterStr] ||
      "Analyze the temporal spacing between storms grouped by position or name."
    );
  }

  return "Comprehensive typhoon storm database with advanced filtering, analysis, and visualization tools for Western Pacific typhoons.";
};
