"use client";

import { BROWSE_LINKS } from "@/lib/layout/browseLinks";
import type { StormHighlight } from "@/lib/types";
import { ArrowLeft, BookText, ChevronRight, CloudLightning, Compass } from "lucide-react";
import { useState } from "react";
import ActiveStormsButton from "./ActiveStormsButton";
import FunFacts from "./FunFacts";
import GameButton from "./GameButton";
import GameLink from "./GameLink";

// Homepage-only styling, so the shared BROWSE_LINKS list stays free of it.
const BROWSE_COLORS: Record<string, string> = {
  "/info/": "bg-purple-500 text-white hover:bg-purple-600",
  "/positions/": "bg-teal-600 text-white hover:bg-teal-700",
  "/countries/": "bg-emerald-600 text-white hover:bg-emerald-700",
  "/years/": "bg-indigo-600 text-white hover:bg-indigo-700",
};

const MainMenu = ({ highlights }: { highlights: StormHighlight[] }) => {
  const [isBrowseOpen, setIsBrowseOpen] = useState(false);

  // Panels swap outright instead of sliding: this menu keeps motion out, as the still Active icon does.
  return (
    <nav className="flex w-full flex-col gap-4" aria-label="Main menu">
      {isBrowseOpen ? (
        <>
          {BROWSE_LINKS.map((link) => (
            <GameLink key={link.href} href={link.href} colorClass={BROWSE_COLORS[link.href]}>
              <link.icon size={24} aria-hidden />
              {link.label}
            </GameLink>
          ))}

          <GameButton
            onClick={() => setIsBrowseOpen(false)}
            colorClass="bg-slate-500 text-white hover:bg-slate-600"
          >
            <ArrowLeft size={24} aria-hidden />
            Back
          </GameButton>
        </>
      ) : (
        <>
          <ActiveStormsButton highlights={highlights} />

          <GameLink href="/storms/all/name/" colorClass="bg-sky-600 text-white hover:bg-sky-700">
            <CloudLightning size={24} aria-hidden />
            Storms
          </GameLink>

          <GameLink
            href="/names/current/"
            colorClass="bg-purple-600 text-white hover:bg-purple-700"
          >
            <BookText size={24} aria-hidden />
            Names
          </GameLink>

          <GameButton
            onClick={() => setIsBrowseOpen(true)}
            aria-expanded={isBrowseOpen}
            colorClass="bg-teal-600 text-white hover:bg-teal-700"
          >
            <Compass size={24} aria-hidden />
            Browse
            <ChevronRight size={24} aria-hidden />
          </GameButton>

          <FunFacts />
        </>
      )}
    </nav>
  );
};

export default MainMenu;
