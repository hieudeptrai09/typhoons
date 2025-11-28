"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import NavbarLogo from "./_components/NavBarLogo";
import DesktopNav from "./_components/DesktopNav";
import MobileNav from "./_components/MobileNav";
import MenuToggle from "./_components/MenuToggle";

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
