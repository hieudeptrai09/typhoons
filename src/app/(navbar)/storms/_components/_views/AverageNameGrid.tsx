import type { Storm } from "@/lib/types";
import { useMemo } from "react";
import SpecialNamesListDiv from "../_widgets/SpecialNamesListDiv";
import NamesGrid from "../_widgets/grids/NamesGrid";
import { calculateAverage, getGroupedStorms } from "../../_utils/fns";

interface AverageNameGridProps {
  stormsData: Storm[];
  onCellClick: (data: number | string, key: string) => void;
}

const AverageNameGrid = ({ stormsData, onCellClick }: AverageNameGridProps) => {
  const nameAverageValues = useMemo<Record<string, number>>(() => {
    const result: Record<string, number> = {};
    Object.entries(getGroupedStorms(stormsData, "name")).forEach(([name, storms]) => {
      result[name] = calculateAverage(storms);
    });
    return result;
  }, [stormsData]);

  return (
    <div className="flex flex-col gap-6">
      <NamesGrid
        stormsData={stormsData}
        onCellClick={onCellClick}
        nameAverageValues={nameAverageValues}
      />
      <SpecialNamesListDiv
        stormsData={stormsData}
        nameAverageValues={nameAverageValues}
        onNameClick={(name) => onCellClick(name, "name")}
      />
    </div>
  );
};

export default AverageNameGrid;
