import NameRow from "./NameRow";
import SortableTableHeader from "./SortableTableHeader";
import { useTableSort } from "../../_hooks/useTableSort";

const RetiredNamesTable = ({ paginatedData, onNameClick }) => {
  const columns = [
    { key: "name", label: "Name", isSortable: true },
    { key: "meaning", label: "Meaning", isSortable: false },
    { key: "country", label: "Country", isSortable: true },
    { key: "note", label: "Note", isSortable: false },
    { key: "lastYear", label: "Year of last storm", isSortable: true },
  ];

  return (
    <div className="space-y-8">
      {paginatedData.map((group, gidx) => {
        // Use sorting hook for each group
        const { sortedData, sortColumn, sortDirection, handleSort } =
          useTableSort(group.items || []);

        return (
          <div key={gidx}>
            {group.country && (
              <h2 className="text-2xl font-bold text-blue-600 mb-4 pb-2 border-b-2 border-blue-200">
                {group.country}
              </h2>
            )}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    {columns.map((column) => (
                      <SortableTableHeader
                        key={column.key}
                        label={column.label}
                        columnKey={column.key}
                        isSortable={column.isSortable}
                        currentSortColumn={sortColumn}
                        currentSortDirection={sortDirection}
                        onSort={handleSort}
                      />
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sortedData.map((name, idx) => (
                    <NameRow
                      key={idx}
                      name={name}
                      onClick={() => onNameClick(name)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RetiredNamesTable;
