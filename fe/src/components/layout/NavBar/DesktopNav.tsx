import { useState } from "react";
import { Popover } from "antd";
import { CloudLightning, BookText, ChevronDown } from "lucide-react";
import Link from "next/link";
import NavLink from "./NavLink";
import { getNamesSubmenu } from "./navNameSubmenuItem";

interface DesktopNavProps {
  currentPath: string;
}

const DesktopNav = ({ currentPath }: DesktopNavProps) => {
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);

  const namesSubmenu = getNamesSubmenu(currentPath);
  const isNamesActive = currentPath.startsWith("/names");

  const submenuContent = (
    <div className="min-w-[200px] py-1">
      {namesSubmenu.map((item) => {
        const Icon = item.icon;
        const isHovered = hoveredHref === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onMouseEnter={() => setHoveredHref(item.href)}
            onMouseLeave={() => setHoveredHref(null)}
            style={{
              backgroundColor: item.isActive
                ? "#eff6ff"
                : isHovered
                  ? "#f9fafb"
                  : undefined,
              color: item.isActive ? "#2563eb" : isHovered ? "#111827" : "#374151",
            }}
            className="!flex items-center space-x-2 px-4 py-2 transition-colors"
          >
            <Icon size={18} />
            <span className={item.isActive ? "!font-semibold" : ""}>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );

  return (
    <div className="hidden space-x-4 md:flex">
      <NavLink
        href="/storms/"
        icon={CloudLightning}
        label="Storms"
        isActive={currentPath === "/storms/"}
      />

      <Popover
        content={submenuContent}
        trigger="hover"
        placement="bottomRight"
        mouseLeaveDelay={0.1}
        arrow={false}
        overlayInnerStyle={{ padding: 0 }}
      >
        <Link href="/names">
          <button
            className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-sm text-white transition-colors hover:bg-white/30 ${isNamesActive ? "font-bold" : ""}`}
          >
            <BookText size={20} />
            <span>Names</span>
            <ChevronDown size={16} />
          </button>
        </Link>
      </Popover>
    </div>
  );
};

export default DesktopNav;
