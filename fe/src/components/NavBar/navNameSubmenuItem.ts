import { List, Archive, Filter, LucideIcon } from "lucide-react";

export interface SubmenuItem {
  href: string;
  icon: LucideIcon;
  label: string;
}

export const getNamesSubmenu = (currentPath: string): (SubmenuItem & { isActive: boolean })[] => {
  return [
    {
      href: "/names/current",
      icon: List,
      label: "Current Names",
      isActive: currentPath === "/names/current/",
    },
    {
      href: "/names/retired",
      icon: Archive,
      label: "Retired Names",
      isActive: currentPath === "/names/retired/",
    },
    {
      href: "/names/filter",
      icon: Filter,
      label: "Filter Names",
      isActive: currentPath === "/names/filter/",
    },
  ];
};
