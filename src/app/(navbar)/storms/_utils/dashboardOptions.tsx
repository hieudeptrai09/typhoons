import { INTENSITY_SHORT_LABEL } from "@/lib/constants";
import type { IntensityType } from "@/lib/types";
import { BACKGROUND_BADGE } from "@/lib/utils/colors";
import { getIntensitySlug, INTENSITIES_BY_STRENGTH } from "@/lib/utils/intensity";
import {
  Activity,
  ArrowDownToLine,
  CalendarRange,
  CalendarSearch,
  ChartColumn,
  CloudLightning,
  Gauge,
  Globe,
  Grid3x3,
  List,
  MapPin,
  Medal,
  Moon,
  Pause,
  Play,
  Repeat,
  Sigma,
  Star,
  Sun,
  Tag,
  Trophy,
  Waves,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavOption {
  key: string;
  label: string;
  icon: LucideIcon;
}

export const VIEW_OPTIONS: NavOption[] = [
  { key: "all", label: "Storms", icon: CloudLightning },
  { key: "records", label: "Records", icon: Trophy },
  { key: "stats", label: "Stats", icon: ChartColumn },
  { key: "calendar", label: "Calendar", icon: CalendarSearch },
];

// Stats reuses the Avg. Intensity / Avg. Dates / Avg. Gap wording of the detail pages' Stats tab.
export const TAB_OPTIONS: Record<string, NavOption[]> = {
  records: [
    { key: "season", label: "Season Records", icon: Star },
    { key: "category", label: "By Category", icon: Gauge },
  ],
  stats: [
    { key: "intensity", label: "Avg. Intensity", icon: Activity },
    { key: "dates", label: "Avg. Dates", icon: CalendarRange },
    { key: "gap", label: "Avg. Gap", icon: Repeat },
  ],
};

const icon = (Icon: LucideIcon, label: string) => (
  <span className="flex items-center justify-center gap-1.5">
    <Icon size={13} />
    {label}
  </span>
);

// The intensity chips carry their own colour instead of an icon: nine icons would be noise.
const intensityChip = (intensity: IntensityType) => (
  <span className="flex items-center justify-center gap-1.5">
    <span
      className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm"
      style={{ backgroundColor: BACKGROUND_BADGE[intensity] }}
    />
    {INTENSITY_SHORT_LABEL[intensity]}
  </span>
);

export const MODE_OPTIONS = [
  { label: icon(Grid3x3, "Grid"), value: "table" },
  { label: icon(List, "List"), value: "list" },
];

// Keyed by panel (see getPanel): the tab where the view has tabs, else the view.
export const FILTER_OPTIONS: Record<string, { label: React.ReactNode; value: string }[]> = {
  all: [
    { label: icon(MapPin, "Position"), value: "position" },
    { label: icon(Tag, "Name"), value: "name" },
  ],
  season: [
    { label: icon(Zap, "Strongest"), value: "strongest" },
    { label: icon(Medal, "First"), value: "first" },
    { label: icon(ArrowDownToLine, "Last"), value: "last" },
  ],
  category: INTENSITIES_BY_STRENGTH.map((intensity) => ({
    label: intensityChip(intensity),
    value: getIntensitySlug(intensity),
  })),
  intensity: [
    { label: icon(MapPin, "Position"), value: "position" },
    { label: icon(Tag, "Name"), value: "name" },
    { label: icon(Globe, "Country"), value: "country" },
    { label: icon(Sun, "Year"), value: "year" },
    { label: icon(Moon, "Month"), value: "month" },
  ],
  gap: [
    { label: icon(MapPin, "Position"), value: "position" },
    { label: icon(Tag, "Name"), value: "name" },
  ],
  dates: [
    { label: icon(MapPin, "Position"), value: "position" },
    { label: icon(Tag, "Name"), value: "name" },
    { label: icon(Globe, "Country"), value: "country" },
    { label: icon(Sun, "Year"), value: "year" },
  ],
  calendar: [
    { label: icon(Play, "Started"), value: "started" },
    { label: icon(Pause, "Ended"), value: "ended" },
    { label: icon(Waves, "Active"), value: "active" },
    { label: icon(Sigma, "So Far"), value: "todate" },
  ],
};

// "Group by" is wrong where the chips pick one slice of the data rather than a grouping.
const FILTER_LABELS: Record<string, string> = {
  category: "Intensity",
  calendar: "Show",
};

export const getFilterLabel = (panel: string): string => FILTER_LABELS[panel] ?? "Group by";
