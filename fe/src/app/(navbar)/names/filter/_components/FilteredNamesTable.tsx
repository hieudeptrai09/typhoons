import { useMemo, ReactNode } from "react";
import { Check, X, Frown } from "lucide-react";
import Image from "next/image";
import SortableTable, { TableColumn } from "../../../../../components/SortableTable";
import { TyphoonName } from "../../../../../types";

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
  const getNameColor = (name: TyphoonName): string => {
    if (name.isLanguageProblem === 2) return "text-amber-500";
    if (Boolean(name.isRetired)) return "text-red-600";
    return "text-blue-600";
  };

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

  const renderCell = (row: TyphoonName, column: TableColumn<TyphoonName>): ReactNode => {
    if (column.key === "name") {
      return <span className={`font-bold ${getNameColor(row)}`}>{row.name}</span>;
    }
    if (column.key === "image") {
      return (
        <>
          {row.image ? (
            <div className="relative max-h-52 min-h-24 min-w-28">
              <Image
                src={row.image}
                alt={row.name}
                fill
                className="rounded object-cover"
                unoptimized
              />
            </div>
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
      return Boolean(row.isRetired) ? (
        row.isLanguageProblem === 2 ? (
          <Check className="text-amber-500" size={20} />
        ) : (
          <Check className="text-red-600" size={20} />
        )
      ) : (
        <X className="text-gray-400" size={20} />
      );
    }
    return row[column.key] as ReactNode;
  };

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
