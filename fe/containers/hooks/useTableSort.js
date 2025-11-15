import { useState, useMemo } from "react";
import { getRank } from "../utils/intensity";

export const useTableSort = (data) => {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);

  const handleSort = (column) => {
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
      let aValue = a[sortColumn];
      let bValue = b[sortColumn];

      if (sortColumn === "intensity") {
        aValue = getRank(aValue);
        bValue = getRank(bValue);
      }

      // Handle null/undefined values
      if (aValue == null) aValue = "";
      if (bValue == null) bValue = "";

      // Compare values
      let comparison;

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
