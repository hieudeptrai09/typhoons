// ===========================
// Common Types
// ===========================
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
  isRetired: boolean;
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
  isChosen: boolean;
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
  name: string;
  year: string;
  country: string;
  reason: string;
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

// Base modal props that all modals share
export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface StormDetailModalProps extends BaseModalProps {
  title: string;
  storms: Storm[];
}

// ===========================
// Component Props Types
// ===========================

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

export type IntensityType = "TD" | "TS" | "STS" | "1" | "2" | "3" | "4" | "5";
