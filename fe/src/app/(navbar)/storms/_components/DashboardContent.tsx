import { useMemo } from "react";
import { calculateAverage, getGroupedStorms } from "../_utils/fns";
import AverageView from "./_views/AverageView";
import DistanceView from "./_views/DistanceView";
import HighlightsView from "./_views/HighlightsView";
import StormsView from "./_views/StormsView";
import type { Storm, DashboardParams } from "../../../../types";

interface DashboardContentProps {
  params: DashboardParams;
  stormsData: Storm[];
  onCellClick: (data: number | string, key: string) => void;
}

const DashboardContent = ({ params, stormsData, onCellClick }: DashboardContentProps) => {
  const averageValues = useMemo(() => {
    if (params.view !== "average" && params.view !== "storms") return null;
    const positionGroups = getGroupedStorms(stormsData, "position");
    const values: Record<number, number> = {};
    Object.entries(positionGroups).forEach(([position, storms]) => {
      values[Number(position)] = calculateAverage(storms);
    });
    return values;
  }, [stormsData, params.view]);

  switch (params.view) {
    case "storms":
      return (
        <StormsView
          params={params}
          stormsData={stormsData}
          averageValues={averageValues}
          onCellClick={onCellClick}
        />
      );
    case "highlights":
      return <HighlightsView params={params} stormsData={stormsData} onCellClick={onCellClick} />;
    case "average":
      return (
        <AverageView
          params={params}
          stormsData={stormsData}
          averageValues={averageValues}
          onCellClick={onCellClick}
        />
      );
    case "distance":
      return <DistanceView params={params} stormsData={stormsData} onCellClick={onCellClick} />;
    default:
      return <div className="text-center text-gray-500">Select filters to view data</div>;
  }
};

export default DashboardContent;
