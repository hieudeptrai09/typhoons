import { CloudLightning, BookText, BarChart3 } from "lucide-react";
import NavLink from "./NavLink";

interface DesktopNavProps {
  currentPath: string;
}

const DesktopNav = ({ currentPath }: DesktopNavProps) => {
  return (
    <div className="hidden space-x-4 md:flex" role="navigation" aria-label="Desktop navigation">
      <NavLink
        href="/storms/"
        icon={CloudLightning}
        label="Storms"
        isActive={currentPath === "/storms/"}
      />
      <NavLink
        href="/names"
        icon={BookText}
        label="Names"
        isActive={currentPath.startsWith("/names")}
      />
      <NavLink
        href="/charts"
        icon={BarChart3}
        label="Charts"
        isActive={currentPath.startsWith("/charts")}
      />
    </div>
  );
};

export default DesktopNav;
