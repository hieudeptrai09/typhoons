import { Popover } from "antd";
import { CloudLightning, BookText, ChevronDown } from "lucide-react";
import Link from "next/link";
import NavLink from "./NavLink";
import { getNamesSubmenu } from "./navNameSubmenuItem";

interface DesktopNavProps {
  currentPath: string;
}

const DesktopNav = ({ currentPath }: DesktopNavProps) => {
  const namesSubmenu = getNamesSubmenu(currentPath);
  const isNamesActive = currentPath.startsWith("/names");

  const submenuContent = (
    <div className="min-w-[200px] py-1">
      {namesSubmenu.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center space-x-2 px-4 py-2 transition-colors ${
              item.isActive
                ? "bg-blue-50 font-semibold text-blue-600 hover:bg-blue-50"
                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Icon size={18} />
            <span>{item.label}</span>
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
