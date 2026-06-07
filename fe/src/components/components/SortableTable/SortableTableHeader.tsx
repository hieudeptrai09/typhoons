import { Button } from "antd";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import type { SortDirection } from "../../../types";

interface SortableTableHeaderProps<T> {
  label: string;
  columnKey: keyof T;
  columnTitle?: string;
  currentSortColumn: keyof T | null;
  currentSortDirection: SortDirection;
  onSort: (column: keyof T) => void;
  isSortable: boolean;
}

const SortableTableHeader = <T,>({
  label,
  columnKey,
  columnTitle,
  currentSortColumn,
  currentSortDirection,
  onSort,
  isSortable,
}: SortableTableHeaderProps<T>) => {
  const isActive = currentSortColumn === columnKey;

  const getSortIcon = () => {
    if (!isActive) return <ArrowUpDown size={14} className="opacity-60" />;
    if (currentSortDirection === "asc")
      return <ArrowUp size={14} className="font-bold text-green-400" />;
    if (currentSortDirection === "desc")
      return <ArrowDown size={14} className="font-bold text-red-300" />;
    return null;
  };

  if (!isSortable) {
    return (
      <th className="px-6 py-3 text-left text-sm font-semibold text-white">
        <span>{label}</span>
      </th>
    );
  }

  return (
    <th className="px-6 py-3 text-left text-sm font-semibold text-white">
      <Button
        type="text"
        title={columnTitle}
        onClick={() => onSort(columnKey)}
        icon={getSortIcon()}
        iconPosition="end"
        className={`!p-0 !font-semibold !text-white hover:!bg-transparent hover:!text-blue-200 ${isActive ? "!underline underline-offset-4" : ""}`}
      >
        {label}
      </Button>
    </th>
  );
};

export default SortableTableHeader;
