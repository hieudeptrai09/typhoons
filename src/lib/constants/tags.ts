import {
  Gem,
  Ham,
  Hammer,
  Leaf,
  LibraryBig,
  MapPin,
  Moon,
  PawPrint,
  Swords,
  Tag,
  User,
  Wind,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const TAG_ICONS: Record<string, LucideIcon> = {
  Animal: PawPrint,
  "Celestial body": Moon,
  Concept: LibraryBig,
  Deity: Swords,
  Descriptive: Tag,
  "Food and beverage": Ham,
  Mineral: Gem,
  Nature: Wind,
  "People's name": User,
  Place: MapPin,
  Plant: Leaf,
  Thing: Hammer,
};

export const TAG_COLORS: Record<string, string> = {
  Animal: "text-emerald-700",
  "Celestial body": "text-indigo-800",
  Concept: "text-violet-700",
  Deity: "text-amber-700",
  Descriptive: "text-rose-700",
  "Food and beverage": "text-red-500",
  Mineral: "text-slate-500",
  Nature: "text-cyan-600",
  "People's name": "text-pink-600",
  Place: "text-blue-600",
  Plant: "text-green-600",
  Thing: "text-amber-800",
};

// Hex mirrors of TAG_COLORS, for contexts that cannot use Tailwind classes (e.g. ImageResponse).
export const TAG_HEX: Record<string, string> = {
  Animal: "#047857",
  "Celestial body": "#3730a3",
  Concept: "#6d28d9",
  Deity: "#b45309",
  Descriptive: "#be123c",
  "Food and beverage": "#ef4444",
  Mineral: "#64748b",
  Nature: "#0891b2",
  "People's name": "#db2777",
  Place: "#2563eb",
  Plant: "#16a34a",
  Thing: "#92400e",
};
