import type { Storm } from "@/lib/types";
import { EMPTY_POSITION_CELL_CLASS, getHighlightCellClass } from "@/lib/utils/colors";
import { infoHref } from "@/lib/utils/links";
import Link from "next/link";
import PositionCellGrid from "./PositionCellGrid";

interface HighlightsGridProps {
  stormsData: Storm[];
  highlightedStorms: Storm[];
  highlightType: string;
}

const HighlightsGrid = ({ stormsData, highlightedStorms, highlightType }: HighlightsGridProps) => (
  <PositionCellGrid
    stormsData={stormsData}
    gridCellViewType="highlights"
    renderCell={(position) => {
      const positionStorms = highlightedStorms.filter((s) => s.position === position);
      if (positionStorms.length === 0) {
        return {
          content: <span className="text-sm text-gray-300">—</span>,
          className: EMPTY_POSITION_CELL_CLASS,
          clickable: false,
        };
      }
      return {
        content: (
          <div className="flex flex-col items-center gap-1">
            {positionStorms.map((storm, idx) => (
              <Link
                key={idx}
                href={infoHref(storm.name)}
                scroll={false}
                aria-label={`View details for ${storm.name}`}
                className="flex min-h-11 flex-col items-center justify-center text-foreground md:min-h-0"
              >
                <span className="text-xs font-bold">{storm.name}</span>
                <span className="text-[10px]">({storm.year})</span>
              </Link>
            ))}
          </div>
        ),
        className: getHighlightCellClass(highlightType),
        clickable: false,
      };
    }}
  />
);

export default HighlightsGrid;
