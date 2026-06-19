import type { IntensityType, RetiredName, Storm, Suggestion, TyphoonName } from "../types";

export const TITLE_COMMON = "Cá Tra's Typhoons App";

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
  isReplaced: false,
  isLanguageProblem: 0,
  tag: "",
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
