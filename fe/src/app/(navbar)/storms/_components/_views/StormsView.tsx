import { Table } from "antd";
import { TEXT_COLOR_WHITE_BACKGROUND, COUNTRY_FLAG_COMPONENTS } from "../../../../../constants";
import { getIntensityFromNumber, calculateAverage, getGroupedStorms } from "../../_utils/fns";
import { getPositionTitle } from "../../../../../containers/utils/fns";
import SpecialButtons from "../_components/SpecialButtons";
import StormGrid from "../_components/StormGrid";
import type { Storm, DashboardParams } from "../../../../../types";
import type { ColumnsType } from "antd/es/table";

interface StormsViewProps {
  params: DashboardParams;
  stormsData: Storm[];
  averageValues: Record<number, number> | null;
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

const makeColumns = (): ColumnsType<NameData> => [
  {
    title: "#",
    key: "order",
    width: 52,
    render: (_: unknown, __: NameData, index: number) => (
      <span className="text-sm font-semibold text-sky-700">{index + 1}</span>
    ),
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    sorter: (a, b) => a.name.localeCompare(b.name),
    render: (_: unknown, row: NameData) => {
      const intensityLabel = getIntensityFromNumber(row.avgIntensity);
      const textColor = TEXT_COLOR_WHITE_BACKGROUND[intensityLabel];
      return (
        <span className="font-semibold" style={{ color: textColor }}>
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
    render: (_: unknown, row: NameData) => {
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
    render: (_: unknown, row: NameData) => <span>{getPositionTitle(row.position)}</span>,
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

const StormsView = ({ params, stormsData, averageValues, onCellClick }: StormsViewProps) => {
  if (params.mode === "table") {
    return (
      <div>
        <SpecialButtons
          onCellClick={onCellClick}
          isAverageView={false}
          averageValues={averageValues}
        />
        <StormGrid
          viewType="storms"
          onCellClick={onCellClick}
          stormsData={stormsData}
          averageValues={null}
          isClickable
        />
      </div>
    );
  }

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
    <div className="mx-auto max-w-xl">
      <Table<NameData>
        dataSource={nameData}
        columns={makeColumns()}
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

export default StormsView;
