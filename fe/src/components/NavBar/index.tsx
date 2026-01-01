"use client";

import { useState } from "react";
import { Home } from "lucide-react";
import { usePathname } from "next/navigation";
import DesktopNav from "./DesktopNav";
import MenuToggle from "./MenuToggle";
import MobileNav from "./MobileNav";
import NavLink from "./NavLink";

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
    <nav className="sticky top-0 z-10 bg-blue-600">
      <div className="mx-auto max-w-7xl px-2 py-2">
        <div className="flex items-center justify-between">
          <NavLink href="/" icon={Home} label="Home" isActive={pathName === "/"} />
          <DesktopNav currentPath={pathName} />
          <MenuToggle isOpen={isMenuOpen} onToggle={toggleMenu} />
        </div>
      </div>
      <MobileNav currentPath={pathName} isOpen={isMenuOpen} onClose={closeMenu} />
    </nav>
  );
};

export default Navbar;
