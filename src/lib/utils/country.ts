import { COUNTRY_NAMES } from "@/lib/components/CountryFlag";
import type { Storm } from "@/lib/types";
import { GRID_COLS, GRID_ROWS, isExternalPosition } from "@/lib/utils/position";

// "HK, China" → "hk-china", "U.S.A." → "usa": dots vanish so abbreviations stay one word.
export const getCountrySlug = (country: string): string =>
  country
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const getCountryFromSlug = (slug: string): string | null =>
  COUNTRY_NAMES.find((country) => getCountrySlug(country) === slug.toLowerCase()) ?? null;

// Each member contributes one grid column, so its positions are that column in every row.
export const getCountryPositions = (country: string): number[] => {
  const col = COUNTRY_NAMES.indexOf(country);
  if (col === -1) return [];
  return Array.from({ length: GRID_ROWS }, (_, row) => row * GRID_COLS + col + 1);
};

// The agency positions share no member's column, so they never count towards a country.
export const getCountryStorms = (storms: Storm[], country: string): Storm[] =>
  storms.filter((storm) => storm.country === country && !isExternalPosition(storm.position));

// Every one of the member's positions in grid order, each with its storms in year order.
export const getCountryPositionGroups = (
  storms: Storm[],
  country: string,
): [position: number, storms: Storm[]][] =>
  getCountryPositions(country).map((position) => [
    position,
    storms.filter((storm) => storm.position === position).sort((a, b) => a.year - b.year),
  ]);
