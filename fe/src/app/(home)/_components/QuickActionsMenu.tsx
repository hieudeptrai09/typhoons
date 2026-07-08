"use client";

import { Button } from "antd";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ActiveStorms from "./ActiveStorms";
import FunFacts from "./FunFacts";
import OnThisDay from "./OnThisDay";
import SearchBar from "./SearchBar";

const QuickActionsMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative mb-4 flex w-full max-w-sm items-center gap-2">
      <div className="min-w-0 flex-1">
        <SearchBar />
      </div>

      <Button
        type="text"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls="home-quick-actions-panel"
        aria-label={isOpen ? "Close quick actions menu" : "Open quick actions menu"}
        icon={isOpen ? <X size={20} /> : <Menu size={20} />}
        className="h-10! w-10! shrink-0! rounded-lg! border! border-amber-600/40! text-amber-700! hover:bg-amber-50!"
      />

      {isOpen && (
        <div
          id="home-quick-actions-panel"
          role="menu"
          className="absolute top-full right-0 z-20 mt-2 w-56 rounded-lg border border-gray-200 bg-white p-2 shadow-lg"
        >
          <div className="flex flex-col items-stretch gap-1">
            <OnThisDay />
            <FunFacts />
            <ActiveStorms />
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickActionsMenu;
