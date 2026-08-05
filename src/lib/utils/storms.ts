import { INTENSITY_RANK } from "@/lib/constants";
import type { IntensityType, Storm } from "@/lib/types";

// The inverse of INTENSITY_RANK: turns an averaged rank back into the intensity it represents.
export const getIntensityFromNumber = (avgNumber: number): IntensityType => {
  const rounded = Math.round(avgNumber);
  if (rounded >= 5) return "5";
  if (rounded === 4) return "4";
  if (rounded === 3) return "3";
  if (rounded === 2) return "2";
  if (rounded === 1) return "1";
  if (rounded === 0) return "TS";
  if (rounded === -1) return "TD";
  if (rounded <= -2) return "NT";
  return "TD";
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

export const sortNamesByFirstYear = (entries: [string, Storm[]][]): [string, Storm[]][] =>
  [...entries].sort(
    ([, aStorms], [, bStorms]) =>
      Math.min(...aStorms.map((s) => s.year)) - Math.min(...bStorms.map((s) => s.year)),
  );
