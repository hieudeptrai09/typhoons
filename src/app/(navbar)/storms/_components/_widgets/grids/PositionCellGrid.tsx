import PositionGrid from "@/lib/components/PositionGrid";
import type { Storm } from "@/lib/types";
import type { ReactNode } from "react";
import GridCell from "./GridCell";

export interface CellRender {
  content: ReactNode;
  className: string;
  clickable: boolean;
}

interface PositionCellGridProps {
  stormsData: Storm[];
  /** Which GridCell styling variant to use (drives the storm-name overlay). */
  gridCellViewType: "storms" | "average" | "highlights";
  /** Produces the content, background class, and clickability for a position's cell. */
  renderCell: (position: number) => CellRender;
  /** Called when a clickable cell is activated. Omit for variants with non-clickable cells. */
  onPositionClick?: (position: number) => void;
}

const getStormNamesForPosition = (stormsData: Storm[], position: number): string[] => {
  if (!stormsData || stormsData.length === 0) return [];
  const storms = stormsData.filter((storm) => storm.position === position);
  return [...new Set(storms.map((storm) => storm.name))];
};

/**
 * Thin grid shell shared by every storms/average/distance/name/highlight grid.
 * It wires PositionGrid to GridCell and the storm-name overlay; each variant
 * supplies only its per-cell content via `renderCell`.
 */
const PositionCellGrid = ({
  stormsData,
  gridCellViewType,
  renderCell,
  onPositionClick,
}: PositionCellGridProps) => (
  <PositionGrid
    showHeader={false}
    renderCell={(position, _row, col) => {
      const { content, className, clickable } = renderCell(position);
      const stormNames = getStormNamesForPosition(stormsData, position);

      return (
        <GridCell
          key={col}
          onClick={() => onPositionClick?.(position)}
          content={content}
          className={className}
          isClickable={clickable}
          stormNames={stormNames}
          viewType={gridCellViewType}
        />
      );
    }}
  />
);

export default PositionCellGrid;
