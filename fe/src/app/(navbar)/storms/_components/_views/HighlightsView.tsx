import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { INTENSITY_RANK } from "../../../../../constants";
import { createRenderCell } from "../../../../../containers/utils/cellRenderers";
import { getHighlights } from "../../_utils/fns";
import StormGrid from "../_components/StormGrid";
import type { Storm, DashboardParams, TableColumn } from "../../../../../types";

interface HighlightsViewProps {
  params: DashboardParams;
  stormsData: Storm[];
  onCellClick: (data: number | string, key: string) => void;
}

interface HighlightRow {
  name: string;
  year: number;
  intensity: string;
  position: number;
}

const tableColumns: TableColumn<HighlightRow>[] = [
  { key: "name", label: "Name" },
  { key: "year", label: "Year" },
  { key: "intensity", label: "Intensity", title: JSON.stringify(INTENSITY_RANK) },
  { key: "position", label: "Position" },
];

const renderCell = createRenderCell<HighlightRow>();

const makeAntdColumns = (): ColumnsType<HighlightRow> =>
  tableColumns.map((col) => ({
    title: col.label,
    dataIndex: col.key as string,
    key: col.key as string,
    sorter: (a, b) => {
      const aVal = a[col.key];
      const bVal = b[col.key];
      if (typeof aVal === "number" && typeof bVal === "number") return aVal - bVal;
      return String(aVal ?? "").localeCompare(String(bVal ?? ""));
    },
    render: (_: unknown, record: HighlightRow) => renderCell(record, col),
  }));

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
        columns={makeAntdColumns()}
        rowKey={(r) => `${r.name}-${r.year}`}
        pagination={false}
        size="middle"
      />
    </div>
  );
};

export default HighlightsView;
