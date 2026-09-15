"use client";

import PositionGrid from "@/lib/components/PositionGrid";
import { getPositionSlug, getPositionTitle } from "@/lib/utils/position";
import Link from "next/link";

interface PositionIndexGridProps {
  counts: Record<string, number>;
}

// Soft links, so each cell opens the intercepted position modal.
const PositionIndexGrid = ({ counts }: PositionIndexGridProps) => (
  <PositionGrid
    renderCell={(position, _row, col) => {
      const count = counts[position] ?? 0;

      return (
        <td key={col} className="border-2 border-stone-200 p-0">
          <Link
            href={`/positions/${getPositionSlug(position)}/`}
            className="flex min-h-16 flex-col items-center justify-center bg-white p-2 transition-colors hover:bg-stone-200"
            aria-label={
              count > 0
                ? `${getPositionTitle(position)}: ${count} storms`
                : `${getPositionTitle(position)}: no storms yet`
            }
          >
            <span className={`font-bold ${count > 0 ? "text-slate-800" : "text-slate-400"}`}>
              {getPositionTitle(position)}
            </span>
            <span className="text-xs text-slate-500 tabular-nums">{count}</span>
          </Link>
        </td>
      );
    }}
  />
);

export default PositionIndexGrid;
