"use client";

import SearchBar from "@/lib/components/SearchBar";
import { Home } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import DesktopNav from "./DesktopNav";
import MenuToggle from "./MenuToggle";
import MobileNav from "./MobileNav";
import NavLink from "./NavLink";

const Navbar = () => {
  const pathName = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const updateHeight = () => {
      document.documentElement.style.setProperty("--navbar-height", `${nav.offsetHeight}px`);
    };

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(nav);
    return () => observer.disconnect();
  }, []);

  return (
    <nav ref={navRef} className="sticky top-0 z-50 bg-blue-600" aria-label="Main navigation">
      <div className="mx-auto max-w-7xl px-2 py-2">
        <div className="relative flex items-center justify-between">
          <NavLink href="/" icon={Home} label="Home" isActive={pathName === "/"} />

          <div className="mx-2 min-w-0 flex-1 md:mx-4 md:max-w-md">
            <SearchBar variant="navbar" />
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <DesktopNav currentPath={pathName} />
            <MenuToggle isOpen={isMenuOpen} onToggle={toggleMenu} />
          </div>
        </div>
      </div>
      <MobileNav currentPath={pathName} isOpen={isMenuOpen} onClose={closeMenu} />
    </nav>
  );
};

export default Navbar;
