import { BROWSE_LINKS, isBrowseLinkActive } from "@/lib/layout/browseLinks";
import { BookText, CloudLightning } from "lucide-react";
import NavLink from "./NavLink";

interface MobileNavProps {
  currentPath: string;
  isOpen: boolean;
  onClose: () => void;
}

const MobileNav = ({ currentPath, isOpen, onClose }: MobileNavProps) => {
  return (
    <div
      role="navigation"
      aria-label="Mobile navigation"
      className={`absolute top-full right-0 left-0 z-40 overflow-hidden bg-blue-600 shadow-lg transition-all duration-300 ease-in-out md:hidden ${
        isOpen ? "max-h-[32rem] opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <div className="space-y-2 px-4 py-2">
        <NavLink
          href="/storms/all/name/"
          icon={CloudLightning}
          label="Storms"
          isActive={currentPath.startsWith("/storms")}
          onClick={onClose}
        />
        <NavLink
          href="/names/current/"
          icon={BookText}
          label="Names"
          isActive={currentPath.startsWith("/names")}
          onClick={onClose}
        />
        {/* Touch has no hover, so the desktop Browse dropdown unfolds into plain links here. */}
        <div className="flex flex-col items-start gap-1 border-t border-white/20 pt-2">
          <span className="px-4 text-xs font-semibold tracking-wide text-white/70 uppercase">
            Browse
          </span>
          {BROWSE_LINKS.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              icon={link.icon}
              label={link.label}
              isActive={isBrowseLinkActive(link, currentPath)}
              onClick={onClose}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
