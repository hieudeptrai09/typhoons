import { useMemo } from "react";
import type { ReactNode } from "react";
import IntensityBadge from "../../../../components/IntensityBadge";
import SortableTable from "../../../../components/SortableTable";
import { TEXT_COLOR_WHITE_BACKGROUND, INTENSITY_RANK } from "../../../../constants";
import {
  getHighlights,
  getIntensityFromNumber,
  getPositionTitle,
  calculateAverage,
  getGroupedStorms,
} from "../_utils/fns";
import SpecialButtons from "./SpecialButtons";
import StormGrid from "./StormGrid";
import type {
  Storm,
  DashboardParams,
  AverageData,
  NameData,
  TableColumn,
  IntensityType,
} from "../../../../types";

interface DashboardContentProps {
  params: DashboardParams;
  stormsData: Storm[];
  onCellClick: (data: number | string, key: string) => void;
}

interface CellData {
  content: ReactNode;
  highlighted: boolean;
  avgNumber: number | null;
}

const renderStormGridWithButtons = (
  onCellClick: (data: number | string, key: string) => void,
  cellData: Record<number, CellData>,
  isAverageView: boolean,
  averageValues: Record<number, number> | null,
  stormsData: Storm[],
) => (
  <div>
    <SpecialButtons
      onCellClick={onCellClick}
      isAverageView={isAverageView}
      averageValues={averageValues}
    />
    <StormGrid
      cellData={cellData}
      onCellClick={onCellClick}
      isClickable={true}
      isAverageView={isAverageView}
      stormsData={stormsData}
    />
  </div>
);

const createCellData = (
  viewType: string,
  highlightedData: Storm[] | null = null,
  averageValues: Record<number, number> | null = null,
): Record<number, CellData> => {
  const cellData: Record<number, CellData> = {};

  // Initialize first 140 cells based on view type
  for (let i = 1; i <= 140; i++) {
    cellData[i] = {
      content: viewType === "highlights" ? "" : `${i}`,
      highlighted: false,
      avgNumber: null,
    };
  }

  // Handle different view types
  if (viewType === "highlights" && highlightedData) {
    const stormsByPosition: Record<number, Storm[]> = highlightedData.reduce(
      (acc, storm) => {
        if (!acc[storm.position]) acc[storm.position] = [];
        acc[storm.position].push(storm);
        return acc;
      },
      {} as Record<number, Storm[]>,
    );

    Object.entries(stormsByPosition).forEach(([position, storms]) => {
      cellData[Number(position)] = {
        content: (
          <div className="flex flex-col items-center gap-1">
            {storms.map((storm, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="text-xs font-bold text-gray-800">{storm.name}</div>
                <div className="text-[10px] text-gray-600">({storm.year})</div>
              </div>
            ))}
          </div>
        ),
        highlighted: true,
        avgNumber: null,
      };
    });
  } else if (viewType === "average" && averageValues) {
    Object.entries(averageValues).forEach(([position, avgValue]) => {
      cellData[Number(position)] = {
        content: `${position}`,
        highlighted: false,
        avgNumber: avgValue,
      };
    });
  }

  return cellData;
};

const renderIntensityCell = (avgNumber: number, displayValue: string) => {
  const intensityLabel = getIntensityFromNumber(avgNumber);
  const textColor = TEXT_COLOR_WHITE_BACKGROUND[intensityLabel];
  return (
    <span className="font-semibold" style={{ color: textColor }}>
      {displayValue}
    </span>
  );
};

const transformAverageData = (
  dataMap: Record<string, Storm[]>,
  filterType: string,
): AverageData[] => {
  return Object.entries(dataMap).map(([key, storms]) => {
    const avgValue = calculateAverage(storms);
    const baseData = {
      count: storms.length,
      average: avgValue.toFixed(2),
      avgNumber: avgValue,
    };

    const dataTypeMap: Record<string, Partial<AverageData>> = {
      year: { year: parseInt(key) },
      country: { country: key },
      name: {
        name: key,
        country: storms[0].country,
        position: storms[0].position,
      },
      position: { position: parseInt(key), country: storms[0].country },
    };

    return { ...dataTypeMap[filterType], ...baseData } as AverageData;
  });
};

const getAverageColumns = (filterType: string): TableColumn<AverageData>[] => {
  const columnMap: Record<string, TableColumn<AverageData>[]> = {
    year: [
      { key: "year", label: "Year" },
      { key: "count", label: "Count" },
    ],
    country: [
      { key: "country", label: "Country" },
      { key: "count", label: "Count" },
    ],
    name: [
      { key: "name", label: "Name" },
      { key: "country", label: "Country" },
      { key: "count", label: "Count" },
      { key: "position", label: "Position" },
    ],
    position: [
      { key: "position", label: "Position" },
      { key: "country", label: "Country" },
      { key: "count", label: "Count" },
    ],
  };

  const columns = [...columnMap[filterType]];

  // Add average intensity for all
  columns.push({
    key: "average",
    label: "Average Intensity",
    title: JSON.stringify(INTENSITY_RANK),
  });

  return columns;
};

const getStormNameColumns = (): TableColumn<NameData>[] => {
  return [
    { key: "name", label: "Name" },
    { key: "country", label: "Country" },
    { key: "position", label: "Position" },
    { key: "count", label: "Storm Count" },
    { key: "year", label: "Last Year" },
  ];
};

const DashboardContent = ({ params, stormsData, onCellClick }: DashboardContentProps) => {
  // Compute grouped storms based on filter
  const groupedStorms = useMemo(() => {
    let filteredData = stormsData;
    if (params.filter === "year") {
      filteredData = stormsData.filter((storm) => parseInt(storm.year.toString()) >= 2000);
    }

    return getGroupedStorms(filteredData, params.filter);
  }, [stormsData, params.filter]);

  // Compute average values for positions (only for table view)
  const averageValues = useMemo(() => {
    if (params.view !== "average" || params.mode !== "table") return null;

    const positionGroups = getGroupedStorms(stormsData, "position");
    const values: Record<number, number> = {};
    Object.entries(positionGroups).forEach(([position, storms]) => {
      values[Number(position)] = calculateAverage(storms);
    });
    return values;
  }, [stormsData, params.view, params.mode]);

  // Handle storms view in list mode - show all names
  if (params.view === "storms" && params.mode === "list") {
    const nameGroups = getGroupedStorms(stormsData, "name");
    const nameData: NameData[] = Object.entries(nameGroups).map(([name, storms]) => {
      const avgIntensity = calculateAverage(storms);
      return {
        name,
        country: storms[0].country,
        position: storms[0].position,
        count: storms.length,
        avgIntensity,
        year: storms[storms.length - 1].year,
      };
    });

    return (
      <SortableTable
        data={nameData}
        columns={getStormNameColumns()}
        onRowClick={(row) => {
          const name = row.name;
          if (typeof name === "string") {
            onCellClick(name, "name");
          }
        }}
        renderCell={(row, col): ReactNode => {
          if (col.key === "name" && typeof row.name === "string") {
            const avgInt = typeof row.avgIntensity === "number" ? row.avgIntensity : 0;
            const intensityLabel = getIntensityFromNumber(avgInt);
            const textColor = TEXT_COLOR_WHITE_BACKGROUND[intensityLabel];
            return (
              <span className="font-bold" style={{ color: textColor }}>
                {row.name}
              </span>
            );
          }
          if (col.key === "position" && typeof row.position === "number") {
            return getPositionTitle(row.position);
          }
          return row[col.key] as ReactNode;
        }}
      />
    );
  }

  if (
    (params.view === "storms" && params.mode === "table") ||
    (params.view === "average" && params.mode === "table")
  ) {
    const cellData =
      params.view === "storms"
        ? createCellData("storms")
        : createCellData("average", null, averageValues);

    return renderStormGridWithButtons(
      onCellClick,
      cellData,
      params.view === "average",
      params.view === "average" ? averageValues : null,
      stormsData,
    );
  }

  if (params.view === "highlights" && params.mode === "table") {
    const highlights = getHighlights(stormsData, params.filter);

    const cellData = createCellData("highlights", highlights);
    return (
      <StormGrid
        cellData={cellData}
        onCellClick={onCellClick}
        highlightType={params.filter}
        isClickable={false}
      />
    );
  }

  // All conditions that render SortableTable (list mode)
  if (params.view === "highlights") {
    const highlights = getHighlights(stormsData, params.filter);

    const highlightData = highlights.map((s) => ({
      name: s.name,
      year: s.year,
      intensity: s.intensity,
      position: s.position,
    }));

    return (
      <SortableTable
        data={highlightData}
        columns={[
          { key: "name", label: "Name" },
          { key: "year", label: "Year" },
          {
            key: "intensity",
            label: "Intensity",
            title: JSON.stringify(INTENSITY_RANK),
          },
          { key: "position", label: "Position" },
        ]}
        renderCell={(row, col): ReactNode => {
          if (col.key === "intensity") {
            const intensity = row.intensity;
            if (typeof intensity === "string" || typeof intensity === "number") {
              return <IntensityBadge intensity={intensity as IntensityType} />;
            }
          }
          return row[col.key] as ReactNode;
        }}
      />
    );
  }

  if (params.view === "average") {
    const data = transformAverageData(groupedStorms, params.filter);

    return (
      <SortableTable
        data={data}
        columns={getAverageColumns(params.filter)}
        onRowClick={(row) => {
          const value = row[params.filter as keyof typeof row];
          if (value !== undefined) {
            onCellClick(value as number | string, params.filter);
          }
        }}
        renderCell={(row, col): ReactNode => {
          if (col.key === "average") {
            const avgNum = typeof row.avgNumber === "number" ? row.avgNumber : 0;
            const avg = typeof row.average === "string" ? row.average : "0";
            return renderIntensityCell(avgNum, avg);
          }
          if (col.key === "position" && typeof row.position === "number") {
            return getPositionTitle(row.position);
          }
          return row[col.key] as ReactNode;
        }}
      />
    );
  }

  return <div className="text-center text-gray-500">Select filters to view data</div>;
};

export default DashboardContent;
