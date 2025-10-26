"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Wind, List, Archive, Menu, X } from "lucide-react";
import { useState } from "react";

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
          <Link
            href="/"
            className="flex items-center space-x-2 hover:bg-white/20 px-4 py-2 rounded-lg transition"
            onClick={closeMenu}
          >
            <Home size={24} />
            <span className="font-semibold">Home</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-4">
            <Link
              href="/storms"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                pathName === "/storms" ? "bg-white/30" : "hover:bg-white/20"
              }`}
            >
              <Wind size={20} />
              <span>Typhoon List</span>
            </Link>

            <Link
              href="/stormnames"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                pathName === "/stormnames" ? "bg-white/30" : "hover:bg-white/20"
              }`}
            >
              <List size={20} />
              <span>Current Names</span>
            </Link>

            <Link
              href="/retired"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                pathName === "/retired" ? "bg-white/30" : "hover:bg-white/20"
              }`}
            >
              <Archive size={20} />
              <span>Retired Names</span>
            </Link>
          </div>

          {/* Hamburger Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden flex items-center justify-center p-2 rounded-lg hover:bg-white/20 transition z-50"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu - Positioned Absolutely */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-blue-600 shadow-lg transition-all duration-300 ease-in-out overflow-hidden z-40 ${
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-2 space-y-2">
          <Link
            href="/storms"
            className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition ${
              pathName === "/storms" ? "bg-white/30" : "hover:bg-white/20"
            }`}
            onClick={closeMenu}
          >
            <Wind size={20} />
            <span>Typhoon List</span>
          </Link>

          <Link
            href="/stormnames"
            className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition ${
              pathName === "/stormnames" ? "bg-white/30" : "hover:bg-white/20"
            }`}
            onClick={closeMenu}
          >
            <List size={20} />
            <span>Current Names</span>
          </Link>

          <Link
            href="/retired"
            className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition ${
              pathName === "/retired" ? "bg-white/30" : "hover:bg-white/20"
            }`}
            onClick={closeMenu}
          >
            <Archive size={20} />
            <span>Retired Names</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
