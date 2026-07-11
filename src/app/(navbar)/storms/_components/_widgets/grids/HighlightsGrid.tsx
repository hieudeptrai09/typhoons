import type { Storm } from "@/lib/types";
import PositionCellGrid from "./PositionCellGrid";

interface HighlightsGridProps {
  stormsData: Storm[];
  highlightedStorms: Storm[];
  highlightType: string;
}

const getHighlightColorClass = (highlightType: string): string => {
  switch (highlightType) {
    case "strongest":
      return "bg-rose-300";
    case "first":
      return "bg-blue-300";
    case "last":
      return "bg-orange-300";
    default:
      return "bg-green-300";
  }
};

const HighlightsGrid = ({ stormsData, highlightedStorms, highlightType }: HighlightsGridProps) => (
  <PositionCellGrid
    stormsData={stormsData}
    gridCellViewType="highlights"
    renderCell={(position) => {
      const positionStorms = highlightedStorms.filter((s) => s.position === position);
      if (positionStorms.length === 0) {
        return {
          content: <span className="text-sm text-gray-300">—</span>,
          className: "bg-gray-100",
          clickable: false,
        };
      }
      return {
        content: (
          <div className="flex flex-col items-center gap-1">
            {positionStorms.map((storm, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="text-xs font-bold text-muted">{storm.name}</div>
                <div className="text-[10px] text-muted">({storm.year})</div>
              </div>
            ))}
          </div>
        ),
        className: getHighlightColorClass(highlightType),
        clickable: false,
      };
    }}
  />
);

export default HighlightsGrid;
