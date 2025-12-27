import { useState } from "react";
import { CloudLightning, BookText, List, Archive, Filter, ChevronDown } from "lucide-react";
import Link from "next/link";
import NavLink from "./NavLink";

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
    <div className="hidden space-x-4 md:flex">
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
          className={`flex items-center space-x-2 rounded-lg px-4 py-1 text-white transition hover:bg-white/30 ${
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
          <div className="absolute top-full right-0 z-50 pt-2">
            <div className="min-w-[200px] rounded-lg bg-white py-2 shadow-lg">
              {namesSubmenu.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-2 px-4 py-2 transition-colors hover:bg-blue-50 ${
                      item.isActive ? "bg-blue-100 font-semibold text-blue-600" : "text-gray-700"
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
