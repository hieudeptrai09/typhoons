"use client";

import DefModal from "@/lib/components/DefModal";
import type { StormHighlight } from "@/lib/types";
import { capitalize } from "@/lib/utils/format";
import { getPositionSlug, getPositionTitle } from "@/lib/utils/position";
import { Activity, Clock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import GameButton from "./GameButton";

// The backend reports either every ongoing storm or a single upcoming name, never a mix.
const ActiveStormsButton = ({ highlights }: { highlights: StormHighlight[] }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (highlights.length === 0) return null;

  const isActive = highlights[0].status === "active";
  const label = isActive ? `Active Now (${highlights.length})` : "Up Next";

  return (
    <>
      <GameButton
        onClick={() => setIsOpen(true)}
        colorClass={
          isActive
            ? "bg-red-600 border-red-800 text-white hover:bg-red-700"
            : "bg-blue-600 border-blue-800 text-white hover:bg-blue-700"
        }
      >
        {/* A still icon, not a pulse: flashing motion can distress people with vestibular or seizure conditions. */}
        {isActive ? <Activity size={24} aria-hidden /> : <Clock size={24} aria-hidden />}
        {label}
      </GameButton>

      <DefModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        width={420}
        title={
          <span className={`text-2xl font-bold ${isActive ? "text-red-600" : "text-blue-600"}`}>
            {label}
          </span>
        }
      >
        <ul className="space-y-2 pt-3">
          {highlights.map((highlight) => (
            <li
              key={`${highlight.name}-${highlight.position}`}
              className="flex items-center justify-between gap-3 rounded-md bg-slate-50 px-3 py-2"
              style={{ borderLeft: `4px solid ${isActive ? "#dc2626" : "#2563eb"}` }}
            >
              {/* Closing first, so the intercepted detail modal doesn't open underneath this one. */}
              <Link
                href={`/info/${encodeURIComponent(highlight.name.toLowerCase())}/`}
                onClick={() => setIsOpen(false)}
                className="truncate font-bold text-purple-700 transition-colors hover:text-purple-800"
              >
                {capitalize(highlight.name.toLowerCase())}
              </Link>
              <Link
                href={`/positions/${getPositionSlug(highlight.position)}/`}
                onClick={() => setIsOpen(false)}
                className="shrink-0 font-semibold text-teal-700 tabular-nums transition-colors hover:text-teal-800"
              >
                {getPositionTitle(highlight.position)}
              </Link>
            </li>
          ))}
        </ul>
      </DefModal>
    </>
  );
};

export default ActiveStormsButton;
