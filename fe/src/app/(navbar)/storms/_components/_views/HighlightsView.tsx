import IntensityBadge from "@/common/components/IntensityBadge";
import { SORTING_RANK } from "@/common/constants";
import type { DashboardParams, IntensityType, Storm } from "@/common/types";
import { getPositionTitle } from "@/common/utils/fns";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import StormGrid from "../_widgets/StormGrid";
import { getHighlights } from "../../_utils/fns";

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
  monthStart?: number;
  isFromPrevYear?: number;
}

const columns: ColumnsType<HighlightRow> = [
  {
    title: "#",
    key: "order",
    width: 52,
    fixed: "left" as const,
    render: (_: unknown, __: HighlightRow, index: number) => (
      <span className="text-sm font-semibold text-sky-700">{index + 1}</span>
    ),
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    width: 100,
    fixed: "left" as const,
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
    title: "Month",
    key: "month",
    sorter: (a, b) => {
      const keyA = a.isFromPrevYear ? 0 : (a.monthStart ?? 0);
      const keyB = b.isFromPrevYear ? 0 : (b.monthStart ?? 0);
      return keyA - keyB;
    },
    render: (_: unknown, row: HighlightRow) => {
      if (!row.monthStart) return null;
      const displayYear = row.isFromPrevYear ? row.year - 1 : row.year;
      return (
        <span>
          {row.monthStart}/{displayYear}
        </span>
      );
    },
  },
  {
    title: "Intensity",
    dataIndex: "intensity",
    key: "intensity",
    sorter: (a, b) => SORTING_RANK[a.intensity] - SORTING_RANK[b.intensity],
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
    monthStart: s.monthStart,
    isFromPrevYear: s.isFromPrevYear,
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
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};

export default HighlightsView;
