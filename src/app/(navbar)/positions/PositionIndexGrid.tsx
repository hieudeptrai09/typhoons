"use client";

import PositionGrid from "@/lib/components/PositionGrid";
import { BACKGROUND_BADGE, TEXT_COLOR_WHITE_BACKGROUND } from "@/lib/utils/colors";
import { getPositionSlug, getPositionTitle } from "@/lib/utils/position";
import { getIntensityFromNumber, type GroupSummary } from "@/lib/utils/storms";
import Link from "next/link";

interface PositionIndexGridProps {
  summaries: Record<string, GroupSummary>;
}

// Soft links, so each cell opens the intercepted position modal.
const PositionIndexGrid = ({ summaries }: PositionIndexGridProps) => (
  <PositionGrid
    renderCell={(position, _row, col) => {
      const summary = summaries[position];
      const intensity = summary ? getIntensityFromNumber(summary.average) : null;

      return (
        <td key={col} className="border-2 border-stone-200 p-0">
          <Link
            href={`/positions/${getPositionSlug(position)}/`}
            className="flex min-h-16 flex-col items-center justify-center bg-white p-2 transition-colors hover:bg-stone-200"
            style={{
              borderBottom: `4px solid ${intensity ? BACKGROUND_BADGE[intensity] : "#e2e8f0"}`,
            }}
            aria-label={
              summary
                ? `${getPositionTitle(position)}: ${summary.count} storms, average ${summary.average.toFixed(2)}`
                : `${getPositionTitle(position)}: no storms yet`
            }
          >
            <span
              className="font-bold"
              style={{ color: intensity ? TEXT_COLOR_WHITE_BACKGROUND[intensity] : "#94a3b8" }}
            >
              {getPositionTitle(position)}
            </span>
            <span className="text-xs text-slate-500 tabular-nums">{summary?.count ?? 0}</span>
          </Link>
        </td>
      );
    }}
  />
);

export default PositionIndexGrid;
