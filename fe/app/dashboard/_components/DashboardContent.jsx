import { StormGrid } from "./StormGrid";
import SortableTable from "../../../components/SortableTable";
import { SpecialButtons } from "./SpecialButtons";
import {
  getStrongestPerYear,
  getFirstPerYear,
  getAverageByPosition,
  getAverageByName,
  getIntensityFromNumber,
  getPositionTitle,
} from "../utils/fns";
import IntensityBadge from "../../../components/IntensityBadge";
import {
  getRank,
  getWhiteTextcolor,
  intensityRank,
} from "../../../containers/utils/intensity";

export const DashboardContent = ({ params, stormsData, onCellClick }) => {
  if (params.view === "storms" && params.mode === "table") {
    return (
      <div>
        <StormGrid cellData={{}} onCellClick={onCellClick} isClickable={true} />
        <SpecialButtons onCellClick={onCellClick} />
      </div>
    );
  }

  if (params.view === "highlights") {
    const highlights =
      params.filter === "strongest"
        ? getStrongestPerYear(stormsData)
        : getFirstPerYear(stormsData);

    if (params.mode === "table") {
      const cellData = {};

      // First, set all cells to empty string
      for (let i = 1; i <= 140; i++) {
        cellData[i] = { content: "", highlighted: false };
      }

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
            position: s.position,
          }))}
          columns={[
            { key: "name", label: "Name" },
            { key: "year", label: "Year" },
            {
              key: "intensity",
              label: "Intensity",
              title: JSON.stringify(intensityRank),
            },
            { key: "position", label: "Position" },
          ]}
          renderCell={(row, col) => {
            if (col.key === "intensity") {
              return <IntensityBadge intensity={row.intensity} />;
            }
            return row[col.key];
          }}
        />
      );
    }
  }

  if (params.view === "average") {
    if (params.filter === "by position") {
      const positionAvg = getAverageByPosition(stormsData);

      if (params.mode === "table") {
        return (
          <div>
            <StormGrid
              cellData={{}}
              onCellClick={onCellClick}
              isClickable={true}
            />
            <SpecialButtons onCellClick={onCellClick} />
          </div>
        );
      } else {
        const data = Object.entries(positionAvg).map(([pos, storms]) => {
          const avgValue =
            storms.reduce((sum, s) => sum + getRank(s.intensity), 0) /
            storms.length;
          return {
            position: parseInt(pos),
            count: storms.length,
            average: avgValue.toFixed(2),
            avgNumber: avgValue,
          };
        });
        return (
          <SortableTable
            data={data}
            columns={[
              { key: "position", label: "Position" },
              { key: "count", label: "Count" },
              {
                key: "average",
                label: "Average Intensity",
                title: JSON.stringify(intensityRank),
              },
            ]}
            onRowClick={(row) => onCellClick(row.position, "position")}
            renderCell={(row, col) => {
              if (col.key === "average") {
                const intensityLabel = getIntensityFromNumber(row.avgNumber);
                const textColor = getWhiteTextcolor(intensityLabel);
                return (
                  <span className="font-semibold" style={{ color: textColor }}>
                    {row.average}
                  </span>
                );
              }
              if (col.key === "position") {
                return getPositionTitle(row.position);
              }
              return row[col.key];
            }}
          />
        );
      }
    } else if (params.filter === "by name") {
      const nameAvg = getAverageByName(stormsData);
      const data = Object.entries(nameAvg).map(([name, storms]) => {
        // All storms with the same name have the same position
        const position = storms[0].position;
        const avgValue =
          storms.reduce((sum, s) => sum + getRank(s.intensity), 0) /
          storms.length;
        return {
          name,
          count: storms.length,
          position: position,
          average: avgValue.toFixed(2),
          avgNumber: avgValue,
        };
      });

      return (
        <SortableTable
          data={data}
          columns={[
            { key: "name", label: "Name" },
            { key: "count", label: "Count" },
            { key: "position", label: "Position" },
            {
              key: "average",
              label: "Average Intensity",
              title: JSON.stringify(intensityRank),
            },
          ]}
          onRowClick={(row) => {
            onCellClick(row.name, "name");
          }}
          renderCell={(row, col) => {
            if (col.key === "average") {
              const intensityLabel = getIntensityFromNumber(row.avgNumber);
              const textColor = getWhiteTextcolor(intensityLabel);
              return (
                <span className="font-semibold" style={{ color: textColor }}>
                  {row.average}
                </span>
              );
            }
            if (col.key === "position") {
              return getPositionTitle(row.position);
            }
            return row[col.key];
          }}
        />
      );
    }
  }

  return (
    <div className="text-center text-gray-500">Select filters to view data</div>
  );
};
