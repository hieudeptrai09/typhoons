import { TEXT_COLOR_WHITE_BACKGROUND } from "../../constants";
import type { TyphoonName, RetiredName, IntensityType } from "../../types";

/**
 * Get color configuration for typhoon/retired name based on status
 */
export const getNameColorConfig = (row: TyphoonName | RetiredName): { className: string } => {
  let colorClass = "text-green-700"; // Default: alive

  if (row.isLanguageProblem === 2) {
    colorClass = "text-amber-500"; // Misspelling
  } else if (Boolean(row.isRetired)) {
    colorClass = "text-red-600"; // Retired
  }

  return { className: `font-semibold ${colorClass}` };
};

/**
 * Get color configuration for retired name based on retirement reason
 */
export const getRetiredNameColorConfig = (row: RetiredName): { className: string } => {
  let colorClass = "text-red-600"; // Default: Destructive Storm

  switch (row.isLanguageProblem) {
    case 0:
      colorClass = "text-red-600"; // Destructive Storm
      break;
    case 1:
      colorClass = "text-green-600"; // Language Problem
      break;
    case 2:
      colorClass = "text-amber-500"; // Misspelling
      break;
    case 3:
      colorClass = "text-purple-600"; // Special Storm
      break;
  }

  return { className: `font-semibold ${colorClass}` };
};

/**
 * Get color configuration for retired status icon
 */
export const getRetiredIconColorConfig = (
  row: TyphoonName | RetiredName,
): { className: string } => {
  const colorClass = row.isRetired
    ? row.isLanguageProblem === 2
      ? "text-amber-500"
      : "text-red-600"
    : "text-green-700";

  return { className: colorClass };
};

/**
 * Get intensity from average number
 */
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

/**
 * Get color configuration for average intensity value
 */
export const getAverageIntensityColorConfig = (avgNumber: number): { style: { color: string } } => {
  const intensityLabel = getIntensityFromNumber(avgNumber);
  const textColor = TEXT_COLOR_WHITE_BACKGROUND[intensityLabel];
  return { style: { color: textColor } };
};

/**
 * Get title color for retired name modal
 */
export const getRetiredNameTitleColor = (selectedName: RetiredName): string => {
  const ilp = selectedName.isLanguageProblem;

  switch (ilp) {
    case 0:
      return "!text-red-600"; // Destructive Storm
    case 1:
      return "!text-green-600"; // Language Problem
    case 2:
      return "!text-amber-500"; // Misspelling
    case 3:
      return "!text-purple-600"; // Special Storm
    default:
      return "!text-red-600"; // Default to destructive
  }
};
