import { useState } from "react";
import { Button } from "antd";
import { CloudLightning, BookText, ChevronDown } from "lucide-react";
import Link from "next/link";
import NavLink from "./NavLink";
import { getNamesSubmenu } from "./navNameSubmenuItem";

interface MobileNavProps {
  currentPath: string;
  isOpen: boolean;
  onClose: () => void;
}

const MobileNav = ({ currentPath, isOpen, onClose }: MobileNavProps) => {
  const [isNamesExpanded, setIsNamesExpanded] = useState(false);

  const namesSubmenu = getNamesSubmenu(currentPath);
  const isNamesActive = currentPath.startsWith("/names");

  return (
    <div
      className={`absolute top-full right-0 left-0 z-40 overflow-hidden bg-blue-600 shadow-lg transition-all duration-300 ease-in-out md:hidden ${
        isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <div className="space-y-2 px-4 py-2">
        <NavLink
          href="/storms/"
          icon={CloudLightning}
          label="Storms"
          isActive={currentPath === "/storms/"}
          onClick={onClose}
        />

        <div>
          <Button
            type="text"
            onClick={() => setIsNamesExpanded(!isNamesExpanded)}
            icon={<BookText size={20} />}
            iconPosition="start"
            className={`!w-full !justify-between !text-white hover:!bg-white/30 hover:!text-white ${isNamesActive ? "!font-semibold" : ""}`}
          >
            <span className="flex-1 text-left">Names</span>
            <ChevronDown
              size={20}
              className={`transition-transform ${isNamesExpanded ? "rotate-180" : ""}`}
            />
          </Button>

          {isNamesExpanded && (
            <div className="mt-2 ml-4 space-y-2">
              {namesSubmenu.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center space-x-2 rounded-lg px-4 py-1 transition ${
                      item.isActive
                        ? "bg-white/40 font-semibold text-white"
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
