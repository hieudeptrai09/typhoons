"use client";

import CountryFlag from "@/lib/components/CountryFlag";
import DefTable from "@/lib/components/DefTable";
import IntensityBadge from "@/lib/components/IntensityBadge";
import ZoomEarth from "@/lib/components/ZoomEarth";
import { SORTING_RANK } from "@/lib/constants";
import type { IntensityType, RetiredName, Storm } from "@/lib/types";
import { formatStormDateRange } from "@/lib/utils/date";
import { getPositionSlug, getPositionTitle } from "@/lib/utils/position";
import type { ColumnsType } from "antd/es/table";
import Link from "next/link";

interface StormNameRow {
  key: string;
  name: string;
  meaning: string;
  intensity: IntensityType;
  country: string;
  position: number;
  year: number;
  // "YYYY-MM-DD", so a plain string compare sorts it chronologically.
  dateStart: string;
  dateRange: string;
  storm: Storm;
}

interface StormNameTableProps {
  storms: Storm[];
  // The full naming list, for the meaning each storm's name carries.
  names: RetiredName[];
  tableKey: string;
  // Both are off where every row repeats one value the page title already states:
  // a country page is one country, a season page is one year.
  showCountry?: boolean;
  showYear?: boolean;
}

const buildColumns = (showCountry: boolean, showYear: boolean): ColumnsType<StormNameRow> => [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    width: 120,
    fixed: "left" as const,
    sorter: (a, b) => a.name.localeCompare(b.name),
    render: (_: unknown, row: StormNameRow) => (
      <Link
        href={`/info/${encodeURIComponent(row.name.toLowerCase())}/`}
        className="font-semibold hover:text-sky-700 hover:underline"
      >
        {row.name}
      </Link>
    ),
  },
  {
    title: "Category",
    dataIndex: "intensity",
    key: "intensity",
    sorter: (a, b) => SORTING_RANK[a.intensity] - SORTING_RANK[b.intensity],
    render: (_: unknown, row: StormNameRow) => <IntensityBadge intensity={row.intensity} />,
  },
  {
    title: "Meaning",
    dataIndex: "meaning",
    key: "meaning",
    width: 220,
    sorter: (a, b) => a.meaning.localeCompare(b.meaning),
    render: (_: unknown, row: StormNameRow) =>
      row.meaning === "" ? <span className="text-slate-400">—</span> : <span>{row.meaning}</span>,
  },
  ...(showCountry
    ? [
        {
          title: "Contributed By",
          dataIndex: "country",
          key: "country",
          sorter: (a: StormNameRow, b: StormNameRow) => a.country.localeCompare(b.country),
          render: (_: unknown, row: StormNameRow) => <CountryFlag country={row.country} />,
        },
      ]
    : []),
  ...(showYear
    ? [
        {
          title: "Year",
          dataIndex: "year",
          key: "year",
          sorter: (a: StormNameRow, b: StormNameRow) => a.year - b.year,
          render: (_: unknown, row: StormNameRow) => (
            <span className="tabular-nums">{row.year}</span>
          ),
        },
      ]
    : []),
  {
    // The grouped card list used to carry the slot in its group headers; as a column it survives the flattening.
    title: "Position",
    dataIndex: "position",
    key: "position",
    sorter: (a, b) => a.position - b.position,
    render: (_: unknown, row: StormNameRow) => (
      <Link
        href={`/positions/${getPositionSlug(row.position)}/`}
        className="whitespace-nowrap hover:text-sky-700 hover:underline"
      >
        {getPositionTitle(row.position)}
      </Link>
    ),
  },
  {
    title: "Dates",
    dataIndex: "dateStart",
    key: "dates",
    sorter: (a, b) => a.dateStart.localeCompare(b.dateStart),
    render: (_: unknown, row: StormNameRow) => (
      <span className="whitespace-nowrap tabular-nums">{row.dateRange}</span>
    ),
  },
  {
    // The cards linked out to the track; without them this column is the only way left.
    title: "Track",
    key: "track",
    render: (_: unknown, row: StormNameRow) => <ZoomEarth storm={row.storm} />,
  },
];

/** One row per storm, carrying the meaning of the name it was issued under. */
const StormNameTable = ({
  storms,
  names,
  tableKey,
  showCountry = true,
  showYear = true,
}: StormNameTableProps) => {
  const byName = new Map(names.map((name) => [name.name.toLowerCase(), name]));
  // A storm issued under a misspelled name still reaches its list entry through correctSpelling.
  const meaningOf = (storm: Storm): string =>
    byName.get((storm.correctSpelling ?? storm.name).toLowerCase())?.meaning ?? "";

  const rows: StormNameRow[] = storms.map((storm, index) => ({
    key: `${storm.year}-${storm.position}-${storm.name}-${index}`,
    name: storm.name,
    meaning: meaningOf(storm),
    intensity: storm.intensity,
    country: storm.country,
    position: storm.position,
    year: storm.year,
    dateStart: storm.dateStart,
    dateRange: formatStormDateRange(storm.dateStart, storm.dateEnd),
    storm,
  }));

  return (
    <DefTable<StormNameRow>
      maxWidth="max-w-4xl"
      tableKey={tableKey}
      dataSource={rows}
      columns={buildColumns(showCountry, showYear)}
      rowKey={(row) => row.key}
    />
  );
};

export default StormNameTable;
