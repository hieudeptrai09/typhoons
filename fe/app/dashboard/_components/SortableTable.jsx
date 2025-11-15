import { useTableSort } from "../_hooks/useTableSort";
import SortableTableHeader from "./SortableTableHeader";

export const SortableTable = ({ data, columns, onRowClick }) => {
  const { sortedData, sortColumn, sortDirection, handleSort } =
    useTableSort(data);

  return (
    <div className="overflow-x-auto max-w-4xl mx-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col) => (
              <SortableTableHeader
                key={col.key}
                label={col.label}
                columnKey={col.key}
                currentSortColumn={sortColumn}
                currentSortDirection={sortDirection}
                onSort={handleSort}
              />
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sortedData.map((row, idx) => (
            <tr
              key={idx}
              onClick={() => onRowClick && onRowClick(row)}
              className={
                onRowClick
                  ? "hover:bg-gray-50 transition-colors cursor-pointer"
                  : ""
              }
            >
              {columns.map((col) => (
                <td key={col.key} className="px-6 py-4 text-gray-600">
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
