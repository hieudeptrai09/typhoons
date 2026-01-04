import type { ReactNode } from "react";
import { Frown } from "lucide-react";
import SortableTable from "../../../../../../components/SortableTable";
import type { RetiredName, TableColumn } from "../../../../../../types";

interface RetiredNamesTableProps {
  paginatedData: RetiredName[];
  onNameClick: (name: RetiredName) => void;
}

const RetiredNamesTable = ({ paginatedData, onNameClick }: RetiredNamesTableProps) => {
  if (!paginatedData || paginatedData.length === 0) {
    return (
      <div className="mx-auto max-w-4xl p-8 text-center">
        <Frown className="mx-auto mb-4 h-16 w-16 text-gray-400" />
        <h3 className="mb-2 text-xl font-semibold text-gray-700">No Results Found</h3>
        <p className="text-gray-500">
          No retired typhoon names match your current filters. Try adjusting your search criteria.
        </p>
      </div>
    );
  }

  const columns: TableColumn<RetiredName>[] = [
    { key: "name", label: "Name", isSortable: true },
    { key: "meaning", label: "Meaning", isSortable: false },
    { key: "country", label: "Country", isSortable: true },
    { key: "note", label: "Note", isSortable: false },
    { key: "lastYear", label: "Year of last storm", isSortable: true },
  ];

  const getNameColor = (selectedName: RetiredName): string => {
    const ilp = selectedName.isLanguageProblem;

    switch (ilp) {
      case 0:
        return "text-red-600"; // Destructive Storm
      case 1:
        return "text-green-600"; // Language Problem
      case 2:
        return "text-amber-500"; // Misspelling
      case 3:
        return "text-purple-600"; // Special Storm
      default:
        return "text-red-600"; // Default to destructive
    }
  };

  const renderCell = (row: RetiredName, column: TableColumn<RetiredName>): ReactNode => {
    if (column.key === "name") {
      return <span className={`font-bold ${getNameColor(row)}`}>{row.name}</span>;
    }
    if (column.key === "note") {
      return row.note || "-";
    }
    return row[column.key] as ReactNode;
  };

  return (
    <SortableTable
      data={paginatedData}
      columns={columns}
      onRowClick={onNameClick}
      renderCell={renderCell}
    />
  );
};

export default RetiredNamesTable;
