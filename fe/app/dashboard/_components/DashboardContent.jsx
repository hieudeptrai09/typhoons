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

const renderStormGridWithButtons = (onCellClick, cellData, isAverageView) => (
  <div>
    <StormGrid
      cellData={cellData}
      onCellClick={onCellClick}
      isClickable={true}
      isAverageView={isAverageView}
    />
    <SpecialButtons
      onCellClick={onCellClick}
      isAverageView={isAverageView}
      cellData={cellData}
    />
  </div>
);

const calculateAverage = (storms) => {
  const sum = storms.reduce((acc, s) => acc + getRank(s.intensity), 0);
  return sum / storms.length;
};

const createHighlightsCellData = (highlights) => {
  const cellData = {};

  for (let i = 1; i <= 140; i++) {
    cellData[i] = { content: "", highlighted: false };
  }

  const stormsByPosition = highlights.reduce((acc, storm) => {
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
              <div className="font-bold text-gray-800">{storm.name}</div>
              <div className="text-[10px] text-gray-600">({storm.year})</div>
            </div>
          ))}
        </div>
      ),
      highlighted: true,
    };
  });

  return cellData;
};

const renderIntensityCell = (avgNumber, displayValue) => {
  const intensityLabel = getIntensityFromNumber(avgNumber);
  const textColor = getWhiteTextcolor(intensityLabel);
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

const createAverageCellData = (stormsData) => {
  const cellData = {};
  const avgData = getAverageByPosition(stormsData);

  for (let i = 1; i <= 142; i++) {
    cellData[i] = { content: "", avgNumber: null };
  }

  Object.entries(avgData).forEach(([position, storms]) => {
    const avgValue = calculateAverage(storms);
    cellData[position] = {
      content: `#${position}`,
      avgNumber: avgValue,
    };
  });

  return cellData;
};

const transformAverageData = (dataMap, includePosition = false) => {
  return Object.entries(dataMap).map(([key, storms]) => {
    const avgValue = calculateAverage(storms);
    const baseData = {
      count: storms.length,
      average: avgValue.toFixed(2),
      avgNumber: avgValue,
    };

    if (includePosition) {
      // For "by name" view
      return {
        name: key,
        position: storms[0].position,
        ...baseData,
      };
    } else {
      // For "by position" view
      return {
        position: parseInt(key),
        ...baseData,
      };
    }
  });
};

const getAverageColumns = (includeNameAndPosition = false) => {
  const columns = [];

  if (includeNameAndPosition) {
    columns.push(
      { key: "name", label: "Name" },
      { key: "count", label: "Count" },
      { key: "position", label: "Position" }
    );
  } else {
    columns.push(
      { key: "position", label: "Position" },
      { key: "count", label: "Count" }
    );
  }

  columns.push({
    key: "average",
    label: "Average Intensity",
    title: JSON.stringify(intensityRank),
  });

  return columns;
};

export const DashboardContent = ({ params, stormsData, onCellClick }) => {
  if (
    (params.view === "storms" && params.mode === "table") ||
    (params.view === "average" && params.mode === "table")
  ) {
    return renderStormGridWithButtons(
      onCellClick,
      params.view === "storms" ? {} : createAverageCellData(stormsData),
      params.view === "storms" ? false : true
    );
  }

  if (params.view === "highlights" && params.mode === "table") {
    const highlights =
      params.filter === "strongest"
        ? getStrongestPerYear(stormsData)
        : getFirstPerYear(stormsData);

    const cellData = createHighlightsCellData(highlights);
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
    const highlights =
      params.filter === "strongest"
        ? getStrongestPerYear(stormsData)
        : getFirstPerYear(stormsData);

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
    const isByPosition = params.filter === "by position";
    const avgData = isByPosition
      ? getAverageByPosition(stormsData)
      : getAverageByName(stormsData);
    const data = transformAverageData(avgData, !isByPosition);

    return (
      <SortableTable
        data={data}
        columns={getAverageColumns(!isByPosition)}
        onRowClick={(row) =>
          isByPosition
            ? onCellClick(row.position, "position")
            : onCellClick(row.name, "name")
        }
        renderCell={createAverageCellRenderer}
      />
    );
  }

  return (
    <div className="text-center text-gray-500">Select filters to view data</div>
  );
};
