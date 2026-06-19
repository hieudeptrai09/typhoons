// Import flag components from country-flag-icons
import CN from "country-flag-icons/react/3x2/CN"; // China
import FM from "country-flag-icons/react/3x2/FM"; // Micronesia
import HK from "country-flag-icons/react/3x2/HK"; // Hong Kong
import JP from "country-flag-icons/react/3x2/JP"; // Japan
import KH from "country-flag-icons/react/3x2/KH"; // Cambodia
import KP from "country-flag-icons/react/3x2/KP"; // North Korea
import KR from "country-flag-icons/react/3x2/KR"; // South Korea
import LA from "country-flag-icons/react/3x2/LA"; // Laos
import MO from "country-flag-icons/react/3x2/MO"; // Macao
import MY from "country-flag-icons/react/3x2/MY"; // Malaysia
import PH from "country-flag-icons/react/3x2/PH"; // Philippines
import TH from "country-flag-icons/react/3x2/TH"; // Thailand
import US from "country-flag-icons/react/3x2/US"; // USA
import VN from "country-flag-icons/react/3x2/VN"; // Vietnam
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

// Country flag component mapping
export const COUNTRY_FLAG_COMPONENTS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  Cambodia: KH,
  China: CN,
  "DPR Korea": KP,
  "HK, China": HK,
  Japan: JP,
  "Laos PDR": LA,
  "Macao, China": MO,
  Malaysia: MY,
  Micronesia: FM,
  Philippines: PH,
  "RO Korea": KR,
  Thailand: TH,
  "U.S.A.": US,
  Vietnam: VN,
};
