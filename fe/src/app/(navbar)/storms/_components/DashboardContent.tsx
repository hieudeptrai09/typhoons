import { useMemo } from "react";
import type { ReactNode } from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
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
  if (years < 6.0) return "#16a34a";
  if (years === 6.0) return "#2563eb";
  return "#dc2626";
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
    const baseData = { count: storms.length, average: avgValue.toFixed(2), avgNumber: avgValue };
    const dataTypeMap: Record<string, Partial<AverageData>> = {
      year: { year: parseInt(key) },
      country: { country: key },
      name: { name: key, country: storms[0].country, position: storms[0].position },
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

// ── Column factories ─────────────────────────────────────────────────────────

const makeStormNameColumns = (): ColumnsType<NameData> => [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    sorter: (a, b) => a.name.localeCompare(b.name),
    render: (_, row) => {
      const intensityLabel = getIntensityFromNumber(row.avgIntensity);
      const textColor = TEXT_COLOR_WHITE_BACKGROUND[intensityLabel];
      return (
        <span className="font-bold" style={{ color: textColor }}>
          {row.name}
        </span>
      );
    },
  },
  {
    title: "Country",
    dataIndex: "country",
    key: "country",
    sorter: (a, b) => a.country.localeCompare(b.country),
    render: (_, row) => {
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
    },
  },
  {
    title: "Position",
    dataIndex: "position",
    key: "position",
    sorter: (a, b) => a.position - b.position,
  },
  {
    title: "Storm Count",
    dataIndex: "count",
    key: "count",
    sorter: (a, b) => a.count - b.count,
  },
  {
    title: "Last Year",
    dataIndex: "year",
    key: "year",
    sorter: (a, b) => a.year - b.year,
  },
];

const makeAverageColumns = (filterType: string): ColumnsType<AverageData> => {
  const base: ColumnsType<AverageData> = [];

  if (filterType === "year")
    base.push({
      title: "Year",
      dataIndex: "year",
      key: "year",
      sorter: (a, b) => (a.year ?? 0) - (b.year ?? 0),
    });
  if (filterType === "country" || filterType === "name" || filterType === "position") {
    if (filterType !== "year") {
      if (filterType === "position") {
        base.push({
          title: "Position",
          dataIndex: "position",
          key: "position",
          sorter: (a, b) => (a.position ?? 0) - (b.position ?? 0),
        });
      }
      if (filterType === "name") {
        base.push({
          title: "Name",
          dataIndex: "name",
          key: "name",
          sorter: (a, b) => (a.name ?? "").localeCompare(b.name ?? ""),
        });
      }
      if (filterType === "country" || filterType === "name" || filterType === "position") {
        base.push({
          title: "Country",
          dataIndex: "country",
          key: "country",
          sorter: (a, b) => (a.country ?? "").localeCompare(b.country ?? ""),
          render: (_, row) => {
            const FlagComponent = COUNTRY_FLAG_COMPONENTS[String(row.country ?? "")];
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
          },
        });
      }
    }
  }

  base.push({
    title: "Count",
    dataIndex: "count",
    key: "count",
    sorter: (a, b) => a.count - b.count,
  });
  base.push({
    title: "Average Intensity",
    dataIndex: "average",
    key: "average",
    sorter: (a, b) => a.avgNumber - b.avgNumber,
    render: (_, row) => {
      const intensityLabel = getIntensityFromNumber(row.avgNumber);
      const textColor = TEXT_COLOR_WHITE_BACKGROUND[intensityLabel];
      return (
        <span className="font-semibold" style={{ color: textColor }}>
          {row.average}
        </span>
      );
    },
  });

  return base;
};

const makeDistanceColumns = (filterType: "position" | "name"): ColumnsType<DistanceData> => {
  const base: ColumnsType<DistanceData> = [];

  if (filterType === "position") {
    base.push({
      title: "Position",
      dataIndex: "position",
      key: "position",
      sorter: (a, b) => Number(a.position ?? 0) - Number(b.position ?? 0),
    });
  } else {
    base.push({
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => (a.name ?? "").localeCompare(b.name ?? ""),
    });
    base.push({
      title: "Position",
      dataIndex: "position",
      key: "position",
      sorter: (a, b) => Number(a.position ?? 0) - Number(b.position ?? 0),
    });
  }

  base.push({
    title: "Country",
    dataIndex: "country",
    key: "country",
    sorter: (a, b) => (a.country ?? "").localeCompare(b.country ?? ""),
    render: (_, row) => {
      const FlagComponent = COUNTRY_FLAG_COMPONENTS[String(row.country ?? "")];
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
    },
  });

  base.push({
    title: "Storm Count",
    dataIndex: "count",
    key: "count",
    sorter: (a, b) => a.count - b.count,
  });
  base.push({
    title: "Avg Gap (years)",
    dataIndex: "distance",
    key: "distance",
    sorter: (a, b) => a.distanceNumber - b.distanceNumber,
    render: (_, row) => {
      const color = row.distanceNumber === 0 ? "#9ca3af" : getDistanceColor(row.distanceNumber);
      return (
        <span className="font-semibold" style={{ color }}>
          {row.distance}
        </span>
      );
    },
  });

  return base;
};

// ── Distance grid (position mode, table) ────────────────────────────────────
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

// ── Main component ───────────────────────────────────────────────────────────

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

  const distanceValues = useMemo(() => {
    if (params.view !== "distance") return null;
    const filterType = (params.filter || "position") as "position" | "name";
    const distances = calculateDistances(stormsData, filterType);
    if (filterType === "position") {
      const result: Record<number, number> = {};
      Object.entries(distances).forEach(([k, v]) => {
        result[Number(k)] = v;
      });
      return result;
    }
    return distances as unknown as Record<number, number>;
  }, [stormsData, params.view, params.filter]);

  // ── storms grid ──────────────────────────────────────────────────────────
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

  // ── storms list ──────────────────────────────────────────────────────────
  if (params.view === "storms" && params.mode === "list") {
    const nameGroups = getGroupedStorms(stormsData, "name");
    const nameData: NameData[] = Object.entries(nameGroups).map(([name, storms]) => ({
      name,
      country: storms[0].country,
      position: storms[0].position,
      count: storms.length,
      avgIntensity: calculateAverage(storms),
      year: storms[storms.length - 1].year,
    }));

    return (
      <div className="mx-auto overflow-x-auto">
        <Table<NameData>
          dataSource={nameData}
          columns={makeStormNameColumns()}
          rowKey="name"
          onRow={(row) => ({ onClick: () => onCellClick(row.name, "name") })}
          rowClassName="cursor-pointer"
          pagination={false}
          size="middle"
        />
      </div>
    );
  }

  // ── highlights list ──────────────────────────────────────────────────────
  if (params.view === "highlights") {
    const highlights = getHighlights(stormsData, params.filter);
    const highlightData = highlights.map((s) => ({
      name: s.name,
      year: s.year,
      intensity: s.intensity,
      position: s.position,
    }));

    const cols: TableColumn<(typeof highlightData)[0]>[] = [
      { key: "name", label: "Name" },
      { key: "year", label: "Year" },
      { key: "intensity", label: "Intensity", title: JSON.stringify(INTENSITY_RANK) },
      { key: "position", label: "Position" },
    ];

    const renderCell = createRenderCell<(typeof highlightData)[0]>();

    const antdCols: ColumnsType<(typeof highlightData)[0]> = cols.map((col) => ({
      title: col.label,
      dataIndex: col.key as string,
      key: col.key as string,
      sorter: (a, b) => {
        const aVal = a[col.key];
        const bVal = b[col.key];
        if (typeof aVal === "number" && typeof bVal === "number") return aVal - bVal;
        return String(aVal ?? "").localeCompare(String(bVal ?? ""));
      },
      render: (_: unknown, record: (typeof highlightData)[0]) => renderCell(record, col),
    }));

    return (
      <div className="mx-auto overflow-x-auto">
        <Table
          dataSource={highlightData}
          columns={antdCols}
          rowKey={(r) => `${r.name}-${r.year}`}
          pagination={false}
          size="middle"
        />
      </div>
    );
  }

  // ── average list ─────────────────────────────────────────────────────────
  if (params.view === "average") {
    const data = transformAverageData(groupedStorms, params.filter);

    return (
      <div className="mx-auto overflow-x-auto">
        <Table<AverageData>
          dataSource={data}
          columns={makeAverageColumns(params.filter)}
          rowKey={(r) => String(r.year ?? r.country ?? r.name ?? r.position ?? Math.random())}
          onRow={(row) => ({
            onClick: () => {
              const value = row[params.filter as keyof AverageData];
              if (value !== undefined) onCellClick(value as number | string, params.filter);
            },
          })}
          rowClassName="cursor-pointer"
          pagination={false}
          size="middle"
        />
      </div>
    );
  }

  // ── distance view ────────────────────────────────────────────────────────
  if (params.view === "distance") {
    const filterType = (params.filter || "position") as "position" | "name";

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

    const distances = calculateDistances(stormsData, filterType);
    const grouped = getGroupedStorms(stormsData, filterType);
    const data = transformDistanceData(distances, grouped, filterType);

    return (
      <div className="mx-auto overflow-x-auto">
        <Table<DistanceData>
          dataSource={data}
          columns={makeDistanceColumns(filterType)}
          rowKey={(r) => String(r.position ?? r.name ?? Math.random())}
          onRow={(row) => ({
            onClick: () => {
              const value = filterType === "position" ? row.position : row.name;
              if (value !== undefined) onCellClick(value as number | string, filterType);
            },
          })}
          rowClassName="cursor-pointer"
          pagination={false}
          size="middle"
        />
      </div>
    );
  }

  return <div className="text-center text-gray-500">Select filters to view data</div>;
};

export default DashboardContent;
