import { StormGrid } from "./StormGrid";
import { SortableTable } from "./SortableTable";
import {
  getStrongestPerYear,
  getFirstPerYear,
  getAverageByPosition,
  getAverageByName,
  intensityRank,
} from "../utils/fns";

export const DashboardContent = ({ params, stormsData, onCellClick }) => {
  if (params.view === "storms" && params.mode === "table") {
    return (
      <StormGrid
        cellData={{}}
        onCellClick={onCellClick}
        showPosition={true}
        isClickable={true}
      />
    );
  }

  if (params.view === "highlights") {
    const highlights =
      params.filter === "strongest"
        ? getStrongestPerYear(stormsData)
        : getFirstPerYear(stormsData);

    if (params.mode === "table") {
      const cellData = {};

      // Group storms by position to handle multiple storms in same cell
      const stormsByPosition = {};
      highlights.forEach((storm) => {
        if (!stormsByPosition[storm.position]) {
          stormsByPosition[storm.position] = [];
        }
        stormsByPosition[storm.position].push(storm);
      });

      // Create cell data with all storms at each position
      Object.entries(stormsByPosition).forEach(([position, storms]) => {
        cellData[position] = {
          content: (
            <div className="flex flex-col items-center gap-1">
              {storms.map((storm, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="font-bold text-gray-800">{storm.name}</div>
                  <div className="text-[10px] text-gray-600">
                    ({storm.year})
                  </div>
                </div>
              ))}
            </div>
          ),
          highlighted: true,
        };
      });

      return (
        <StormGrid
          cellData={cellData}
          onCellClick={onCellClick}
          highlightType={params.filter}
          showPosition={false}
          isClickable={false}
        />
      );
    } else {
      return (
        <SortableTable
          data={highlights.map((s) => ({
            name: s.name,
            year: s.year,
            intensity: s.intensity,
          }))}
          columns={[
            { key: "name", label: "Name" },
            { key: "year", label: "Year" },
            { key: "intensity", label: "Intensity" },
          ]}
        />
      );
    }
  }

  if (params.view === "average") {
    if (params.filter === "by position") {
      const positionAvg = getAverageByPosition(stormsData);

      if (params.mode === "table") {
        return (
          <StormGrid
            cellData={{}}
            onCellClick={onCellClick}
            showPosition={true}
            isClickable={true}
          />
        );
      } else {
        const data = Object.entries(positionAvg).map(([pos, storms]) => ({
          position: parseInt(pos),
          average: (
            storms.reduce(
              (sum, s) => sum + (intensityRank[s.intensity] || 0),
              0
            ) / storms.length
          ).toFixed(2),
        }));
        return (
          <SortableTable
            data={data}
            columns={[
              { key: "position", label: "Position" },
              { key: "average", label: "Average Intensity" },
            ]}
            onRowClick={(row) => onCellClick(row.position)}
          />
        );
      }
    } else if (params.filter === "by name") {
      const nameAvg = getAverageByName(stormsData);
      const data = Object.entries(nameAvg).map(([name, storms]) => ({
        name,
        average: (
          storms.reduce(
            (sum, s) => sum + (intensityRank[s.intensity] || 0),
            0
          ) / storms.length
        ).toFixed(2),
      }));

      return (
        <SortableTable
          data={data}
          columns={[
            { key: "name", label: "Name" },
            { key: "average", label: "Average Intensity" },
          ]}
        />
      );
    }
  }

  return (
    <div className="text-center text-gray-500">Select filters to view data</div>
  );
};
