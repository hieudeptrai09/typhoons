import { normalizeParam } from "../../../../containers/utils/fns";
import type { TyphoonName } from "../../../../types";

export const getNamesTitle = (
  view: string | string[] | undefined,
  showName?: string | string[] | undefined,
  showHistory?: string | string[] | undefined,
): string => {
  const viewStr = normalizeParam(view) || "grid";

  if (viewStr === "retired") return "Retired Typhoon Names";
  if (viewStr === "list") return "Active Typhoon Names (List)";

  const nameOn = normalizeParam(showName) === "true";
  const historyOn = normalizeParam(showHistory) === "true";

  if (nameOn && historyOn) return "Active Typhoon Names (Names & History)";
  if (nameOn) return "Active Typhoon Names (Names)";
  if (historyOn) return "Active Typhoon Names (History)";
  return "Active Typhoon Names";
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
    return "View all active typhoon names in list format with detailed information including country of origin, language, and naming history.";
  }

  const nameOn = normalizeParam(showName) === "true";
  const historyOn = normalizeParam(showHistory) === "true";

  if (nameOn && historyOn) {
    return "Explore active typhoon names organized by position with name labels and full naming history visible in the grid.";
  }
  if (historyOn) {
    return "Explore active typhoon names organized by position with naming history visible in the grid.";
  }
  if (nameOn) {
    return "Explore active typhoon names organized by position with name labels visible in the grid.";
  }
  return "Explore active typhoon names organized by position in the Western Pacific naming sequence. View name origins, countries, and storm history.";
};

export const categorizeLettersByStatus = (
  namesList: TyphoonName[],
): Record<string, [boolean, boolean, boolean]> => {
  const letterStatusMap: Record<string, [boolean, boolean, boolean]> = {};

  namesList.forEach((name) => {
    const letter = name.name.charAt(0).toUpperCase();
    const isRetired = Boolean(name.isRetired);

    if (!letterStatusMap[letter]) letterStatusMap[letter] = [false, false, false];

    letterStatusMap[letter][0] = true;
    if (isRetired) letterStatusMap[letter][1] = true;
    else letterStatusMap[letter][2] = true;
  });

  return letterStatusMap;
};

export interface NameFilterValues {
  name: string;
  country: string[];
  language: string[];
  tag: string[];
  position: string;
  status: string;
}

export const applyNameFilters = (
  names: TyphoonName[],
  filters: NameFilterValues,
): TyphoonName[] => {
  let filtered = [...names];

  if (filters.name) {
    filtered = filtered.filter((n) =>
      n.name.toLowerCase().includes(filters.name.toLowerCase()),
    );
  }
  if (filters.country.length > 0) {
    filtered = filtered.filter((n) => filters.country.includes(n.country));
  }
  if (filters.language.length > 0) {
    filtered = filtered.filter((n) => filters.language.includes(n.language));
  }
  if (filters.tag.length > 0) {
    filtered = filtered.filter((n) => filters.tag.includes(n.tag));
  }
  if (filters.position) {
    filtered = filtered.filter((n) => n.position === Number(filters.position));
  }
  if (filters.status === "active") {
    filtered = filtered.filter((n) => !n.isRetired);
  } else if (filters.status === "retired") {
    filtered = filtered.filter((n) => n.isRetired);
  } else if (filters.status === "current") {
    filtered = filtered.filter((n) => !n.isRetired || !n.isReplaced);
  }

  return filtered;
};
