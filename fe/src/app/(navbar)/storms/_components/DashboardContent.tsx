import { useMemo } from "react";
import type { ReactNode } from "react";
import SortableTable from "../../../../components/components/SortableTable";
import {
  INTENSITY_RANK,
  TEXT_COLOR_WHITE_BACKGROUND,
  COUNTRY_FLAG_COMPONENTS,
} from "../../../../constants";
import { createRenderCell } from "../../../../containers/utils/cellRenderers";
import {
  getHighlights,
  getIntensityFromNumber,
  calculateAverage,
  calculateDistances,
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

interface DistanceData {
  position?: number | string;
  name?: string;
  country?: string;
  count: number;
  distance: string;
  distanceNumber: number;
}

const getDistanceColor = (years: number): string => {
  if (years < 6.0) return "#16a34a"; // green-600
  if (years === 6.0) return "#2563eb"; // blue-600
  return "#dc2626"; // red-600
};

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

const transformDistanceData = (
  distanceMap: Record<string, number>,
  groupedStorms: Record<string, Storm[]>,
  filterType: "position" | "name",
): DistanceData[] => {
  return Object.entries(distanceMap).map(([key, dist]) => {
    const storms = groupedStorms[key] || [];
    const base = {
      count: storms.length,
      distance: dist === 0 ? "N/A" : dist.toFixed(2),
      distanceNumber: dist,
    };
    if (filterType === "position") {
      return {
        position: parseInt(key) || key,
        country: storms[0]?.country || "",
        ...base,
      } as DistanceData;
    }
    return {
      name: key,
      country: storms[0]?.country || "",
      position: storms[0]?.position,
      ...base,
    } as DistanceData;
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

const getDistanceColumns = (filterType: "position" | "name"): TableColumn<DistanceData>[] => {
  const base: TableColumn<DistanceData>[] =
    filterType === "position"
      ? [
          { key: "position", label: "Position" },
          { key: "country", label: "Country" },
          { key: "count", label: "Storm Count" },
        ]
      : [
          { key: "name", label: "Name" },
          { key: "country", label: "Country" },
          { key: "position", label: "Position" },
          { key: "count", label: "Storm Count" },
        ];

  base.push({
    key: "distance",
    label: "Avg Gap (years)",
    title: "Average number of years between consecutive storms in this group",
  });
  return base;
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

// ─── Distance grid (position mode, table) ────────────────────────────────────
interface DistanceGridProps {
  distanceValues: Record<number, number>;
  stormsData: Storm[];
  onCellClick: (position: number, key: string) => void;
}

const DistanceGrid = ({ distanceValues, stormsData, onCellClick }: DistanceGridProps) => {
  const rows = 10;
  const cols = 14;

  const getStormNamesForPosition = (position: number): string[] => {
    const storms = stormsData.filter((s) => s.position === position);
    return [...new Set(storms.map((s) => s.name))];
  };

  return (
    <div className="overflow-x-auto">
      <table className="mx-auto min-w-full border-collapse">
        <colgroup>
          {[...Array(cols)].map((_, idx) => (
            <col key={idx} style={{ width: `${100 / cols}%` }} />
          ))}
        </colgroup>
        <tbody>
          {[...Array(rows)].map((_, row) => (
            <tr key={row}>
              {[...Array(cols)].map((_, col) => {
                const position = row * cols + col + 1;
                const dist = distanceValues[position];
                const color = dist !== undefined ? getDistanceColor(dist) : "#9ca3af";
                const label = dist === undefined ? "—" : dist === 0 ? "N/A" : dist.toFixed(2) + "y";
                const stormNames = getStormNamesForPosition(position);

                return (
                  <td
                    key={col}
                    className="relative cursor-pointer border-2 border-stone-200 p-2 hover:bg-stone-200"
                    onClick={() => onCellClick(position, "position")}
                  >
                    {stormNames.length > 0 && (
                      <div className="absolute top-0 text-[7px] text-stone-100">
                        {stormNames.join(", ")}
                      </div>
                    )}
                    <div
                      title={stormNames.join(", ")}
                      className="relative z-2 flex h-16 w-full items-center justify-center"
                    >
                      <div className="text-center text-sm font-bold" style={{ color }}>
                        {label}
                      </div>
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
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

  // ── distance values for grid (position table mode) ──────────────────────
  const distanceValues = useMemo(() => {
    if (params.view !== "distance") return null;
    const filterType = (params.filter || "position") as "position" | "name";
    const distances = calculateDistances(stormsData, filterType);
    // Convert string keys to numbers for position mode
    if (filterType === "position") {
      const result: Record<number, number> = {};
      Object.entries(distances).forEach(([k, v]) => {
        result[Number(k)] = v;
      });
      return result;
    }
    return distances as unknown as Record<number, number>;
  }, [stormsData, params.view, params.filter]);

  // ── storms view ─────────────────────────────────────────────────────────
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

    const renderCell = (row: NameData, column: TableColumn<NameData>): ReactNode => {
      if (column.key === "name") {
        const intensityLabel = getIntensityFromNumber(row.avgIntensity);
        const textColor = TEXT_COLOR_WHITE_BACKGROUND[intensityLabel];
        return (
          <span className="font-bold" style={{ color: textColor }}>
            {row.name}
          </span>
        );
      }
      if (column.key === "country") {
        const FlagComponent = COUNTRY_FLAG_COMPONENTS[row.country];
        return FlagComponent ? (
          <div
            className="h-7 w-10 overflow-hidden rounded border border-gray-300 shadow-sm"
            title={row.country}
          >
            <FlagComponent className="h-full w-full object-cover" />
          </div>
        ) : (
          <span>{row.country}</span>
        );
      }
      return createRenderCell<NameData>()(row, column);
    };

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

    const renderCell = (row: AverageData, column: TableColumn<AverageData>): ReactNode => {
      if (column.key === "average") {
        const intensityLabel = getIntensityFromNumber(row.avgNumber);
        const textColor = TEXT_COLOR_WHITE_BACKGROUND[intensityLabel];
        return (
          <span className="font-semibold" style={{ color: textColor }}>
            {String(row.average)}
          </span>
        );
      }
      if (column.key === "country") {
        const FlagComponent = COUNTRY_FLAG_COMPONENTS[String(row.country)];
        return FlagComponent ? (
          <div
            className="h-7 w-10 overflow-hidden rounded border border-gray-300 shadow-sm"
            title={String(row.country)}
          >
            <FlagComponent className="h-full w-full object-cover" />
          </div>
        ) : (
          <span>{String(row.country)}</span>
        );
      }
      return createRenderCell<AverageData>()(row, column);
    };

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
        renderCell={renderCell}
      />
    );
  }

  // ── distance view ────────────────────────────────────────────────────────
  if (params.view === "distance") {
    const filterType = (params.filter || "position") as "position" | "name";

    // Table mode: position grid (only valid for position filter)
    if (params.mode === "table" && filterType === "position") {
      const positionDistances = distanceValues as Record<number, number>;
      return (
        <div>
          <SpecialButtons
            onCellClick={onCellClick}
            isAverageView={false}
            averageValues={null}
            distanceValues={positionDistances}
          />
          <DistanceGrid
            distanceValues={positionDistances}
            stormsData={stormsData}
            onCellClick={onCellClick}
          />
        </div>
      );
    }

    // List mode: sortable table
    const distances = calculateDistances(stormsData, filterType);
    const grouped = getGroupedStorms(stormsData, filterType);
    const data = transformDistanceData(distances, grouped, filterType);

    const renderCell = (row: DistanceData, column: TableColumn<DistanceData>): ReactNode => {
      if (column.key === "distance") {
        const color = row.distanceNumber === 0 ? "#9ca3af" : getDistanceColor(row.distanceNumber);
        return (
          <span className="font-semibold" style={{ color }}>
            {String(row.distance)}
          </span>
        );
      }
      if (column.key === "country") {
        const FlagComponent = COUNTRY_FLAG_COMPONENTS[String(row.country)];
        return FlagComponent ? (
          <div
            className="h-7 w-10 overflow-hidden rounded border border-gray-300 shadow-sm"
            title={String(row.country)}
          >
            <FlagComponent className="h-full w-full object-cover" />
          </div>
        ) : (
          <span>{String(row.country)}</span>
        );
      }
      return createRenderCell<DistanceData>()(row, column);
    };

    return (
      <SortableTable
        data={data}
        columns={getDistanceColumns(filterType)}
        onRowClick={(row) => {
          const value = filterType === "position" ? row.position : row.name;
          if (value !== undefined) {
            onCellClick(value as number | string, filterType);
          }
        }}
        renderCell={renderCell}
      />
    );
  }

  return <div className="text-center text-gray-500">Select filters to view data</div>;
};

export default DashboardContent;
