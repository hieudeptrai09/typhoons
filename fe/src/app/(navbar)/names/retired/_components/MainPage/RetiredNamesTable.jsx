import SortableTable from "../../../../../../components/SortableTable";
import { Frown } from "lucide-react";

const RetiredNamesTable = ({ paginatedData, onNameClick }) => {
  if (!paginatedData || paginatedData.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <Frown className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No Results Found
        </h3>
        <p className="text-gray-500">
          No retired typhoon names match your current filters. Try adjusting
          your search criteria.
        </p>
      </div>
    );
  }

  const columns = [
    { key: "name", label: "Name", isSortable: true },
    { key: "meaning", label: "Meaning", isSortable: false },
    { key: "country", label: "Country", isSortable: true },
    { key: "note", label: "Note", isSortable: false },
    { key: "lastYear", label: "Year of last storm", isSortable: true },
  ];

  const getNameColor = (name) => {
    if (Boolean(Number(name.isLanguageProblem))) return "text-green-600";
    if (name.name === "Vamei") return "text-purple-600";
    return "text-red-600";
  };

  const renderCell = (row, column) => {
    if (column.key === "name") {
      return (
        <span className={`font-bold ${getNameColor(row)}`}>{row.name}</span>
      );
    }
    if (column.key === "note") {
      return row.note || "-";
    }
    return row[column.key];
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
