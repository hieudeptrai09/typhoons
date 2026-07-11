import type { Storm } from "@/lib/types";
import AverageGrid from "../_widgets/grids/AverageGrid";
import SpecialButtons from "../_widgets/SpecialButtons";

interface AveragePositionGridProps {
  stormsData: Storm[];
  averageValues: Record<number, number> | null;
  onCellClick: (data: number | string, key: string) => void;
}

const AveragePositionGrid = ({
  stormsData,
  averageValues,
  onCellClick,
}: AveragePositionGridProps) => (
  <div>
    <SpecialButtons onCellClick={onCellClick} isAverageView averageValues={averageValues} />
    <AverageGrid
      onCellClick={onCellClick}
      stormsData={stormsData}
      averageValues={averageValues}
      isClickable
    />
  </div>
);

export default AveragePositionGrid;
