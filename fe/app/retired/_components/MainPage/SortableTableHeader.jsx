const SortableTableHeader = ({
  label,
  columnKey,
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
      return <span className="text-green-600 font-semibold">↑</span>;
    }
    if (currentSortDirection === "desc") {
      return <span className="text-red-600 font-semibold">↓</span>;
    }
    return null;
  };

  return (
    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
      <button
        onClick={() => onSort(columnKey)}
        className="flex items-center gap-1 hover:text-blue-600 transition-colors w-full"
      >
        <span>{label}</span>
        {isSortable && <span className="text-lg">{getSortIcon()}</span>}
      </button>
    </th>
  );
};

export default SortableTableHeader;
