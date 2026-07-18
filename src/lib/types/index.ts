export interface TyphoonName {
  id: number;
  position: number;
  name: string;
  meaning: string;
  country: string;
  language: string;
  isRetired: boolean;
  isReplaced: number;
  isLanguageProblem: number;
  image?: string;
  description?: string;
  tag: string;
}

export interface RetiredName extends TyphoonName {
  lastYear: number;
  note?: string;
  replacementName: string;
}

export interface Suggestion {
  replacementName: string;
  replacementMeaning: string;
  isChosen: boolean;
  image?: string;
}

export interface SuggestionWithNameId extends Suggestion {
  nameId: number;
}

export interface Storm {
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
  dateStart?: number;
  dateEnd?: number;
  monthStart?: number;
  monthEnd?: number;
  isFromPrevYear?: number;
  jtwcDesignation?: string;
  isJtwcForecasted?: boolean;
}

export interface FilterParams {
  name: string;
  country: string;
  language: string;
  position: string;
  tag: string;
  status: string;
  letter?: string;
}

export interface RetiredFilterParams {
  name: string;
  year: string;
  country: string;
  reason: string;
  position: string;
  letter?: string;
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

export interface SearchResult {
  id: number | null;
  name: string;
  position: number;
  country: string;
  isRetired: number;
  isLanguageProblem: number;
  stormCount: number;
  note: string | null;
  replacementName: string | null;
}

export interface SearchDetail {
  name: TyphoonName | RetiredName;
  storms: Storm[];
}

export interface StormHistoryEntry {
  name: string;
  position: number;
  year: number;
}

export interface PositionDetail {
  country: string;
  names: TyphoonName[];
  storms: Storm[];
}

export type StormHighlightStatus = "active" | "next";

export interface StormHighlight {
  name: string;
  position: number;
  status: StormHighlightStatus;
}
