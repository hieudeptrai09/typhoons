import { useMemo } from "react";
import { StormGrid } from "./StormGrid";
import SortableTable from "../../../../components/SortableTable";
import { SpecialButtons } from "./SpecialButtons";
import {
  getHighlights,
  getIntensityFromNumber,
  getPositionTitle,
  calculateAverage,
  getGroupedStorms,
} from "../_utils/fns";
import IntensityBadge from "../../../../components/IntensityBadge";
import {
  TEXT_COLOR_WHITE_BACKGROUND,
  INTENSITY_RANK,
} from "../../../../constants";

const renderStormGridWithButtons = (
  onCellClick,
  cellData,
  isAverageView,
  averageValues,
  stormsData
) => (
  <div>
    <StormGrid
      cellData={cellData}
      onCellClick={onCellClick}
      isClickable={true}
      isAverageView={isAverageView}
      stormsData={stormsData}
    />
    <SpecialButtons
      onCellClick={onCellClick}
      isAverageView={isAverageView}
      averageValues={averageValues}
    />
  </div>
);

const createCellData = (
  viewType,
  highlightedData = null,
  averageValues = null
) => {
  const cellData = {};

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
    const stormsByPosition = highlightedData.reduce((acc, storm) => {
      if (!acc[storm.position]) acc[storm.position] = [];
      acc[storm.position].push(storm);
      return acc;
    }, {});

    Object.entries(stormsByPosition).forEach(([position, storms]) => {
      cellData[position] = {
        content: (
          <div className="flex flex-col items-center gap-1">
            {storms.map((storm, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="text-xs font-bold text-gray-800">
                  {storm.name}
                </div>
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
      cellData[position] = {
        content: `${position}`,
        highlighted: false,
        avgNumber: avgValue,
      };
    });
  }

  return cellData;
};

const renderIntensityCell = (avgNumber, displayValue) => {
  const intensityLabel = getIntensityFromNumber(avgNumber);
  const textColor = TEXT_COLOR_WHITE_BACKGROUND[intensityLabel];
  return (
    <span className="font-semibold" style={{ color: textColor }}>
      {displayValue}
    </span>
  );
};

const createAverageCellRenderer = (row, col) => {
  if (col.key === "average") {
    return renderIntensityCell(row.avgNumber, row.average);
  }
  if (col.key === "position") {
    return getPositionTitle(row.position);
  }
  return row[col.key];
};

const transformAverageData = (dataMap, filterType) => {
  return Object.entries(dataMap).map(([key, storms]) => {
    const avgValue = calculateAverage(storms);
    const baseData = {
      count: storms.length,
      average: avgValue.toFixed(2),
      avgNumber: avgValue,
    };

    const dataTypeMap = {
      year: { year: parseInt(key) },
      country: { country: key },
      name: {
        name: key,
        country: storms[0].country,
        position: storms[0].position,
      },
      position: { position: parseInt(key), country: storms[0].country },
    };

    return { ...dataTypeMap[filterType], ...baseData };
  });
};

const getAverageColumns = (filterType) => {
  const columnMap = {
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

export const DashboardContent = ({ params, stormsData, onCellClick }) => {
  // Compute grouped storms based on filter
  const groupedStorms = useMemo(() => {
    return getGroupedStorms(stormsData, params.filter);
  }, [stormsData, params.filter]);

  // Compute average values for positions (only for table view)
  const averageValues = useMemo(() => {
    if (params.view !== "average" || params.mode !== "table") return null;

    const positionGroups = getGroupedStorms(stormsData, "position");
    const values = {};
    Object.entries(positionGroups).forEach(([position, storms]) => {
      values[position] = calculateAverage(storms);
    });
    return values;
  }, [stormsData, params.view, params.mode]);

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
      stormsData
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
            title: JSON.stringify(INTENSITY_RANK),
          },
          { key: "position", label: "Position" },
        ]}
        renderCell={(row, col) =>
          col.key === "intensity" ? (
            <IntensityBadge intensity={row.intensity} />
          ) : (
            row[col.key]
          )
        }
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
          onCellClick(row[params.filter], params.filter);
        }}
        renderCell={createAverageCellRenderer}
      />
    );
  }

  return (
    <div className="text-center text-gray-500">Select filters to view data</div>
  );
};
