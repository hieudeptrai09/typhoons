"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import NavbarLogo from "./NavBarLogo";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import MenuToggle from "./MenuToggle";

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
    <nav className="bg-blue-600 relative">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <NavbarLogo onClose={closeMenu} />
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
