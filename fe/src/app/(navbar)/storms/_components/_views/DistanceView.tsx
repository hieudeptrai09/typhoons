import { useMemo } from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { COUNTRY_FLAG_COMPONENTS } from "../../../../../constants";
import { calculateDistances, getGroupedStorms } from "../../_utils/fns";
import SpecialButtons from "../_components/SpecialButtons";
import type { Storm, DashboardParams } from "../../../../../types";

interface DistanceViewProps {
  params: DashboardParams;
  stormsData: Storm[];
  onCellClick: (data: number | string, key: string) => void;
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

const transformData = (
  distanceMap: Record<string, number>,
  groupedStorms: Record<string, Storm[]>,
  filterType: "position" | "name",
): DistanceData[] =>
  Object.entries(distanceMap).map(([key, dist]) => {
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

const makeColumns = (filterType: "position" | "name"): ColumnsType<DistanceData> => {
  const cols: ColumnsType<DistanceData> = [];

  if (filterType === "position") {
    cols.push({
      title: "Position",
      dataIndex: "position",
      key: "position",
      sorter: (a, b) => Number(a.position ?? 0) - Number(b.position ?? 0),
    });
  } else {
    cols.push({
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => (a.name ?? "").localeCompare(b.name ?? ""),
    });
    cols.push({
      title: "Position",
      dataIndex: "position",
      key: "position",
      sorter: (a, b) => Number(a.position ?? 0) - Number(b.position ?? 0),
    });
  }

  cols.push({
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

  cols.push({
    title: "Storm Count",
    dataIndex: "count",
    key: "count",
    sorter: (a, b) => a.count - b.count,
  });

  cols.push({
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
  } as ColumnsType<DistanceData>[number]);

  return cols;
};

// ── Distance grid (position + table mode only) ───────────────────────────────
interface DistanceGridProps {
  distanceValues: Record<number, number>;
  stormsData: Storm[];
  onCellClick: (position: number, key: string) => void;
}

const DistanceGrid = ({ distanceValues, stormsData, onCellClick }: DistanceGridProps) => {
  const rows = 10;
  const cols = 14;

  const getStormNames = (position: number): string[] => {
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
                const label = dist === undefined ? "—" : dist === 0 ? "N/A" : `${dist.toFixed(2)}y`;
                const stormNames = getStormNames(position);

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

// ── Main ─────────────────────────────────────────────────────────────────────

const DistanceView = ({ params, stormsData, onCellClick }: DistanceViewProps) => {
  const filterType = (params.filter || "position") as "position" | "name";

  const distanceValues = useMemo(() => {
    const distances = calculateDistances(stormsData, filterType);
    if (filterType === "position") {
      const result: Record<number, number> = {};
      Object.entries(distances).forEach(([k, v]) => {
        result[Number(k)] = v;
      });
      return result;
    }
    return distances as unknown as Record<number, number>;
  }, [stormsData, filterType]);

  if (params.mode === "table" && filterType === "position") {
    return (
      <div>
        <SpecialButtons
          onCellClick={onCellClick}
          isAverageView={false}
          averageValues={null}
          distanceValues={distanceValues as Record<number, number>}
        />
        <DistanceGrid
          distanceValues={distanceValues as Record<number, number>}
          stormsData={stormsData}
          onCellClick={onCellClick}
        />
      </div>
    );
  }

  const grouped = getGroupedStorms(stormsData, filterType);
  const data = transformData(calculateDistances(stormsData, filterType), grouped, filterType);

  return (
    <div className="mx-auto overflow-x-auto">
      <Table<DistanceData>
        dataSource={data}
        columns={makeColumns(filterType)}
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
};

export default DistanceView;
