import { useState, useMemo } from "react";
import { getHighlights } from "../../_utils/fns";
import type { Storm } from "../../../../../types";
import GridCell from "./GridCell";

interface AverageYearGridViewProps {
  stormsData: Storm[];
  onCellClick: (data: number | string, key: string) => void;
}

const ROWS = 10;
const COLS = 14;

const AverageYearGridView = ({ stormsData, onCellClick }: AverageYearGridViewProps) => {
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);

  const highlights = useMemo(() => getHighlights(stormsData, "first"), [stormsData]);

  const cellMap = useMemo<Record<number, Storm[]>>(() => {
    const result: Record<number, Storm[]> = {};
    highlights.forEach((s) => {
      if (!result[s.position]) result[s.position] = [];
      result[s.position].push(s);
    });
    return result;
  }, [highlights]);

  const yearPositions = useMemo<Record<number, Set<number>>>(() => {
    const result: Record<number, Set<number>> = {};
    stormsData.forEach((s) => {
      if (!result[s.year]) result[s.year] = new Set();
      result[s.year].add(s.position);
    });
    return result;
  }, [stormsData]);

  const columnWidth = `${100 / COLS}%`;

  return (
    <div className="overflow-x-auto">
      <table className="mx-auto min-w-full border-collapse">
        <colgroup>
          {[...Array(COLS)].map((_, i) => (
            <col key={i} style={{ width: columnWidth }} />
          ))}
        </colgroup>
        <tbody>
          {[...Array(ROWS)].map((_, row) => (
            <tr key={row}>
              {[...Array(COLS)].map((_, col) => {
                const position = row * COLS + col + 1;
                const storms = cellMap[position] ?? [];
                const hasStorms = storms.length > 0;
                const isInHoveredYear =
                  hoveredYear !== null && yearPositions[hoveredYear]?.has(position);

                const className = isInHoveredYear ? "bg-stone-200" : hasStorms ? "bg-blue-300" : "";

                const content = hasStorms ? (
                  <div className="flex flex-col items-center gap-1">
                    {storms.map((storm) => (
                      <div
                        key={`${storm.name}-${storm.year}`}
                        className="flex cursor-pointer flex-col items-center rounded px-1 transition-colors hover:bg-white/40"
                        onMouseEnter={() => setHoveredYear(storm.year)}
                        onMouseLeave={() => setHoveredYear(null)}
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
                );

                return (
                  <GridCell
                    key={col}
                    onClick={() => {}}
                    content={content}
                    className={className}
                    isClickable={false}
                    stormNames={storms.map((s) => s.name)}
                    viewType="highlights"
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

export default AverageYearGridView;
