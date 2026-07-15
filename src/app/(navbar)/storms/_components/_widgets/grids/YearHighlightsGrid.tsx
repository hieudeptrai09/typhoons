import type { Storm } from "@/lib/types";
import { onEnterKeyDown } from "@/lib/utils/a11y";
import { useMemo, useState } from "react";
import { getHighlights } from "../../../_utils/fns";
import PositionCellGrid from "./PositionCellGrid";

interface YearHighlightsGridProps {
  stormsData: Storm[];
  onCellClick: (data: number | string, key: string) => void;
  onYearHover?: (year: number | null) => void;
}

const YearHighlightsGrid = ({ stormsData, onCellClick, onYearHover }: YearHighlightsGridProps) => {
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);

  const handleYearHover = (year: number | null) => {
    setHoveredYear(year);
    onYearHover?.(year);
  };

  const yearHighlightCellMap = useMemo<Record<number, Storm[]>>(() => {
    const highlights = getHighlights(stormsData, "first");
    const result: Record<number, Storm[]> = {};
    highlights.forEach((s) => {
      if (!result[s.position]) result[s.position] = [];
      result[s.position].push(s);
    });
    return result;
  }, [stormsData]);

  const yearPositions = useMemo<Record<number, Set<number>>>(() => {
    const result: Record<number, Set<number>> = {};
    stormsData.forEach((s) => {
      if (!result[s.year]) result[s.year] = new Set();
      result[s.year].add(s.position);
    });
    return result;
  }, [stormsData]);

  return (
    <PositionCellGrid
      stormsData={stormsData}
      gridCellViewType="highlights"
      renderCell={(position) => {
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
                  role="button"
                  tabIndex={0}
                  aria-label={`View details for ${storm.name} ${storm.year}`}
                  onMouseEnter={() => handleYearHover(storm.year)}
                  onMouseLeave={() => handleYearHover(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    onCellClick(storm.year, "year");
                  }}
                  onKeyDown={onEnterKeyDown(() => onCellClick(storm.year, "year"))}
                >
                  <div className="text-xs font-bold text-foreground">{storm.name}</div>
                  <div className="text-[10px] text-foreground">({storm.year})</div>
                </div>
              ))}
            </div>
          ) : (
            ""
          ),
          className: isInHoveredYear ? "bg-stone-200" : hasStorms ? "bg-blue-300" : "",
          clickable: false,
        };
      }}
    />
  );
};

export default YearHighlightsGrid;
