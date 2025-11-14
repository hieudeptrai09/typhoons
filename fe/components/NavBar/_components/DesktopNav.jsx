import { List, Archive, LayoutDashboard } from "lucide-react";
import NavLink from "./NavLink";

const DesktopNav = ({ currentPath }) => {
  return (
    <div className="hidden md:flex space-x-4">
      <NavLink
        href="/dashboard"
        icon={LayoutDashboard}
        label="Dashboard"
        isActive={currentPath === "/dashboard"}
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
