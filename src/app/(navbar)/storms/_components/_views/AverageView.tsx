import type { DashboardParams, Storm } from "@/lib/types";
import AverageListTable from "./AverageListTable";
import AverageNameGrid from "./AverageNameGrid";
import AveragePositionGrid from "./AveragePositionGrid";
import AverageYearGrid from "./AverageYearGrid";

interface AverageViewProps {
  params: DashboardParams;
  stormsData: Storm[];
  averageValues: Record<number, number> | null;
  onCellClick: (data: number | string, key: string) => void;
}

const AverageView = ({ params, stormsData, averageValues, onCellClick }: AverageViewProps) => {
  const { filter, mode } = params;

  // Table mode renders a position grid, with name and year getting bespoke grids.
  // (country and month are list-only, so they fall through to the list table.)
  if (mode === "table") {
    if (filter === "name") {
      return <AverageNameGrid stormsData={stormsData} onCellClick={onCellClick} />;
    }
    if (filter === "year") {
      return <AverageYearGrid stormsData={stormsData} onCellClick={onCellClick} />;
    }
    return (
      <AveragePositionGrid
        stormsData={stormsData}
        averageValues={averageValues}
        onCellClick={onCellClick}
      />
    );
  }

  // List mode (position / name / country / year / month) → sortable average table.
  return <AverageListTable filter={filter} stormsData={stormsData} onCellClick={onCellClick} />;
};

export default AverageView;
