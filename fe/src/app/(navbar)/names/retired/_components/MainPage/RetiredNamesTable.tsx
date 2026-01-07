import { Frown } from "lucide-react";
import SortableTable from "../../../../../../components/SortableTable";
import { createRenderCell } from "../../../../../../containers/utils/cellRenderers";
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

  // Define color logic for each cell
  const getCellConfig = (row: RetiredName, key: keyof RetiredName) => {
    if (key === "name") {
      // Color based on retirement reason
      let colorClass = "text-red-600"; // Default: Destructive Storm

      switch (row.isLanguageProblem) {
        case 0:
          colorClass = "text-red-600"; // Destructive Storm
          break;
        case 1:
          colorClass = "text-green-600"; // Language Problem
          break;
        case 2:
          colorClass = "text-amber-500"; // Misspelling
          break;
        case 3:
          colorClass = "text-purple-600"; // Special Storm
          break;
      }

      return { className: `font-semibold ${colorClass}` };
    }

    return {};
  };

  const renderCell = createRenderCell<RetiredName>(getCellConfig);

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
