import { useTableSort } from "../../containers/hooks/useTableSort";
import SortableTableHeader from "./SortableTableHeader";

const SortableTable = ({ data, columns, onRowClick, renderCell }) => {
  const { sortedData, sortColumn, sortDirection, handleSort } =
    useTableSort(data);

  const defaultRenderCell = (row, column) => {
    return row[column.key];
  };

  const getCellRenderer = renderCell || defaultRenderCell;

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
                columnTitle={col.title}
                isSortable={col.isSortable !== false}
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
              className="hover:bg-gray-50 transition-colors cursor-pointer"
            >
              {columns.map((col) => (
                <td key={col.key} className="px-6 py-4 text-gray-600">
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
