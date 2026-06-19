import type { IntensityType } from "../types";

// --- Intensity badge colors ---

export const BACKGROUND_BADGE: Record<IntensityType, string> = {
  TD: "#00CCFF",
  TS: "#00FF00",
  STS: "#C0FFC0",
  1: "#FFFF00",
  2: "#FFCC00",
  3: "#FF6600",
  4: "#FF0000",
  5: "#CC00CC",
};

export const BACKGROUND_HOVER_BADGE: Record<IntensityType, string> = {
  TD: "#00B3E6",
  TS: "#00E600",
  STS: "#ADEBAD",
  1: "#EBEB00",
  2: "#EBB800",
  3: "#EB5C00",
  4: "#EB0000",
  5: "#B800B8",
};

export const TEXT_COLOR_BADGE: Record<IntensityType, string> = {
  TD: "#FFFFFF",
  TS: "#005500",
  STS: "#004D26",
  1: "#666600",
  2: "#663300",
  3: "#FFFFFF",
  4: "#FFFFFF",
  5: "#FFFFFF",
};

export const TEXT_COLOR_WHITE_BACKGROUND: Record<IntensityType, string> = {
  TD: "#0099CC",
  TS: "#00BB00",
  STS: "#008844",
  1: "#CC9900",
  2: "#FF9900",
  3: "#FF5500",
  4: "#DD0000",
  5: "#AA00AA",
};

// --- Distance colors ---

export const getDistanceColor = (years: number): string => {
  if (years < 6.0) return "#16a34a";
  if (years === 6.0) return "#2563eb";
  return "#dc2626";
};

// --- Name status colors ---

interface NameStatus {
  isRetired: boolean;
  isLanguageProblem: number;
}

export const getNameStatusColor = (name: NameStatus): string => {
  if (name.isLanguageProblem === 2) return "#f59e0b";
  if (Boolean(name.isRetired)) return "#dc2626";
  return "#16a34a";
};

export const getNameStatusColorClass = (name: NameStatus): string => {
  if (name.isLanguageProblem === 2) return "text-amber-500";
  if (Boolean(name.isRetired)) return "text-red-600";
  return "text-green-600";
};

export const getNameStatusBgClass = (name: NameStatus): string => {
  if (name.isLanguageProblem === 2) return "bg-amber-100";
  if (Boolean(name.isRetired)) return "bg-red-100";
  return "bg-emerald-100";
};

export const getRetiredReasonColorClass = (isLanguageProblem: number): string => {
  switch (isLanguageProblem) {
    case 0:
      return "text-red-600";
    case 1:
      return "text-green-600";
    case 2:
      return "text-amber-500";
    case 3:
      return "text-purple-600";
    default:
      return "text-red-600";
  }
};
