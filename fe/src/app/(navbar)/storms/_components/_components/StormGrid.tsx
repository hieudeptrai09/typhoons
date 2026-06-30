import { useState, useMemo, type ReactNode } from "react";
import { TEXT_COLOR_WHITE_BACKGROUND, getDistanceColor } from "../../../../../components/colors";
import PositionGrid from "../../../../../components/components/PositionGrid";
import {
  getIntensityFromNumber,
  calculateAverage,
  getHighlights,
  sortNamesByFirstYear,
} from "../../_utils/fns";
import GridCell from "./GridCell";
import type { Storm } from "../../../../../types";

interface StormGridProps {
  viewType: "storms" | "average" | "highlights" | "distance" | "names" | "yearHighlights";
  onCellClick: (data: number | string, key: string) => void;
  stormsData: Storm[];
  highlightedStorms?: Storm[];
  highlightType?: string;
  averageValues?: Record<number, number> | null;
  distanceValues?: Record<number, number> | null;
  nameAverageValues?: Record<string, number>;
  isClickable?: boolean;
  onYearHover?: (year: number | null) => void;
}

const StormGrid = ({
  viewType,
  onCellClick,
  stormsData,
  highlightedStorms = [],
  highlightType = "",
  averageValues = null,
  distanceValues = null,
  nameAverageValues,
  isClickable = true,
  onYearHover,
}: StormGridProps) => {
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);

  const handleYearHover = (year: number | null) => {
    setHoveredYear(year);
    onYearHover?.(year);
  };

  const stormsByPosition = useMemo<Record<number, Storm[]>>(() => {
    if (viewType !== "names") return {};
    return stormsData.reduce<Record<number, Storm[]>>((acc, storm) => {
      if (!acc[storm.position]) acc[storm.position] = [];
      acc[storm.position].push(storm);
      return acc;
    }, {});
  }, [stormsData, viewType]);

  const yearHighlightCellMap = useMemo<Record<number, Storm[]>>(() => {
    if (viewType !== "yearHighlights") return {};
    const highlights = getHighlights(stormsData, "first");
    const result: Record<number, Storm[]> = {};
    highlights.forEach((s) => {
      if (!result[s.position]) result[s.position] = [];
      result[s.position].push(s);
    });
    return result;
  }, [stormsData, viewType]);

  const yearPositions = useMemo<Record<number, Set<number>>>(() => {
    if (viewType !== "yearHighlights") return {};
    const result: Record<number, Set<number>> = {};
    stormsData.forEach((s) => {
      if (!result[s.year]) result[s.year] = new Set();
      result[s.year].add(s.position);
    });
    return result;
  }, [stormsData, viewType]);

  const getStormNamesForPosition = (position: number): string[] => {
    if (!stormsData || stormsData.length === 0) return [];
    const storms = stormsData.filter((storm) => storm.position === position);
    return [...new Set(storms.map((storm) => storm.name))];
  };

  const getHighlightColorClass = (): string => {
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

  const getPositionNames = (position: number): { name: string; color: string }[] => {
    const storms = stormsByPosition[position] || [];
    if (storms.length === 0) return [];

    const nameMap = storms.reduce<Record<string, Storm[]>>((acc, s) => {
      if (!acc[s.name]) acc[s.name] = [];
      acc[s.name].push(s);
      return acc;
    }, {});

    return sortNamesByFirstYear(Object.entries(nameMap)).map(([name, nameStorms]) => {
      let color = "#374151";
      if (nameAverageValues) {
        const avg = nameAverageValues[name] ?? calculateAverage(nameStorms);
        color = TEXT_COLOR_WHITE_BACKGROUND[getIntensityFromNumber(avg)];
      }
      return { name, color };
    });
  };

  const renderCellContent = (
    position: number,
  ): { content: ReactNode; className: string; cellClickable: boolean } => {
    switch (viewType) {
      case "storms":
        return {
          content: (
            <div className="text-center text-base font-semibold text-gray-700">{position}</div>
          ),
          className: "",
          cellClickable: isClickable,
        };

      case "average": {
        const avgNumber = averageValues?.[position];
        const textColor =
          avgNumber !== undefined
            ? TEXT_COLOR_WHITE_BACKGROUND[getIntensityFromNumber(avgNumber)]
            : "#374151";
        return {
          content: (
            <div className="text-center text-base font-semibold" style={{ color: textColor }}>
              {position}
            </div>
          ),
          className: "",
          cellClickable: isClickable,
        };
      }

      case "distance": {
        const dist = distanceValues?.[position];
        const color = dist !== undefined ? getDistanceColor(dist) : "#9ca3af";
        const label = dist === undefined ? "—" : dist === 0 ? "N/A" : `${dist.toFixed(2)}y`;
        return {
          content: (
            <div className="text-center text-sm font-bold" style={{ color }}>
              {label}
            </div>
          ),
          className: "",
          cellClickable: isClickable,
        };
      }

      case "highlights": {
        const positionStorms = highlightedStorms.filter((s) => s.position === position);
        if (positionStorms.length === 0)
          return { content: "", className: "", cellClickable: false };
        return {
          content: (
            <div className="flex flex-col items-center gap-1">
              {positionStorms.map((storm, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="text-xs font-bold text-gray-800">{storm.name}</div>
                  <div className="text-[10px] text-gray-600">({storm.year})</div>
                </div>
              ))}
            </div>
          ),
          className: getHighlightColorClass(),
          cellClickable: false,
        };
      }

      case "names": {
        const names = getPositionNames(position);
        return {
          content:
            names.length === 0 ? (
              <span className="text-xs text-gray-300">—</span>
            ) : (
              <div className="flex w-full flex-col items-center justify-center gap-0.5 px-1">
                {names.map(({ name, color }, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      onCellClick(name, "name");
                    }}
                    className="cursor-pointer text-center text-xs leading-tight font-semibold hover:underline"
                    style={{ color, background: "none", border: "none", padding: 0 }}
                  >
                    {name}
                  </button>
                ))}
              </div>
            ),
          className: "",
          cellClickable: false,
        };
      }

      case "yearHighlights": {
        const storms = yearHighlightCellMap[position] ?? [];
        const hasStorms = storms.length > 0;
        const isInHoveredYear = hoveredYear !== null && yearPositions[hoveredYear]?.has(position);
        return {
          content: hasStorms ? (
            <div className="flex flex-col items-center gap-1">
              {storms.map((storm) => (
                <div
                  key={`${storm.name}-${storm.year}`}
                  className="flex cursor-pointer flex-col items-center rounded px-1 transition-colors hover:bg-white/40"
                  onMouseEnter={() => handleYearHover(storm.year)}
                  onMouseLeave={() => handleYearHover(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    onCellClick(storm.year, "year");
                  }}
                >
                  <div className="text-xs font-bold text-gray-800">{storm.name}</div>
                  <div className="text-[10px] text-gray-600">({storm.year})</div>
                </div>
              ))}
            </div>
          ) : (
            ""
          ),
          className: isInHoveredYear ? "bg-stone-200" : hasStorms ? "bg-blue-300" : "",
          cellClickable: false,
        };
      }

      default:
        return { content: "", className: "", cellClickable: false };
    }
  };

  const getGridCellViewType = (): "storms" | "average" | "highlights" => {
    if (viewType === "average") return "average";
    if (viewType === "storms" || viewType === "distance") return "storms";
    return "highlights";
  };

  return (
    <PositionGrid
      showHeader={false}
      renderCell={(position, _row, col) => {
        const { content, className, cellClickable } = renderCellContent(position);
        const stormNames = getStormNamesForPosition(position);

        return (
          <GridCell
            key={col}
            onClick={() => onCellClick(position, "position")}
            content={content}
            className={className}
            isClickable={cellClickable}
            stormNames={stormNames}
            viewType={getGridCellViewType()}
          />
        );
      }}
    />
  );
};

export default StormGrid;
