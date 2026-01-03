import { IntensityType } from "../constants";

// ===========================
// Common Types
// ===========================

export interface MenuProps {
  href: string;
  label: string;
  color: string;
  hoverColor: string;
}

// ===========================
// Typhoon Name Types
// ===========================

export interface TyphoonName {
  id: number;
  position: number;
  name: string;
  meaning: string;
  country: string;
  language: string;
  isRetired: number;
  isLanguageProblem: number;
  image?: string;
  description?: string;
}

export interface RetiredName extends TyphoonName {
  lastYear: number;
  note?: string;
}

export interface Suggestion {
  replacementName: string;
  replacementMeaning: string;
  isChosen: number;
  image?: string;
}

// ===========================
// Storm Types
// ===========================

export interface Storm {
  id: number;
  name: string;
  year: number;
  intensity: IntensityType;
  position: number;
  country: string;
  correctSpelling?: string;
  map: string;
  isStrongest?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}

// ===========================
// Filter & Modal Types
// ===========================

export interface FilterParams {
  name: string;
  country: string;
  language: string;
}

export interface RetiredFilterParams {
  searchName: string;
  selectedYear: string;
  selectedCountry: string;
  retirementReason: string;
}

export interface DashboardParams {
  view: string;
  mode: string;
  filter: string;
}

// ===========================
// Table Types
// ===========================

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  isSortable?: boolean;
  title?: string;
}

// ===========================
// Modal Props Types
// ===========================

export interface NameDetailsModalProps {
  selectedName: TyphoonName | null;
  onClose: () => void;
}

export interface RetiredNameDetailsModalProps {
  selectedName: RetiredName | null;
  suggestions: Suggestion[];
  onClose: () => void;
}

export interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterParams) => void;
  countries: string[];
  languages: string[];
  initialFilters: FilterParams;
}

export interface RetiredFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: RetiredFilterParams) => void;
  countries: string[];
  initialFilters: RetiredFilterParams;
}

export interface StormDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  storms: Storm[];
}

export interface AverageModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  average: number;
  storms: Storm[];
}

export interface NameListModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  storms: Storm[];
  avgIntensity?: number;
}

// ===========================
// Component Props Types
// ===========================

export interface FilterButtonParams {
  name: string;
  country: string;
  language: string;
}

export interface RetiredFilterButtonParams {
  name: string;
  year: string;
  country: string;
  lang: string;
}

export interface DashboardFilterButtonParams {
  view: string;
  filter?: string;
  mode: string;
}

export interface LetterNavigationProps {
  currentLetter: string;
  letterStatusMap: Record<string, [boolean, boolean, boolean]>;
  onLetterChange: (letter: string) => void;
}

export interface RetiredLetterNavigationProps {
  currentLetter: string;
  availableLettersMap: Record<string, boolean>;
  onLetterChange: (letter: string) => void;
}

export interface ToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

// ===========================
// Data Aggregation Types
// ===========================

export interface NameData {
  name: string;
  country: string;
  position: number;
  count: number;
  avgIntensity: number;
  year: number;
  [key: string]: unknown;
}

export interface AverageData {
  year?: number;
  country?: string;
  name?: string;
  position?: number;
  count: number;
  average: string;
  avgNumber: number;
  [key: string]: unknown;
}

// ===========================
// Utility Types
// ===========================

export type SortDirection = "asc" | "desc" | null;
