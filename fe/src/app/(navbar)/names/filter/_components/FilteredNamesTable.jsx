import SortableTable from "../../../../../components/SortableTable";
import { Check, X } from "lucide-react";
import { useMemo } from "react";

const FilteredNamesTable = ({ filteredNames, showImageAndDescription }) => {
  const getNameColor = (name) => {
    if (Boolean(Number(name.isRetired))) return "text-red-600";
    return "text-blue-600";
  };

  const columns = useMemo(() => {
    const baseColumns = [
      { key: "isRetired", label: "Retired", isSortable: true },
      { key: "name", label: "Name", isSortable: true },
      { key: "country", label: "Country", isSortable: true },
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
              className="w-24 h-24 object-cover rounded"
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
    />
  );
};

export default FilteredNamesTable;
