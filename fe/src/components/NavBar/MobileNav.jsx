import {
  CloudLightning,
  BookText,
  List,
  Archive,
  Filter,
  ChevronDown,
} from "lucide-react";
import NavLink from "./NavLink";
import Link from "next/link";
import { useState } from "react";

const MobileNav = ({ currentPath, isOpen, onClose }) => {
  const [isNamesExpanded, setIsNamesExpanded] = useState(false);

  const namesSubmenu = [
    {
      href: "/names/now",
      icon: List,
      label: "Current Names",
      isActive: currentPath === "/names/now/" || currentPath === "/stormnames/",
    },
    {
      href: "/names/retired",
      icon: Archive,
      label: "Retired Names",
      isActive:
        currentPath === "/names/retired/" || currentPath === "/retired/",
    },
    {
      href: "/names/filter",
      icon: Filter,
      label: "Filter Names",
      isActive: currentPath === "/names/filter/",
    },
  ];

  const isNamesActive =
    currentPath.startsWith("/names") ||
    currentPath === "/stormnames/" ||
    currentPath === "/retired/";

  return (
    <div
      className={`md:hidden absolute top-full left-0 right-0 bg-blue-600 shadow-lg transition-all duration-300 ease-in-out overflow-hidden z-40 ${
        isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <div className="px-4 py-2 space-y-2">
        <NavLink
          href="/storms/"
          icon={CloudLightning}
          label="Storms"
          isActive={
            currentPath.startsWith("/storms") || currentPath === "/dashboard/"
          }
          onClick={onClose}
        />

        <div>
          <button
            onClick={() => setIsNamesExpanded(!isNamesExpanded)}
            className={`text-white flex items-center justify-between w-full px-4 py-1 rounded-lg transition hover:bg-white/30 ${
              isNamesActive && "font-semibold"
            }`}
          >
            <div className="flex items-center space-x-2">
              <BookText size={20} />
              <span>Names</span>
            </div>
            <ChevronDown
              size={20}
              className={`transition-transform ${
                isNamesExpanded && "rotate-180"
              }`}
            />
          </button>

          {isNamesExpanded && (
            <div className="ml-4 mt-2 space-y-2">
              {namesSubmenu.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center space-x-2 px-4 py-1 rounded-lg transition ${
                      item.isActive
                        ? "bg-white/40 text-white font-semibold"
                        : "text-white/90 hover:bg-white/20"
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
