import CountryFlag from "@/lib/components/CountryFlag";
import DefTable from "@/lib/components/DefTable";
import IntensityBadge from "@/lib/components/IntensityBadge";
import { SORTING_RANK } from "@/lib/constants";
import type { DashboardParams, IntensityType, Storm } from "@/lib/types";
import { getPositionTitle } from "@/lib/utils/fns";
import type { ColumnsType } from "antd/es/table";
import HighlightsGrid from "../_widgets/grids/HighlightsGrid";
import { getHighlights } from "../../_utils/fns";

interface HighlightsViewProps {
  params: DashboardParams;
  stormsData: Storm[];
}

interface HighlightRow {
  name: string;
  year: number;
  intensity: IntensityType;
  position: number;
  country: string;
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
    title: "Contributed By",
    dataIndex: "country",
    key: "country",
    sorter: (a, b) => a.country.localeCompare(b.country),
    render: (_: unknown, row: HighlightRow) => <CountryFlag country={row.country} />,
  },
  {
    title: "Position",
    dataIndex: "position",
    key: "position",
    sorter: (a, b) => a.position - b.position,
    render: (_: unknown, record: HighlightRow) => <span>{getPositionTitle(record.position)}</span>,
  },
];

const HighlightsView = ({ params, stormsData }: HighlightsViewProps) => {
  const highlights = getHighlights(stormsData, params.filter);

  if (params.mode === "table") {
    return (
      <HighlightsGrid
        stormsData={stormsData}
        highlightedStorms={highlights}
        highlightType={params.filter}
      />
    );
  }

  const highlightData: HighlightRow[] = highlights.map((s) => ({
    name: s.name,
    year: s.year,
    intensity: s.intensity,
    position: s.position,
    country: s.country,
    monthStart: s.monthStart,
    isFromPrevYear: s.isFromPrevYear,
  }));

  return (
    <DefTable<HighlightRow>
      maxWidth="max-w-3xl"
      tableKey={params.filter}
      dataSource={highlightData}
      columns={columns}
      rowKey={(r) => `${r.name}-${r.year}`}
    />
  );
};

export default HighlightsView;
