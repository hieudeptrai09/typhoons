import { useMemo } from "react";
import { Frown } from "lucide-react";
import SortableTable from "../../../../../components/SortableTable";
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
  const columns = useMemo(() => {
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

    return baseColumns;
  }, [showImageAndDescription]);

  // Define color/style logic for each cell
  const getCellConfig = (row: TyphoonName, key: keyof TyphoonName) => {
    if (key === "name") {
      // Determine name color based on status
      let colorClass = "text-green-700";
      if (row.isLanguageProblem === 2) {
        colorClass = "text-amber-500";
      } else if (Boolean(row.isRetired)) {
        colorClass = "text-red-600";
      }
      return { className: `font-semibold ${colorClass}` };
    }

    if (key === "isRetired") {
      // Color for retired icon based on status
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

  if (filteredNames.length === 0) {
    return (
      <div className="mx-auto max-w-4xl p-8 text-center">
        <Frown className="mx-auto mb-4 h-16 w-16 text-gray-400" />
        <h3 className="mb-2 text-xl font-semibold text-gray-700">No Results Found</h3>
        <p className="text-gray-500">
          No typhoon names match your current filters. Try adjusting your search criteria.
        </p>
      </div>
    );
  }

  return (
    <SortableTable
      data={filteredNames}
      columns={columns}
      onRowClick={onNameClick}
      renderCell={renderCell}
      className={showImageAndDescription ? "max-w-8xl" : "max-w-4xl"}
    />
  );
};

export default FilteredNamesTable;
