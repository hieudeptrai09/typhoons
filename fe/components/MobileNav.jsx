import { Wind, List, Archive } from "lucide-react";
import NavLink from "./NavLink";

const MobileNav = ({ currentPath, isOpen, onClose }) => {
  return (
    <div
      className={`md:hidden absolute top-full left-0 right-0 bg-blue-600 shadow-lg transition-all duration-300 ease-in-out overflow-hidden z-40 ${
        isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <div className="px-4 py-2 space-y-2">
        <NavLink
          href="/storms"
          icon={Wind}
          label="Typhoon List"
          isActive={currentPath === "/storms"}
          onClick={onClose}
        />

        <NavLink
          href="/stormnames"
          icon={List}
          label="Current Names"
          isActive={currentPath === "/stormnames"}
          onClick={onClose}
        />

        <NavLink
          href="/retired"
          icon={Archive}
          label="Retired Names"
          isActive={currentPath === "/retired"}
          onClick={onClose}
        />
      </div>
    </div>
  );
};

export default MobileNav;
