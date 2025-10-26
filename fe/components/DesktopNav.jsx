import { Wind, List, Archive } from "lucide-react";
import NavLink from "./NavLink";

const DesktopNav = ({ currentPath }) => {
  return (
    <div className="hidden md:flex space-x-4">
      <NavLink
        href="/storms"
        icon={Wind}
        label="Typhoon List"
        isActive={currentPath === "/storms"}
      />

      <NavLink
        href="/stormnames"
        icon={List}
        label="Current Names"
        isActive={currentPath === "/stormnames"}
      />

      <NavLink
        href="/retired"
        icon={Archive}
        label="Retired Names"
        isActive={currentPath === "/retired"}
      />
    </div>
  );
};

export default DesktopNav;
