import type { Storm } from "@/lib/types";
import { useState } from "react";
import YearHighlightsGrid from "../_widgets/grids/YearHighlightsGrid";
import { SPECIAL_POSITIONS } from "../../_utils/fns";

interface AverageYearGridProps {
  stormsData: Storm[];
  onCellClick: (data: number | string, key: string) => void;
}

const AverageYearGrid = ({ stormsData, onCellClick }: AverageYearGridProps) => {
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);

  const specialPositions = SPECIAL_POSITIONS.map(({ id, label }) => {
    const years = new Set(stormsData.filter((s) => s.position === id).map((s) => s.year));
    return { id, label, years };
  });

  return (
    <div>
      <div className="mb-6 flex flex-wrap justify-center gap-4">
        <div className="mr-2 self-start pt-2 text-sm font-semibold text-muted">Other Regions:</div>
        {specialPositions.map(({ id, label, years }) => {
          const isHighlighted = hoveredYear !== null && years.has(hoveredYear);
          return (
            <div
              key={id}
              className={`cursor-default rounded border px-4 py-2 text-sm font-semibold transition-colors ${
                isHighlighted
                  ? "border-stone-400 bg-stone-200 text-muted"
                  : "border-stone-300 text-muted"
              }`}
            >
              {label}
            </div>
          );
        })}
      </div>
      <YearHighlightsGrid
        stormsData={stormsData}
        onCellClick={onCellClick}
        onYearHover={setHoveredYear}
      />
    </div>
  );
};

export default AverageYearGrid;
