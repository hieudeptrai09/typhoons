import {
  Activity,
  ArrowDownToLine,
  CloudLightning,
  Globe,
  Grid3x3,
  List,
  MapPin,
  Medal,
  Moon,
  Ruler,
  Star,
  Sun,
  Tag,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const DASHBOARD_ICON_MAP: Record<string, Record<string, LucideIcon>> = {
  view: {
    storms: CloudLightning,
    highlights: Star,
    average: Activity,
    distance: Ruler,
  },
  filter: {
    strongest: Zap,
    first: Medal,
    last: ArrowDownToLine,
    position: MapPin,
    name: Tag,
    country: Globe,
    year: Sun,
    month: Moon,
  },
  mode: {
    table: Grid3x3,
    list: List,
  },
};

const icon = (Icon: LucideIcon, label: string) => (
  <span className="flex items-center justify-center gap-1.5">
    <Icon size={13} />
    {label}
  </span>
);

export const VIEW_OPTIONS = [
  { label: icon(CloudLightning, "Storms"), value: "storms" },
  { label: icon(Star, "Highlights"), value: "highlights" },
  { label: icon(Activity, "Average"), value: "average" },
  { label: icon(Ruler, "Gap"), value: "distance" },
];

export const MODE_OPTIONS = [
  { label: icon(Grid3x3, "Table"), value: "table" },
  { label: icon(List, "List"), value: "list" },
];

export const FILTER_OPTIONS: Record<string, { label: React.ReactNode; value: string }[]> = {
  storms: [
    { label: icon(MapPin, "Position"), value: "position" },
    { label: icon(Tag, "Name"), value: "name" },
  ],
  highlights: [
    { label: icon(Zap, "Strongest"), value: "strongest" },
    { label: icon(Medal, "First"), value: "first" },
    { label: icon(ArrowDownToLine, "Last"), value: "last" },
  ],
  average: [
    { label: icon(MapPin, "Position"), value: "position" },
    { label: icon(Tag, "Name"), value: "name" },
    { label: icon(Globe, "Country"), value: "country" },
    { label: icon(Sun, "Year"), value: "year" },
    { label: icon(Moon, "Month"), value: "month" },
  ],
  distance: [
    { label: icon(MapPin, "Position"), value: "position" },
    { label: icon(Tag, "Name"), value: "name" },
  ],
};
