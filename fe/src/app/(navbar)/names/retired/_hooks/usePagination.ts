import { useMemo } from "react";
import type { RetiredName } from "../../../../../types";

interface UsePaginationParams {
  retiredNames: RetiredName[];
  filteredNames: RetiredName[];
  activeFilterCount: number;
  currentLetter: string;
}

interface UsePaginationReturn {
  paginatedData: RetiredName[];
  availableLettersMap: Record<string, boolean>;
}

export const usePagination = ({
  retiredNames,
  filteredNames,
  activeFilterCount,
  currentLetter,
}: UsePaginationParams): UsePaginationReturn => {
  // Get available letters (letters that have retired names)
  const availableLettersMap = useMemo(() => {
    const map: Record<string, boolean> = {};
    retiredNames.forEach((name) => {
      const letter = name.name.charAt(0).toUpperCase();
      map[letter] = true;
    });
    return map;
  }, [retiredNames]);

  const paginatedData = useMemo(() => {
    if (activeFilterCount > 0) {
      // If filters are applied, show all filtered items
      return filteredNames;
    } else {
      // Filter names by current letter
      const namesForLetter = retiredNames.filter(
        (name) => name.name.charAt(0).toUpperCase() === currentLetter,
      );
      return namesForLetter;
    }
  }, [retiredNames, filteredNames, activeFilterCount, currentLetter]);

  return { paginatedData, availableLettersMap };
};
