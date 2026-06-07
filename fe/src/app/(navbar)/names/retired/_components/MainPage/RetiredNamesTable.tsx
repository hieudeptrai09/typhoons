import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import FrownNotFound from "../../../../../../components/components/FrownNotFound";
import { createRenderCell } from "../../../../../../containers/utils/cellRenderers";
import type { RetiredName, TableColumn } from "../../../../../../types";

interface RetiredNamesTableProps {
  paginatedData: RetiredName[];
  onNameClick: (name: RetiredName) => void;
}

const columns: TableColumn<RetiredName>[] = [
  { key: "name", label: "Name", isSortable: true },
  { key: "meaning", label: "Meaning", isSortable: false },
  { key: "country", label: "Country", isSortable: true },
  { key: "position", label: "Position", isSortable: true },
  { key: "note", label: "Note", isSortable: false },
  { key: "lastYear", label: "Year of last storm", isSortable: true },
];

const getCellConfig = (row: RetiredName, key: keyof RetiredName) => {
  if (key === "name") {
    let colorClass = "text-red-600";
    switch (row.isLanguageProblem) {
      case 0:
        colorClass = "text-red-600";
        break;
      case 1:
        colorClass = "text-green-600";
        break;
      case 2:
        colorClass = "text-amber-500";
        break;
      case 3:
        colorClass = "text-purple-600";
        break;
    }
    return { className: `font-semibold ${colorClass}` };
  }
  return {};
};

const renderCell = createRenderCell<RetiredName>(getCellConfig);

const RetiredNamesTable = ({ paginatedData, onNameClick }: RetiredNamesTableProps) => {
  if (!paginatedData || paginatedData.length === 0) {
    return <FrownNotFound />;
  }

  const tableColumns: ColumnsType<RetiredName> = columns.map((col) => ({
    title: col.label,
    dataIndex: col.key as string,
    key: col.key as string,
    sorter: col.isSortable
      ? (a: RetiredName, b: RetiredName) => {
          const aVal = a[col.key];
          const bVal = b[col.key];
          if (typeof aVal === "number" && typeof bVal === "number") return aVal - bVal;
          return String(aVal ?? "").localeCompare(String(bVal ?? ""));
        }
      : undefined,
    render: (_: unknown, record: RetiredName) => renderCell(record, col),
  }));

  return (
    <div className="mx-auto max-w-5xl overflow-x-auto">
      <Table<RetiredName>
        dataSource={paginatedData}
        columns={tableColumns}
        rowKey="id"
        onRow={(record) => ({ onClick: () => onNameClick(record) })}
        rowClassName="cursor-pointer"
        pagination={false}
        size="middle"
      />
    </div>
  );
};

export default RetiredNamesTable;
