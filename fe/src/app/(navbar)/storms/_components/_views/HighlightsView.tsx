import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { INTENSITY_RANK } from "../../../../../constants";
import IntensityBadge from "../../../../../components/components/IntensityBadge";
import { getPositionTitle } from "../../../../../containers/utils/fns";
import { getHighlights } from "../../_utils/fns";
import StormGrid from "../_components/StormGrid";
import type { Storm, DashboardParams, IntensityType } from "../../../../../types";

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
    title: "Name",
    dataIndex: "name",
    key: "name",
    sorter: (a, b) => a.name.localeCompare(b.name),
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
    render: (_, record) => <IntensityBadge intensity={record.intensity} />,
  },
  {
    title: "Position",
    dataIndex: "position",
    key: "position",
    sorter: (a, b) => a.position - b.position,
    render: (_, record) => <span>{getPositionTitle(record.position)}</span>,
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
    <div className="mx-auto overflow-x-auto">
      <Table<HighlightRow>
        dataSource={highlightData}
        columns={columns}
        rowKey={(r) => `${r.name}-${r.year}`}
        pagination={false}
        size="middle"
      />
    </div>
  );
};

export default HighlightsView;
