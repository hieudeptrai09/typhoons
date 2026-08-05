import type { Storm } from "@/lib/types";
import { parseDateParts } from "@/lib/utils/date";
import { getGroupedStorms } from "@/lib/utils/storms";

export const getHighlights = (stormsData: Storm[], type: string): Storm[] => {
  if (type === "strongest") {
    return stormsData.filter((storm) => storm.isStrongest);
  } else if (type === "first") {
    return stormsData.filter((storm) => storm.isFirst);
  } else if (type === "last") {
    return stormsData.filter((storm) => storm.isLast);
  } else if (type === "untracked") {
    return stormsData.filter((storm) => storm.intensity === "NT");
  }
  return [];
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

export const getEffectiveMonth = (storm: Storm): number | null => {
  const start = parseDateParts(storm.dateStart);
  if (!start || storm.year < 2000) return null;
  // A storm carried over from the previous season counts toward January.
  return start.year < storm.year ? 1 : start.month;
};
