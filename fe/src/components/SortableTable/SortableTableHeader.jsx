const SortableTableHeader = ({
  label,
  columnKey,
  columnTitle,
  currentSortColumn,
  currentSortDirection,
  onSort,
  isSortable,
}) => {
  const isActive = currentSortColumn === columnKey;

  const getSortIcon = () => {
    if (!isActive) {
      return <span className="text-gray-600">⇅</span>;
    }
    if (currentSortDirection === "asc") {
      return <span className="font-bold text-green-600">↑</span>;
    }
    if (currentSortDirection === "desc") {
      return <span className="font-bold text-red-600">↓</span>;
    }
    return null;
  };

  if (!isSortable) {
    return (
      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
        <span>{label}</span>
      </th>
    );
  }

  return (
    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
      <button
        onClick={() => onSort(columnKey)}
        className="flex w-full items-center gap-1 transition-colors hover:text-blue-600"
        title={columnTitle}
      >
        <span>{label}</span>
        <span className="text-lg">{getSortIcon()}</span>
      </button>
    </th>
  );
};

export default SortableTableHeader;
