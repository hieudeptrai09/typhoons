import { INTENSITY_RANK } from "@/lib/constants";
import type { DashboardParams, IntensityType, Storm } from "@/lib/types";
import { capitalize, daysBetween, normalizeParam, parseDateParts } from "@/lib/utils/fns";

const VALID_FILTERS: Record<string, string[]> = {
  all: ["position", "name"],
  highlights: ["strongest", "first", "last", "untracked"],
  average: ["position", "name", "country", "year", "month"],
  distance: ["position", "name"],
  avgdate: ["position", "name"],
};

export const DEFAULT_FILTER: Record<string, string> = {
  all: "position",
  highlights: "strongest",
  average: "position",
  distance: "position",
  avgdate: "position",
};

// Every URL is /storms/<view>/<filter>/[list]/
export const isValidStormsSlug = (slug: string[]): boolean => {
  const [first, second, third] = slug;

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
  (view === "average" && filter === "country") || (view === "average" && filter === "month");

export const isGridOnly = (view: string, filter: string): boolean =>
  view === "all" && filter === "position";

export const paramsForView = (view: string): DashboardParams => {
  const filter = DEFAULT_FILTER[view] ?? "";
  return { view, filter, mode: isListOnly(view, filter) ? "list" : "table" };
};

export const paramsForFilter = (view: string, filter: string, mode: string): DashboardParams => {
  if (isGridOnly(view, filter)) return { view, filter, mode: "table" };
  if (isListOnly(view, filter)) return { view, filter, mode: "list" };
  return { view, filter, mode };
};

export const slugToParams = (slug: string[]): DashboardParams => {
  const [view, filter, third] = slug;

  let mode = third === "list" ? "list" : "table";
  if (isGridOnly(view, filter)) mode = "table";
  if (isListOnly(view, filter)) mode = "list";

  return { view, mode, filter };
};

export const paramsToPath = (params: DashboardParams): string => {
  const { view, mode, filter } = params;

  const base = `/storms/${view}/${filter}/`;
  return mode === "list" ? `${base}list/` : base;
};

export const slugToPath = (slug: string[]): string => `/storms/${slug.join("/")}/`;

const ALL_SLUGS: string[][] = [
  ...Object.entries(VALID_FILTERS).flatMap(([view, filters]) =>
    filters.flatMap((filter) => [
      [view, filter],
      [view, filter, "list"],
    ]),
  ),
];

// Non-canonical slugs redirect, so prerendering them would only cache the redirect.
export const getCanonicalStormsSlugs = (): string[][] =>
  ALL_SLUGS.filter((slug) => paramsToPath(slugToParams(slug)) === slugToPath(slug));

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
    return stormsData.filter((storm) => storm.isStrongest);
  } else if (type === "first") {
    return stormsData.filter((storm) => storm.isFirst);
  } else if (type === "last") {
    return stormsData.filter((storm) => storm.isLast);
  } else if (type === "untracked") {
    return stormsData.filter((storm) => storm.isJtwcForecasted === false);
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

export const calculateGapAverage = (storms: Storm[]): number => {
  const years = storms.map((s) => s.year).sort((a, b) => a - b);
  if (years.length <= 1) return -1;

  const gaps: number[] = [];
  for (let i = 1; i < years.length; i++) {
    gaps.push(years[i] - years[i - 1]);
  }
  return gaps.reduce((a, b) => a + b, 0) / gaps.length;
};

export const calculateDistances = (
  stormsData: Storm[],
  groupBy: "position" | "name",
): Record<string, number> => {
  const grouped = getGroupedStorms(stormsData, groupBy);
  const result: Record<string, number> = {};

  Object.entries(grouped).forEach(([key, groupStorms]) => {
    result[key] = calculateGapAverage(groupStorms);
  });

  return result;
};

export const formatDistance = (dist: number): string => (dist < 0 ? "N/A" : dist.toFixed(2));

// --- Average date helpers ---
// Dates are averaged as a day-of-year in a fixed non-leap reference year, so a
// 29/2 date collapses to 28/2 and the output can never land on 29/2 either.
const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const MONTH_OFFSET = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
const DAYS_IN_YEAR = 365;

const toDayOfYear = (month?: number, date?: number): number | null => {
  if (!month || !date || month < 1 || month > 12) return null;
  const clampedDate = Math.min(date, DAYS_IN_MONTH[month - 1]); // 29/2 → 28/2
  return MONTH_OFFSET[month - 1] + clampedDate;
};

const stormStartDoy = (s: Storm): number | null => {
  const start = parseDateParts(s.dateStart);
  return start ? toDayOfYear(start.month, start.day) : null;
};

// A storm that crossed into the new year has its January end treated as "month
// 13": one full year later. This keeps a Dec→Jan storm's end after its start
// when averaging and measuring span.
const stormEndDoy = (s: Storm): number | null => {
  const end = parseDateParts(s.dateEnd);
  if (!end) return null;
  const doy = toDayOfYear(end.month, end.day);
  if (doy === null) return null;
  const start = parseDateParts(s.dateStart);
  const spansNewYear = start !== null && end.year > start.year;
  return spansNewYear ? doy + DAYS_IN_YEAR : doy;
};

// Wrap an averaged day-of-year (which may land past day 365 for new-year-spanning
// groups) back onto a real calendar date, so the output is never below 1/1.
const fromDayOfYear = (doy: number): { month: number; date: number } => {
  const wrapped = ((((Math.round(doy) - 1) % DAYS_IN_YEAR) + DAYS_IN_YEAR) % DAYS_IN_YEAR) + 1;
  for (let m = 0; m < 12; m++) {
    if (wrapped <= MONTH_OFFSET[m] + DAYS_IN_MONTH[m]) {
      return { month: m + 1, date: wrapped - MONTH_OFFSET[m] };
    }
  }
  return { month: 12, date: wrapped - MONTH_OFFSET[11] };
};

export interface AvgDates {
  startDoy: number; // -1 when no storm has a start date
  endDoy: number; // -1 when no storm has an end date
}

const average = (values: number[]): number =>
  values.length ? values.reduce((a, b) => a + b, 0) / values.length : -1;

export const calculateAvgDates = (storms: Storm[]): AvgDates => {
  const starts = storms.map(stormStartDoy).filter((v): v is number => v !== null);
  const ends = storms.map(stormEndDoy).filter((v): v is number => v !== null);

  return { startDoy: average(starts), endDoy: average(ends) };
};

export const calculateAvgDatesByGroup = (
  stormsData: Storm[],
  groupBy: "position" | "name",
): Record<string, AvgDates> => {
  const grouped = getGroupedStorms(stormsData, groupBy);
  const result: Record<string, AvgDates> = {};
  Object.entries(grouped).forEach(([key, groupStorms]) => {
    result[key] = calculateAvgDates(groupStorms);
  });
  return result;
};

export const formatDayOfYear = (doy: number): string => {
  if (doy < 0) return "N/A";
  const { month, date } = fromDayOfYear(doy);
  return `${date}/${month}`;
};

// Calendar month (1–12) an averaged day-of-year falls in; -1 when there is no date.
export const getDoyMonth = (doy: number): number => (doy < 0 ? -1 : fromDayOfYear(doy).month);

// Average storm duration in whole days.
export const calculateAvgDuration = (storms: Storm[]): number => {
  const durations = storms
    .map((s) => daysBetween(s.dateStart, s.dateEnd))
    .filter((v): v is number => v !== null);
  return average(durations);
};

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
  const start = parseDateParts(storm.dateStart);
  if (!start || storm.year < 2000) return null;
  // A storm carried over from the previous season counts toward January.
  return start.year < storm.year ? 1 : start.month;
};

export const getDashboardTitle = (
  view: string | string[] | undefined,
  mode: string | string[] | undefined,
  filter: string | string[] | undefined,
): string => {
  const viewStr = normalizeParam(view) || "all";
  const filterStr = normalizeParam(filter);

  const viewTitles: Record<string, string> = {
    all: filterStr === "position" ? "All Storms by Position" : "All Storms by Name",
    highlights: `${capitalize(filterStr)} Typhoons by Position`,
    average: `Average Intensity by ${capitalize(filterStr)}`,
    distance: `Average Gap Between Storms by ${capitalize(filterStr)}`,
    avgdate: `Average Storm Dates by ${capitalize(filterStr)}`,
  };

  return viewTitles[viewStr] ?? viewTitles.all;
};

export const getDashboardDescription = (
  view: string | string[] | undefined,
  mode: string | string[] | undefined,
  filter: string | string[] | undefined,
): string => {
  const viewStr = normalizeParam(view) || "all";
  const modeStr = normalizeParam(mode) || "table";
  const filterStr = normalizeParam(filter);

  if (viewStr === "all") {
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
      untracked:
        "Discover typhoons not tracked by the JTWC, organized by position - storms that were named but fell outside the Joint Typhoon Warning Center's official monitoring.",
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

  if (viewStr === "avgdate") {
    const avgDateDescriptions: Record<string, string> = {
      position:
        "See the average start and end dates of storms at each naming position. Discover which slots tend to be active earlier or later in the typhoon season.",
      name: "Explore the average start and end dates of storms sharing the same typhoon name. Compare when each name typically becomes active during the year.",
    };
    return (
      avgDateDescriptions[filterStr] ||
      "Analyze the average seasonal start and end dates of storms grouped by position or name."
    );
  }

  return "Comprehensive typhoon storm database with advanced filtering, analysis, and visualization tools for Western Pacific typhoons.";
};
