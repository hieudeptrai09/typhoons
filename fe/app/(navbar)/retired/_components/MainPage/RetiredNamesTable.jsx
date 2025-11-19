import SortableTable from "../../../../../components/SortableTable";

const RetiredNamesTable = ({ paginatedData, onNameClick }) => {
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
    <div className="space-y-8">
      {paginatedData.map((group, gidx) => (
        <div key={gidx}>
          {group.country && (
            <h2 className="text-2xl font-bold text-blue-600 mb-4 pb-2 border-b-2 border-blue-200">
              {group.country}
            </h2>
          )}
          <SortableTable
            data={group.items || []}
            columns={columns}
            onRowClick={onNameClick}
            renderCell={renderCell}
          />
        </div>
      ))}
    </div>
  );
};

export default RetiredNamesTable;
