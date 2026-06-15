import { Table } from "antd";
import IntensityBadge from "../../../../../components/components/IntensityBadge";
import { INTENSITY_RANK } from "../../../../../constants";
import { getPositionTitle } from "../../../../../containers/utils/fns";
import { getHighlights } from "../../_utils/fns";
import StormGrid from "../_components/StormGrid";
import type { Storm, DashboardParams, IntensityType } from "../../../../../types";
import type { ColumnsType } from "antd/es/table";

interface HighlightsViewProps {
  params: DashboardParams;
  stormsData: Storm[];
  onCellClick: (data: number | string, key: string) => void;
}

interface HighlightRow {
  name: string;
  year: number;
  intensity: IntensityType;
  position: number;
}

const columns: ColumnsType<HighlightRow> = [
  {
    title: "#",
    key: "order",
    width: 52,
    render: (_: unknown, __: HighlightRow, index: number) => (
      <span className="text-sm font-semibold text-sky-700">{index + 1}</span>
    ),
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    sorter: (a, b) => a.name.localeCompare(b.name),
    render: (_: unknown, row: HighlightRow) => <span className="font-semibold">{row.name}</span>,
  },
  {
    title: "Year",
    dataIndex: "year",
    key: "year",
    sorter: (a, b) => a.year - b.year,
  },
  {
    title: "Intensity",
    dataIndex: "intensity",
    key: "intensity",
    sorter: (a, b) => INTENSITY_RANK[a.intensity] - INTENSITY_RANK[b.intensity],
    render: (_: unknown, record: HighlightRow) => <IntensityBadge intensity={record.intensity} />,
  },
  {
    title: "Position",
    dataIndex: "position",
    key: "position",
    sorter: (a, b) => a.position - b.position,
    render: (_: unknown, record: HighlightRow) => <span>{getPositionTitle(record.position)}</span>,
  },
];

const HighlightsView = ({ params, stormsData, onCellClick }: HighlightsViewProps) => {
  const highlights = getHighlights(stormsData, params.filter);

  if (params.mode === "table") {
    return (
      <StormGrid
        viewType="highlights"
        onCellClick={onCellClick}
        stormsData={stormsData}
        highlightedStorms={highlights}
        highlightType={params.filter}
        isClickable={false}
      />
    );
  }

  const highlightData: HighlightRow[] = highlights.map((s) => ({
    name: s.name,
    year: s.year,
    intensity: s.intensity,
    position: s.position,
  }));

  return (
    <div className="mx-auto max-w-xl overflow-x-auto pb-px">
      <Table<HighlightRow>
        key={params.filter}
        dataSource={highlightData}
        columns={columns}
        rowKey={(r) => `${r.name}-${r.year}`}
        rowClassName={(_record, index) => (index % 2 === 0 ? "bg-white" : "bg-sky-100")}
        pagination={false}
        size="large"
        className="typhoon-table"
        scroll={undefined}
      />
    </div>
  );
};

export default HighlightsView;
