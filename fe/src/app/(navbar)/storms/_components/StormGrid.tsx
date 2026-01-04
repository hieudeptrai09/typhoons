import type { ReactNode } from "react";
import GridCell from "./GridCell";
import { TEXT_COLOR_WHITE_BACKGROUND } from "../../../../constants";
import { getIntensityFromNumber } from "../_utils/fns";
import type { Storm } from "../../../../types";

interface StormGridProps {
  viewType: "storms" | "average" | "highlights";
  onCellClick: (position: number, key: string) => void;
  stormsData: Storm[];
  highlightedStorms?: Storm[];
  highlightType?: string;
  averageValues?: Record<number, number> | null;
  isClickable?: boolean;
}

const StormGrid = ({
  viewType,
  onCellClick,
  stormsData,
  highlightedStorms = [],
  highlightType = "",
  averageValues = null,
  isClickable = true,
}: StormGridProps) => {
  const rows = 10;
  const cols = 14;

  // Helper function to get storm names for a position
  const getStormNamesForPosition = (position: number): string[] => {
    if (!stormsData || stormsData.length === 0) return [];
    const storms = stormsData.filter((storm) => storm.position === position);
    const uniqueNames = [...new Set(storms.map((storm) => storm.name))];
    return uniqueNames;
  };

  // Helper function to get background color class based on highlight type
  const getHighlightColorClass = (): string => {
    if (!highlightType) return "";
    switch (highlightType) {
      case "strongest":
        return "bg-red-300";
      case "first":
        return "bg-blue-300";
      case "last":
        return "bg-orange-300";
      default:
        return "bg-green-300";
    }
  };

  // Main function to render cell content based on position and viewType
  const renderCellContent = (position: number): { content: ReactNode; className: string } => {
    switch (viewType) {
      case "storms": {
        // Render simple position number with default color
        const content = (
          <div className="text-center text-base font-semibold text-gray-700">{position}</div>
        );
        return { content, className: "" };
      }

      case "average": {
        // Render position number with intensity-based color
        const avgNumber = averageValues?.[position];
        const textColor =
          avgNumber !== undefined
            ? TEXT_COLOR_WHITE_BACKGROUND[getIntensityFromNumber(avgNumber)]
            : "#374151";

        const content = (
          <div className="text-center text-base font-semibold" style={{ color: textColor }}>
            {position}
          </div>
        );
        return { content, className: "" };
      }

      case "highlights": {
        // Find storms at this position
        const positionStorms = highlightedStorms.filter((s) => s.position === position);

        if (positionStorms.length === 0) {
          // No storms at this position - render empty
          return { content: "", className: "" };
        }

        // Render storm names and years
        const content = (
          <div className="flex flex-col items-center gap-1">
            {positionStorms.map((storm, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="text-xs font-bold text-gray-800">{storm.name}</div>
                <div className="text-[10px] text-gray-600">({storm.year})</div>
              </div>
            ))}
          </div>
        );

        return { content, className: getHighlightColorClass() };
      }

      default:
        return { content: "", className: "" };
    }
  };

  // Calculate equal width for each column (100% / 14 columns)
  const columnWidth = `${100 / cols}%`;

  return (
    <div className="overflow-x-auto">
      <table className="mx-auto min-w-full border-collapse">
        <colgroup>
          {[...Array(cols)].map((_, idx) => (
            <col key={idx} style={{ width: columnWidth }} />
          ))}
        </colgroup>
        <tbody>
          {[...Array(rows)].map((_, row) => (
            <tr key={row}>
              {[...Array(cols)].map((_, col) => {
                const position = row * cols + col + 1;
                const { content, className } = renderCellContent(position);
                const stormNames = getStormNamesForPosition(position);

                return (
                  <GridCell
                    key={col}
                    onClick={() => onCellClick(position, "position")}
                    content={content}
                    className={className}
                    isClickable={isClickable}
                    stormNames={stormNames}
                  />
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StormGrid;
