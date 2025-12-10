"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import NavLink from "./NavLink";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import MenuToggle from "./MenuToggle";
import { Home } from "lucide-react";

const Navbar = () => {
  const pathName = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-blue-600 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-2 py-2">
        <div className="flex items-center justify-between">
          <NavLink
            href="/"
            icon={Home}
            label="Home"
            isActive={pathName === "/"}
          />
          <DesktopNav currentPath={pathName} />
          <MenuToggle isOpen={isMenuOpen} onToggle={toggleMenu} />
        </div>
      </div>
      <MobileNav
        currentPath={pathName}
        isOpen={isMenuOpen}
        onClose={closeMenu}
      />
    </nav>
  );
};

export default Navbar;
