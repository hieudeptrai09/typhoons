"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Wind, List, Archive } from "lucide-react";

// Navbar Component
const Navbar = () => {
  const pathName = usePathname();

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center space-x-2 hover:bg-white/20 px-4 py-2 rounded-lg transition"
          >
            <Home size={24} />
            <span className="font-semibold">Home</span>
          </Link>

          <div className="flex space-x-4">
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
