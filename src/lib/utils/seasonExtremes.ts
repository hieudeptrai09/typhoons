import type { Storm } from "@/lib/types";

const getSeasonStartRank = (storm: Storm): number | null => {
  if (storm.monthStart == null || storm.dateStart == null) return null;
  const monthDay = storm.monthStart * 100 + storm.dateStart;
  return storm.isFromPrevYear ? monthDay : monthDay + 10000;
};

const MAIN_BASIN_MAX_POSITION = 140;

export const getSeasonExtremes = (stormsData: Storm[], type: "first" | "last"): Storm[] => {
  const maxYear = type === "last" ? new Date().getFullYear() - 1 : Infinity;

  const byYear = new Map<number, { storm: Storm; rank: number }[]>();
  for (const storm of stormsData) {
    if (storm.year < 2000 || storm.year > maxYear) continue;
    const rank = getSeasonStartRank(storm);
    if (rank === null) continue;
    const entries = byYear.get(storm.year);
    if (entries) entries.push({ storm, rank });
    else byYear.set(storm.year, [{ storm, rank }]);
  }

  const pickExtremes = (entries: { storm: Storm; rank: number }[]): Storm[] => {
    const ranks = entries.map((e) => e.rank);
    const target = type === "first" ? Math.min(...ranks) : Math.max(...ranks);
    return entries.filter((e) => e.rank === target).map((e) => e.storm);
  };

  const result: Storm[] = [];
  for (const entries of byYear.values()) {
    const extremes = pickExtremes(entries);
    result.push(...extremes);

    if (extremes.some((s) => s.position > MAIN_BASIN_MAX_POSITION)) {
      const mainEntries = entries.filter((e) => e.storm.position <= MAIN_BASIN_MAX_POSITION);
      if (mainEntries.length > 0) {
        for (const storm of pickExtremes(mainEntries)) {
          if (!result.includes(storm)) result.push(storm);
        }
      }
    }
  }
  return result;
};

const stormKey = (storm: Storm): string => `${storm.name}-${storm.year}-${storm.position}`;

export const markSeasonExtremes = (storms: Storm[], allStorms: Storm[]): Storm[] => {
  const firstKeys = new Set(getSeasonExtremes(allStorms, "first").map(stormKey));
  const lastKeys = new Set(getSeasonExtremes(allStorms, "last").map(stormKey));
  return storms.map((storm) => ({
    ...storm,
    isFirst: firstKeys.has(stormKey(storm)),
    isLast: lastKeys.has(stormKey(storm)),
  }));
};
