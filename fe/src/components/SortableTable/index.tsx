import { ReactNode } from "react";
import { useTableSort } from "../../containers/hooks/useTableSort";
import SortableTableHeader from "./SortableTableHeader";
import { TableColumn } from "../../types";
export type { TableColumn };

interface SortableTableProps<T extends Record<string, unknown>> {
  data: T[];
  columns: TableColumn<T>[];
  onRowClick?: (row: T) => void;
  renderCell?: (row: T, column: TableColumn<T>) => ReactNode;
  className?: string;
}

const SortableTable = <T extends Record<string, unknown>>({
  data,
  columns,
  onRowClick,
  renderCell,
  className = "max-w-4xl",
}: SortableTableProps<T>) => {
  const { sortedData, sortColumn, sortDirection, handleSort } = useTableSort(data);

  const defaultRenderCell = (row: T, column: TableColumn<T>): ReactNode => {
    return row[column.key] as ReactNode;
  };

  const getCellRenderer = renderCell || defaultRenderCell;

  return (
    <div className={`mx-auto overflow-x-auto ${className}`}>
      <table className="min-w-full overflow-hidden rounded-lg bg-white shadow-md">
        <thead className="bg-stone-200">
          <tr>
            {columns.map((col) => (
              <SortableTableHeader
                key={String(col.key)}
                label={col.label}
                columnKey={col.key}
                columnTitle={col.title}
                isSortable={col.isSortable !== false}
                currentSortColumn={sortColumn}
                currentSortDirection={sortDirection}
                onSort={handleSort}
              />
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-300">
          {sortedData.map((row, idx) => (
            <tr
              key={idx}
              onClick={() => onRowClick && onRowClick(row)}
              className="cursor-pointer transition-colors hover:bg-gray-100"
            >
              {columns.map((col) => (
                <td key={String(col.key)} className="px-6 py-4 text-gray-600">
                  {getCellRenderer(row, col)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SortableTable;
