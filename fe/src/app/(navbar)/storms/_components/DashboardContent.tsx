import { useMemo } from "react";
import SortableTable from "../../../../components/SortableTable";
import { INTENSITY_RANK, TEXT_COLOR_WHITE_BACKGROUND } from "../../../../constants";
import { createRenderCell } from "../../../../containers/utils/cellRenderers";
import {
  getHighlights,
  getIntensityFromNumber,
  calculateAverage,
  getGroupedStorms,
} from "../_utils/fns";
import SpecialButtons from "./SpecialButtons";
import StormGrid from "./StormGrid";
import type { Storm, DashboardParams, TableColumn } from "../../../../types";

interface DashboardContentProps {
  params: DashboardParams;
  stormsData: Storm[];
  onCellClick: (data: number | string, key: string) => void;
}

interface NameData {
  name: string;
  country: string;
  position: number;
  count: number;
  avgIntensity: number;
  year: number;
}

interface AverageData {
  year?: number;
  country?: string;
  name?: string;
  position?: number;
  count: number;
  average: string;
  avgNumber: number;
}

const renderStormGridWithButtons = (
  onCellClick: (data: number | string, key: string) => void,
  viewType: "storms" | "average" | "highlights",
  averageValues: Record<number, number> | null,
  stormsData: Storm[],
  highlightedStorms?: Storm[],
  highlightType?: string,
) => (
  <div>
    {viewType !== "highlights" && (
      <SpecialButtons
        onCellClick={onCellClick}
        isAverageView={viewType === "average"}
        averageValues={averageValues}
      />
    )}
    <StormGrid
      viewType={viewType}
      onCellClick={onCellClick}
      stormsData={stormsData}
      averageValues={averageValues}
      highlightedStorms={highlightedStorms}
      highlightType={highlightType}
      isClickable={viewType !== "highlights"}
    />
  </div>
);

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
  const groupedStorms = useMemo(() => {
    let filteredData = stormsData;
    if (params.filter === "year") {
      filteredData = stormsData.filter((storm) => parseInt(storm.year.toString()) >= 2000);
    }
    return getGroupedStorms(filteredData, params.filter);
  }, [stormsData, params.filter]);

  const averageValues = useMemo(() => {
    if (params.view !== "average" || params.mode !== "table") return null;
    const positionGroups = getGroupedStorms(stormsData, "position");
    const values: Record<number, number> = {};
    Object.entries(positionGroups).forEach(([position, storms]) => {
      values[Number(position)] = calculateAverage(storms);
    });
    return values;
  }, [stormsData, params.view, params.mode]);

  if (params.view === "storms" && params.mode === "table") {
    return renderStormGridWithButtons(onCellClick, "storms", null, stormsData);
  }

  if (params.view === "average" && params.mode === "table") {
    return renderStormGridWithButtons(onCellClick, "average", averageValues, stormsData);
  }

  if (params.view === "highlights" && params.mode === "table") {
    const highlights = getHighlights(stormsData, params.filter);
    return renderStormGridWithButtons(
      onCellClick,
      "highlights",
      null,
      stormsData,
      highlights,
      params.filter,
    );
  }

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

    // Define color config based on avgIntensity
    const getCellConfig = (row: NameData, key: keyof NameData) => {
      if (key === "name") {
        const intensityLabel = getIntensityFromNumber(row.avgIntensity);
        const textColor = TEXT_COLOR_WHITE_BACKGROUND[intensityLabel];
        return { className: "font-bold", style: { color: textColor } };
      }
      return {};
    };

    const renderCell = createRenderCell<NameData>(getCellConfig);

    return (
      <SortableTable
        data={nameData}
        columns={getStormNameColumns()}
        onRowClick={(row) => {
          if (typeof row.name === "string") {
            onCellClick(row.name, "name");
          }
        }}
        renderCell={renderCell}
      />
    );
  }

  if (params.view === "highlights") {
    const highlights = getHighlights(stormsData, params.filter);
    const highlightData = highlights.map((s) => ({
      name: s.name,
      year: s.year,
      intensity: s.intensity,
      position: s.position,
    }));

    // No special config needed - use default
    const renderCell = createRenderCell<(typeof highlightData)[0]>();

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
        renderCell={renderCell}
      />
    );
  }

  if (params.view === "average") {
    const data = transformAverageData(groupedStorms, params.filter);

    // Define color config for average column
    const getCellConfig = (row: AverageData, key: keyof AverageData) => {
      if (key === "average") {
        const intensityLabel = getIntensityFromNumber(row.avgNumber);
        const textColor = TEXT_COLOR_WHITE_BACKGROUND[intensityLabel];
        return { style: { color: textColor } };
      }
      return {};
    };

    const renderCell = createRenderCell<AverageData>(getCellConfig);

    return (
      <SortableTable
        data={data}
        columns={getAverageColumns(params.filter)}
        onRowClick={(row) => {
          const value = row[params.filter as keyof typeof row];
          console.log(value);
          if (value !== undefined) {
            onCellClick(value as number | string, params.filter);
          }
        }}
        renderCell={renderCell}
      />
    );
  }

  return <div className="text-center text-gray-500">Select filters to view data</div>;
};

export default DashboardContent;
