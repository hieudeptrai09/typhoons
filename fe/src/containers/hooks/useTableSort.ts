import { useState, useMemo } from "react";
import { SORTING_RANK, IntensityType } from "../../constants";

type SortDirection = "asc" | "desc" | null;

interface UseTableSortReturn<T> {
  sortedData: T[];
  sortColumn: keyof T | null;
  sortDirection: SortDirection;
  handleSort: (column: keyof T) => void;
}

export const useTableSort = <T extends Record<string, unknown>>(
  data: T[],
): UseTableSortReturn<T> => {
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = (column: keyof T): void => {
    if (sortColumn === column) {
      // Cycle through: asc -> desc -> null
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortDirection(null);
        setSortColumn(null);
      }
    } else {
      // New column, start with ascending
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedData = useMemo(() => {
    if (!sortColumn || !sortDirection) {
      return data;
    }

    const sorted = [...data].sort((a, b) => {
      let aValue: unknown = a[sortColumn];
      let bValue: unknown = b[sortColumn];

      if (sortColumn === "intensity") {
        aValue = SORTING_RANK[aValue as IntensityType];
        bValue = SORTING_RANK[bValue as IntensityType];
      }

      // Handle null/undefined values
      if (aValue == null) aValue = "";
      if (bValue == null) bValue = "";

      // Compare values
      let comparison: number;

      if (typeof aValue === "number" && typeof bValue === "number") {
        comparison = aValue - bValue;
      } else {
        // String comparison (includes fallback for other types)
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    return sorted;
  }, [data, sortColumn, sortDirection]);

  return {
    sortedData,
    sortColumn,
    sortDirection,
    handleSort,
  };
};
