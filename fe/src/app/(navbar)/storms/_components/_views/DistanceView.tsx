import { useMemo } from "react";
import { Table } from "antd";
import { COUNTRY_FLAG_COMPONENTS } from "../../../../../constants";
import { calculateDistances, getGroupedStorms } from "../../_utils/fns";
import { getPositionTitle } from "../../../../../containers/utils/fns";
import SpecialButtons from "../_components/SpecialButtons";
import StormGrid from "../_components/StormGrid";
import type { Storm, DashboardParams } from "../../../../../types";
import type { ColumnsType } from "antd/es/table";

interface DistanceViewProps {
  params: DashboardParams;
  stormsData: Storm[];
  onCellClick: (data: number | string, key: string) => void;
}

interface PositionRow {
  position: number;
  country: string;
  count: number;
  distanceNumber: number;
  distance: string;
}

interface NameRow {
  name: string;
  country: string;
  position: number;
  count: number;
  distanceNumber: number;
  distance: string;
}

const getDistanceColor = (years: number): string => {
  if (years < 6.0) return "#16a34a";
  if (years === 6.0) return "#2563eb";
  return "#dc2626";
};

const formatDistance = (dist: number): string => (dist === 0 ? "N/A" : dist.toFixed(2));

const CountryCell = ({ country }: { country: string }) => {
  const FlagComponent = COUNTRY_FLAG_COMPONENTS[country];
  return FlagComponent ? (
    <div
      className="h-7 w-10 overflow-hidden rounded border border-gray-300 shadow-sm"
      title={country}
    >
      <FlagComponent className="h-full w-full object-cover" />
    </div>
  ) : (
    <span>{country}</span>
  );
};

const DistanceCell = ({
  distanceNumber,
  distance,
}: {
  distanceNumber: number;
  distance: string;
}) => (
  <span
    className="font-semibold"
    style={{ color: distanceNumber === 0 ? "#9ca3af" : getDistanceColor(distanceNumber) }}
  >
    {distance}
  </span>
);

const orderCol = <T,>(): ColumnsType<T>[number] => ({
  title: "#",
  key: "order",
  width: 52,
  render: (_: unknown, __: T, index: number) => (
    <span className="text-sm font-semibold text-sky-700">{index + 1}</span>
  ),
});

const positionColumns: ColumnsType<PositionRow> = [
  orderCol<PositionRow>(),
  {
    title: "Position",
    dataIndex: "position",
    key: "position",
    sorter: (a, b) => a.position - b.position,
    render: (_: unknown, row: PositionRow) => <span>{getPositionTitle(row.position)}</span>,
  },
  {
    title: "Country",
    dataIndex: "country",
    key: "country",
    sorter: (a, b) => a.country.localeCompare(b.country),
    render: (_: unknown, row: PositionRow) => <CountryCell country={row.country} />,
  },
  {
    title: "Storm Count",
    dataIndex: "count",
    key: "count",
    sorter: (a, b) => a.count - b.count,
  },
  {
    title: "Avg Gap (years)",
    dataIndex: "distance",
    key: "distance",
    sorter: (a, b) => a.distanceNumber - b.distanceNumber,
    render: (_: unknown, row: PositionRow) => (
      <DistanceCell distanceNumber={row.distanceNumber} distance={row.distance} />
    ),
  },
];

const nameColumns: ColumnsType<NameRow> = [
  orderCol<NameRow>(),
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    sorter: (a, b) => a.name.localeCompare(b.name),
    render: (_: unknown, row: NameRow) => <span className="font-semibold">{row.name}</span>,
  },
  {
    title: "Country",
    dataIndex: "country",
    key: "country",
    sorter: (a, b) => a.country.localeCompare(b.country),
    render: (_: unknown, row: NameRow) => <CountryCell country={row.country} />,
  },
  {
    title: "Position",
    dataIndex: "position",
    key: "position",
    sorter: (a, b) => a.position - b.position,
    render: (_: unknown, row: NameRow) => <span>{getPositionTitle(row.position)}</span>,
  },
  {
    title: "Storm Count",
    dataIndex: "count",
    key: "count",
    sorter: (a, b) => a.count - b.count,
  },
  {
    title: "Avg Gap (years)",
    dataIndex: "distance",
    key: "distance",
    sorter: (a, b) => a.distanceNumber - b.distanceNumber,
    render: (_: unknown, row: NameRow) => (
      <DistanceCell distanceNumber={row.distanceNumber} distance={row.distance} />
    ),
  },
];

const DistanceView = ({ params, stormsData, onCellClick }: DistanceViewProps) => {
  const filterType = (params.filter || "position") as "position" | "name";

  const distanceMap = useMemo(
    () => calculateDistances(stormsData, filterType),
    [stormsData, filterType],
  );

  const groupedStorms = useMemo(
    () => getGroupedStorms(stormsData, filterType),
    [stormsData, filterType],
  );

  const distanceValuesForGrid = useMemo<Record<number, number>>(() => {
    if (filterType !== "position") return {};
    const result: Record<number, number> = {};
    Object.entries(distanceMap).forEach(([k, v]) => {
      result[Number(k)] = v;
    });
    return result;
  }, [distanceMap, filterType]);

  if (params.mode === "table" && filterType === "position") {
    return (
      <div>
        <SpecialButtons
          onCellClick={onCellClick}
          isAverageView={false}
          averageValues={null}
          distanceValues={distanceValuesForGrid}
        />
        <StormGrid
          viewType="distance"
          onCellClick={onCellClick}
          stormsData={stormsData}
          distanceValues={distanceValuesForGrid}
          isClickable
        />
      </div>
    );
  }

  // List mode — position
  if (filterType === "position") {
    const data: PositionRow[] = Object.entries(distanceMap).map(([key, dist]) => {
      const storms = groupedStorms[key] || [];
      return {
        position: parseInt(key),
        country: storms[0]?.country ?? "",
        count: storms.length,
        distanceNumber: dist,
        distance: formatDistance(dist),
      };
    });

    return (
      <div className="mx-auto max-w-2xl">
        <Table<PositionRow>
          key="position"
          dataSource={data}
          columns={positionColumns}
          rowKey="position"
          onRow={(row) => ({ onClick: () => onCellClick(row.position, "position") })}
          rowClassName={(_record, index) =>
            `cursor-pointer ${index % 2 === 0 ? "bg-white" : "bg-sky-100"}`
          }
          pagination={false}
          size="large"
          className="typhoon-table"
          scroll={undefined}
        />
      </div>
    );
  }

  // List mode — name
  const data: NameRow[] = Object.entries(distanceMap).map(([key, dist]) => {
    const storms = groupedStorms[key] || [];
    return {
      name: key,
      country: storms[0]?.country ?? "",
      position: storms[0]?.position ?? 0,
      count: storms.length,
      distanceNumber: dist,
      distance: formatDistance(dist),
    };
  });

  return (
    <div className="mx-auto max-w-2xl">
      <Table<NameRow>
        key="name"
        dataSource={data}
        columns={nameColumns}
        rowKey="name"
        onRow={(row) => ({ onClick: () => onCellClick(row.name, "name") })}
        rowClassName={(_record, index) =>
          `cursor-pointer ${index % 2 === 0 ? "bg-white" : "bg-sky-100"}`
        }
        pagination={false}
        size="large"
        className="typhoon-table"
        scroll={undefined}
      />
    </div>
  );
};

export default DistanceView;
