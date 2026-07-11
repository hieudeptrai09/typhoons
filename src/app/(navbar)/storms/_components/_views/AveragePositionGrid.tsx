import type { Storm } from "@/lib/types";
import SpecialButtons from "../_widgets/SpecialButtons";
import StormGrid from "../_widgets/StormGrid";

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
    <StormGrid
      viewType="average"
      onCellClick={onCellClick}
      stormsData={stormsData}
      averageValues={averageValues}
      isClickable
    />
  </div>
);

export default AveragePositionGrid;
