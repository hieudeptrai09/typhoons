import EmptyResults from "@/lib/components/EmptyResults";
import type { RetiredName } from "@/lib/types";
import { getRetiredReasonColorClass } from "@/lib/utils/colors";
import { getPositionTitle } from "@/lib/utils/fns";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";

interface RetiredNamesTableProps {
  paginatedData: RetiredName[];
  onNameClick: (name: RetiredName) => void;
}

const columns: ColumnsType<RetiredName> = [
  {
    title: "#",
    key: "order",
    width: 52,
    fixed: "left" as const,
    render: (_: unknown, __: RetiredName, index: number) => (
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
    render: (_: unknown, record: RetiredName) => (
      <span className={`font-semibold ${getRetiredReasonColorClass(record.isLanguageProblem)}`}>
        {record.name}
      </span>
    ),
  },
  {
    title: "Meaning",
    dataIndex: "meaning",
    key: "meaning",
    render: (_: unknown, record: RetiredName) => (
      <span className="block max-w-[200px] wrap-break-word whitespace-normal text-gray-700">
        {record.meaning || "-"}
      </span>
    ),
  },
  {
    title: "Country",
    dataIndex: "country",
    key: "country",
    sorter: (a, b) => a.country.localeCompare(b.country),
  },
  {
    title: "Position",
    dataIndex: "position",
    key: "position",
    sorter: (a, b) => a.position - b.position,
    render: (_: unknown, record: RetiredName) => <span>{getPositionTitle(record.position)}</span>,
  },
  {
    title: "Note",
    dataIndex: "note",
    key: "note",
    render: (_: unknown, record: RetiredName) => (
      <span className="block max-w-[300px] wrap-break-word whitespace-normal text-gray-700">
        {record.note || "-"}
      </span>
    ),
  },
  {
    title: "Year of last storm",
    dataIndex: "lastYear",
    key: "lastYear",
    sorter: (a, b) => a.lastYear - b.lastYear,
  },
];

const RetiredNamesTable = ({ paginatedData, onNameClick }: RetiredNamesTableProps) => {
  if (!paginatedData || paginatedData.length === 0) {
    return <EmptyResults />;
  }

  return (
    <div className="mx-auto max-w-5xl overflow-x-auto pb-px">
      <Table<RetiredName>
        dataSource={paginatedData}
        columns={columns}
        rowKey="id"
        onRow={(record) => ({
          onClick: () => onNameClick(record),
          "aria-label": `View details for ${record.name}`,
          role: "button",
          tabIndex: 0,
        })}
        rowClassName={(_record, index) =>
          `cursor-pointer ${index % 2 === 0 ? "bg-white" : "bg-sky-100"}`
        }
        pagination={false}
        size="large"
        className="typhoon-table"
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};

export default RetiredNamesTable;
