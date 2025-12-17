import { useMemo } from "react";

export const usePagination = ({
  retiredNames,
  filteredNames,
  activeFilterCount,
  currentLetter,
}) => {
  // Get available letters (letters that have retired names)
  const availableLettersMap = useMemo(() => {
    const map = {};
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
        (name) => name.name.charAt(0).toUpperCase() === currentLetter
      );
      return namesForLetter;
    }
  }, [retiredNames, filteredNames, activeFilterCount, currentLetter]);

  return { paginatedData, availableLettersMap };
};
