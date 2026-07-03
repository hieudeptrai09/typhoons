import type { Storm } from "@/common/types";
import { TEXT_COLOR_WHITE_BACKGROUND } from "@/common/utils/colors";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useMemo } from "react";
import { calculateAverage, getEffectiveMonth, getIntensityFromNumber } from "../../_utils/fns";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

interface SeasonData {
  month: number;
  monthName: string;
  count: number;
  avgNumber: number;
}

interface SeasonViewProps {
  stormsData: Storm[];
  onCellClick: (data: number | string, key: string) => void;
}

const columns: ColumnsType<SeasonData> = [
  {
    title: "#",
    key: "order",
    width: 52,
    fixed: "left" as const,
    render: (_: unknown, __: SeasonData, index: number) => (
      <span className="text-sm font-semibold text-sky-700">{index + 1}</span>
    ),
  },
  {
    title: "Month",
    dataIndex: "monthName",
    key: "month",
    width: 120,
    fixed: "left" as const,
    sorter: (a: SeasonData, b: SeasonData) => a.month - b.month,
  },
  {
    title: "Count",
    dataIndex: "count",
    key: "count",
    sorter: (a: SeasonData, b: SeasonData) => a.count - b.count,
  },
  {
    title: "Average Intensity",
    key: "average",
    sorter: (a: SeasonData, b: SeasonData) => a.avgNumber - b.avgNumber,
    render: (_: unknown, row: SeasonData) => {
      if (row.count === 0) return <span className="text-gray-400">—</span>;
      const textColor = TEXT_COLOR_WHITE_BACKGROUND[getIntensityFromNumber(row.avgNumber)];
      return (
        <span className="font-semibold" style={{ color: textColor }}>
          {row.avgNumber.toFixed(2)}
        </span>
      );
    },
  },
];

const SeasonView = ({ stormsData, onCellClick }: SeasonViewProps) => {
  const data = useMemo<SeasonData[]>(
    () =>
      MONTH_NAMES.map((monthName, i) => {
        const month = i + 1;
        const storms = stormsData.filter((s) => getEffectiveMonth(s) === month);
        return {
          month,
          monthName,
          count: storms.length,
          avgNumber: storms.length > 0 ? calculateAverage(storms) : 0,
        };
      }),
    [stormsData],
  );

  return (
    <div className="mx-auto max-w-lg overflow-x-auto pb-px">
      <Table<SeasonData>
        dataSource={data}
        columns={columns}
        rowKey="month"
        onRow={(row) => ({
          onClick: () => row.count > 0 && onCellClick(row.month, "monthStart"),
        })}
        rowClassName={(record, index) =>
          `${record.count > 0 ? "cursor-pointer" : "cursor-default"} ${index % 2 === 0 ? "bg-white" : "bg-sky-100"}`
        }
        pagination={false}
        size="large"
        className="typhoon-table"
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};

export default SeasonView;
