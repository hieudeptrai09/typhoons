import type { ReactNode } from "react";
import { TEXT_COLOR_WHITE_BACKGROUND } from "../../../../../constants";
import { getIntensityFromNumber, getDistanceColor } from "../../_utils/fns";
import GridCell from "./GridCell";
import type { Storm } from "../../../../../types";

interface StormGridProps {
  viewType: "storms" | "average" | "highlights" | "distance";
  onCellClick: (position: number, key: string) => void;
  stormsData: Storm[];
  highlightedStorms?: Storm[];
  highlightType?: string;
  averageValues?: Record<number, number> | null;
  distanceValues?: Record<number, number> | null;
  isClickable?: boolean;
}

const StormGrid = ({
  viewType,
  onCellClick,
  stormsData,
  highlightedStorms = [],
  highlightType = "",
  averageValues = null,
  distanceValues = null,
  isClickable = true,
}: StormGridProps) => {
  const rows = 10;
  const cols = 14;

  const getStormNamesForPosition = (position: number): string[] => {
    if (!stormsData || stormsData.length === 0) return [];
    const storms = stormsData.filter((storm) => storm.position === position);
    return [...new Set(storms.map((storm) => storm.name))];
  };

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

  const renderCellContent = (position: number): { content: ReactNode; className: string } => {
    switch (viewType) {
      case "storms": {
        const content = (
          <div className="text-center text-base font-semibold text-gray-700">{position}</div>
        );
        return { content, className: "" };
      }

      case "average": {
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

      case "distance": {
        const dist = distanceValues?.[position];
        const color = dist !== undefined ? getDistanceColor(dist) : "#9ca3af";
        const label = dist === undefined ? "—" : dist === 0 ? "N/A" : `${dist.toFixed(2)}y`;
        const content = (
          <div className="text-center text-sm font-bold" style={{ color }}>
            {label}
          </div>
        );
        return { content, className: "" };
      }

      case "highlights": {
        const positionStorms = highlightedStorms.filter((s) => s.position === position);
        if (positionStorms.length === 0) return { content: "", className: "" };
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
                    viewType={viewType === "distance" ? "storms" : viewType}
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
