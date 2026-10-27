import { ArrowDownAZ, CalendarRange, Flag, Grid3x3, type LucideIcon } from "lucide-react";

export interface BrowseLink {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const BROWSE_LINKS: BrowseLink[] = [
  { href: "/info/", label: "Names A–Z", icon: ArrowDownAZ },
  { href: "/positions/", label: "Positions", icon: Grid3x3 },
  { href: "/countries/", label: "Countries", icon: Flag },
  { href: "/years/", label: "Seasons", icon: CalendarRange },
];

// The index and every detail page under it, e.g. /positions/ and /positions/3i/.
export const isBrowseLinkActive = (link: BrowseLink, path: string): boolean =>
  path.startsWith(link.href.slice(0, -1));

export const isBrowsePath = (path: string): boolean =>
  BROWSE_LINKS.some((link) => isBrowseLinkActive(link, path));
