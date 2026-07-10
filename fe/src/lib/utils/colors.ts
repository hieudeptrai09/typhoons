import type { IntensityType } from "@/lib/types";

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

export const TEXT_COLOR_BADGE: Record<IntensityType, string> = {
  TD: "#003D4C",
  TS: "#005500",
  STS: "#004D26",
  1: "#666600",
  2: "#663300",
  3: "#3D1800",
  4: "#FFFFFF",
  5: "#FFFFFF",
};

export const TEXT_COLOR_WHITE_BACKGROUND: Record<IntensityType, string> = {
  TD: "#0099CC",
  TS: "#00AC00",
  STS: "#008844",
  1: "#999900",
  2: "#C98600",
  3: "#FF5500",
  4: "#DD0000",
  5: "#AA00AA",
};

// --- Distance colors ---

export const getDistanceColor = (years: number): string => {
  if (years < 6.0) return "#dc2626";
  if (years === 6.0) return "#6b7280";
  return "#2563eb";
};

// --- Name status colors ---

interface NameStatus {
  isRetired: boolean;
  isLanguageProblem: number;
  isExternal?: boolean;
}

export const isExternalPosition = (position?: number): boolean =>
  position !== undefined && (position < 1 || position > 140);

export const getNameStatusColor = (name: NameStatus): string => {
  if (name.isExternal) return "#475569";
  if (name.isLanguageProblem === 2) return "#d97706";
  if (Boolean(name.isRetired)) return "#dc2626";
  return "#059669";
};

export const getNameStatusColorClass = (name: NameStatus): string => {
  if (name.isExternal) return "text-slate-600";
  if (name.isLanguageProblem === 2) return "text-amber-600";
  if (Boolean(name.isRetired)) return "text-red-600";
  return "text-emerald-600";
};

export const getNameStatusBgClass = (name: NameStatus): string => {
  if (name.isExternal) return "bg-slate-100";
  if (name.isLanguageProblem === 2) return "bg-amber-100";
  if (Boolean(name.isRetired)) return "bg-red-100";
  return "bg-emerald-100";
};

export const getRetiredReasonColorClass = (isLanguageProblem: number): string => {
  switch (isLanguageProblem) {
    case 0:
      return "text-red-600";
    case 1:
      return "text-purple-600";
    case 2:
      return "text-amber-600";
    case 3:
      return "text-muted";
    default:
      return "text-red-600";
  }
};
