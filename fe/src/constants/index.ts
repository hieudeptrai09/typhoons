import type { IntensityType, RetiredName, Storm, Suggestion, TyphoonName } from "../types";

export const TITLE_COMMON = "Cá Tra's Typhoons App";

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

export const SORTING_RANK: Record<IntensityType, number> = {
  5: 5,
  4: 4,
  3: 3,
  2: 2,
  1: 1,
  STS: 0,
  TS: -1,
  TD: -2,
};

export const INTENSITY_RANK: Record<IntensityType, number> = {
  5: 5,
  4: 4,
  3: 3,
  2: 2,
  1: 1,
  STS: 0,
  TS: 0,
  TD: -1,
};

export const INTENSITY_LABEL: Record<IntensityType, string> = {
  5: "Category 5 Super Typhoon",
  4: "Category 4 Typhoon",
  3: "Category 3 Typhoon",
  2: "Category 2 Typhoon",
  1: "Category 1 Typhoon",
  STS: "Severe Tropical Storm",
  TS: "Tropical Storm",
  TD: "Tropical Depression",
};

export const defaultTyphoonName: TyphoonName = {
  id: 0,
  position: 0,
  name: "",
  meaning: "",
  country: "",
  language: "",
  isRetired: false,
  isLanguageProblem: 0,
};

export const defaultRetiredName: RetiredName = {
  ...defaultTyphoonName,
  lastYear: 0,
  replacementName: "",
};

export const defaultSuggestion: Suggestion = {
  replacementName: "",
  replacementMeaning: "",
  isChosen: false,
};

export const defaultStorm: Storm = {
  id: 0,
  name: "",
  year: 0,
  intensity: "5",
  position: 0,
  country: "",
  map: "",
};
