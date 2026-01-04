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

export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  isSortable?: boolean;
  title?: string;
}

export type SortDirection = "asc" | "desc" | null;

export type IntensityType = "TD" | "TS" | "STS" | "1" | "2" | "3" | "4" | "5";

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
