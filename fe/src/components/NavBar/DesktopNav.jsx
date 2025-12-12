import {
  CloudLightning,
  BookText,
  List,
  Archive,
  Filter,
  ChevronDown,
} from "lucide-react";
import NavLink from "./NavLink";
import { useState } from "react";
import Link from "next/link";

const DesktopNav = ({ currentPath }) => {
  const [isNamesOpen, setIsNamesOpen] = useState(false);

  const namesSubmenu = [
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

  const isNamesActive = currentPath.startsWith("/names");

  return (
    <div className="hidden md:flex space-x-4">
      <NavLink
        href="/storms/"
        icon={CloudLightning}
        label="Storms"
        isActive={currentPath === "/storms/"}
      />

      <div
        className="relative"
        onMouseEnter={() => setIsNamesOpen(true)}
        onMouseLeave={() => setIsNamesOpen(false)}
      >
        <button
          className={`text-white flex items-center space-x-2 px-4 py-1 rounded-lg transition hover:bg-white/30 ${
            isNamesActive && "font-semibold"
          }`}
        >
          <BookText size={20} />
          <span>Names</span>
          <ChevronDown
            size={16}
            className={`transition-transform ${isNamesOpen && "rotate-180"}`}
          />
        </button>

        {isNamesOpen && (
          <div className="absolute top-full left-0 pt-2 z-50">
            <div className="bg-white rounded-lg shadow-lg py-2 min-w-[200px]">
              {namesSubmenu.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-2 px-4 py-2 hover:bg-blue-50 transition-colors ${
                      item.isActive
                        ? "bg-blue-100 text-blue-600 font-semibold"
                        : "text-gray-700"
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DesktopNav;
