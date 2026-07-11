import type { Storm } from "@/lib/types";
import { TEXT_COLOR_WHITE_BACKGROUND } from "@/lib/utils/colors";
import { useMemo } from "react";
import { calculateAverage, getIntensityFromNumber, sortNamesByFirstYear } from "../../../_utils/fns";
import PositionCellGrid from "./PositionCellGrid";

interface NamesGridProps {
  stormsData: Storm[];
  onCellClick: (data: number | string, key: string) => void;
  nameAverageValues?: Record<string, number>;
}

const NamesGrid = ({ stormsData, onCellClick, nameAverageValues }: NamesGridProps) => {
  const stormsByPosition = useMemo<Record<number, Storm[]>>(
    () =>
      stormsData.reduce<Record<number, Storm[]>>((acc, storm) => {
        if (!acc[storm.position]) acc[storm.position] = [];
        acc[storm.position].push(storm);
        return acc;
      }, {}),
    [stormsData],
  );

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

  return (
    <PositionCellGrid
      stormsData={stormsData}
      gridCellViewType="highlights"
      renderCell={(position) => {
        const names = getPositionNames(position);
        return {
          content:
            names.length === 0 ? (
              <span className="text-xs text-gray-300">—</span>
            ) : (
              <div className="flex w-full flex-col items-center justify-center gap-0 px-1 md:gap-0.5">
                {names.map(({ name, color }, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      onCellClick(name, "name");
                    }}
                    className="flex min-h-11 w-full cursor-pointer items-center justify-center text-center text-xs leading-tight font-semibold hover:underline md:min-h-0"
                    style={{ color, background: "none", border: "none", padding: 0 }}
                  >
                    {name}
                  </button>
                ))}
              </div>
            ),
          className: "",
          clickable: false,
        };
      }}
    />
  );
};

export default NamesGrid;
