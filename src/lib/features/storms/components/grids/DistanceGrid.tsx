import type { Storm } from "@/lib/types";
import { getDistanceColor } from "@/lib/utils/colors";
import { formatDayNumber } from "@/lib/utils/date";
import PositionCellGrid from "./PositionCellGrid";

interface DistanceGridProps {
  stormsData: Storm[];
  distanceValues: Record<number, number> | null;
  dayDistanceValues?: Record<number, number> | null;
  onCellClick: (data: number | string, key: string) => void;
  isClickable?: boolean;
}

const DistanceGrid = ({
  stormsData,
  distanceValues,
  dayDistanceValues = null,
  onCellClick,
  isClickable = true,
}: DistanceGridProps) => (
  <PositionCellGrid
    stormsData={stormsData}
    gridCellViewType="storms"
    onPositionClick={(position) => onCellClick(position, "position")}
    renderCell={(position) => {
      const dist = distanceValues?.[position];
      const color = dist !== undefined ? getDistanceColor(dist) : "#9ca3af";
      const label = dist === undefined ? "—" : dist < 0 ? "N/A" : `${dist.toFixed(2)}y`;
      const days = dayDistanceValues?.[position];
      return {
        content: (
          <div className="text-center" style={{ color }}>
            <div className="text-sm font-bold">{label}</div>
            {days !== undefined && days >= 0 && (
              <div className="text-xs">{formatDayNumber(days)}d</div>
            )}
          </div>
        ),
        className: "",
        clickable: isClickable,
      };
    }}
  />
);

export default DistanceGrid;
