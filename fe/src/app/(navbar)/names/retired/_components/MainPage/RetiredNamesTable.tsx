import { Table } from "antd";
import FrownNotFound from "../../../../../../components/components/FrownNotFound";
import { getPositionTitle } from "../../../../../../containers/utils/fns";
import type { RetiredName } from "../../../../../../types";
import type { ColumnsType } from "antd/es/table";

interface RetiredNamesTableProps {
  paginatedData: RetiredName[];
  onNameClick: (name: RetiredName) => void;
}

const getNameColor = (row: RetiredName): string => {
  switch (row.isLanguageProblem) {
    case 0:
      return "text-red-600";
    case 1:
      return "text-green-600";
    case 2:
      return "text-amber-500";
    case 3:
      return "text-purple-600";
    default:
      return "text-red-600";
  }
};

const columns: ColumnsType<RetiredName> = [
  {
    title: "#",
    key: "order",
    width: 52,
    render: (_: unknown, __: RetiredName, index: number) => (
      <span className="text-sm font-semibold text-sky-700">{index + 1}</span>
    ),
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    sorter: (a, b) => a.name.localeCompare(b.name),
    render: (_: unknown, record: RetiredName) => (
      <span className={`font-semibold ${getNameColor(record)}`}>{record.name}</span>
    ),
  },
  {
    title: "Meaning",
    dataIndex: "meaning",
    key: "meaning",
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
      <span className="text-gray-700">{record.note || "-"}</span>
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
    return <FrownNotFound />;
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Table<RetiredName>
        dataSource={paginatedData}
        columns={columns}
        rowKey="id"
        onRow={(record) => ({ onClick: () => onNameClick(record) })}
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

export default RetiredNamesTable;
