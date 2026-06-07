import { useMemo } from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import FrownNotFound from "../../../../../components/components/FrownNotFound";
import { createRenderCell } from "../../../../../containers/utils/cellRenderers";
import type { TyphoonName, TableColumn } from "../../../../../types";

interface FilteredNamesTableProps {
  filteredNames: TyphoonName[];
  showImageAndDescription: boolean;
  onNameClick: (name: TyphoonName) => void;
}

const FilteredNamesTable = ({
  filteredNames,
  showImageAndDescription,
  onNameClick,
}: FilteredNamesTableProps) => {
  const tableColumns = useMemo<ColumnsType<TyphoonName>>(() => {
    const baseColumns: TableColumn<TyphoonName>[] = [
      { key: "isRetired", label: "Retired", isSortable: true },
      { key: "name", label: "Name", isSortable: true },
      { key: "country", label: "Country", isSortable: true },
      { key: "language", label: "Language", isSortable: true },
      { key: "position", label: "Position", isSortable: true },
      { key: "meaning", label: "Meaning", isSortable: false },
    ];

    if (showImageAndDescription) {
      baseColumns.push(
        { key: "image", label: "Image", isSortable: false },
        { key: "description", label: "Description", isSortable: false },
      );
    }

    const getCellConfig = (row: TyphoonName, key: keyof TyphoonName) => {
      if (key === "name") {
        let colorClass = "text-green-700";
        if (row.isLanguageProblem === 2) colorClass = "text-amber-500";
        else if (Boolean(row.isRetired)) colorClass = "text-red-600";
        return { className: `font-semibold ${colorClass}` };
      }
      if (key === "isRetired") {
        const colorClass = row.isRetired
          ? row.isLanguageProblem === 2
            ? "text-amber-500"
            : "text-red-600"
          : "text-green-700";
        return { className: colorClass };
      }
      return {};
    };

    const renderCell = createRenderCell<TyphoonName>(getCellConfig);

    return baseColumns.map((col) => ({
      title: col.label,
      dataIndex: col.key as string,
      key: col.key as string,
      sorter: col.isSortable
        ? (a: TyphoonName, b: TyphoonName) => {
            const aVal = a[col.key];
            const bVal = b[col.key];
            if (typeof aVal === "number" && typeof bVal === "number") return aVal - bVal;
            return String(aVal ?? "").localeCompare(String(bVal ?? ""));
          }
        : undefined,
      render: (_: unknown, record: TyphoonName) => renderCell(record, col),
    }));
  }, [showImageAndDescription]);

  if (filteredNames.length === 0) {
    return <FrownNotFound />;
  }

  return (
    <div
      className={`mx-auto overflow-x-auto ${showImageAndDescription ? "max-w-8xl" : "max-w-4xl"}`}
    >
      <Table<TyphoonName>
        dataSource={filteredNames}
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

export default FilteredNamesTable;
