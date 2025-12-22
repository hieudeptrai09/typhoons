import SortableTable from "../../../../../components/SortableTable";
import { Check, X, Frown } from "lucide-react";
import { useMemo } from "react";

const FilteredNamesTable = ({ filteredNames, showImageAndDescription }) => {
  if (filteredNames.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <Frown className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No Results Found
        </h3>
        <p className="text-gray-500">
          No typhoon names match your current filters. Try adjusting your search
          criteria.
        </p>
      </div>
    );
  }

  const getNameColor = (name) => {
    if (Number(name.isLanguageProblem) === 2) return "text-amber-500";
    if (Boolean(Number(name.isRetired))) return "text-red-600";
    return "text-blue-600";
  };

  const columns = useMemo(() => {
    const baseColumns = [
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
        { key: "description", label: "Description", isSortable: false }
      );
    }

    return baseColumns;
  }, [showImageAndDescription]);

  const renderCell = (row, column) => {
    if (column.key === "name") {
      return (
        <span className={`font-bold ${getNameColor(row)}`}>{row.name}</span>
      );
    }
    if (column.key === "image") {
      return (
        <>
          {row.image ? (
            <img
              src={row.image}
              alt={row.name}
              className="min-h-24 max-h-52 min-w-28 object-cover rounded"
            />
          ) : (
            <span className="text-gray-400">-</span>
          )}
        </>
      );
    }
    if (column.key === "description") {
      return <>{row.description || <span className="text-gray-400">-</span>}</>;
    }
    if (column.key === "isRetired") {
      return Boolean(Number(row.isRetired)) ? (
        <Check className="text-red-600" size={20} />
      ) : (
        <X className="text-gray-400" size={20} />
      );
    }
    return row[column.key];
  };

  return (
    <SortableTable
      data={filteredNames}
      columns={columns}
      renderCell={renderCell}
      className={showImageAndDescription ? "max-w-8xl" : "max-w-4xl"}
    />
  );
};

export default FilteredNamesTable;
