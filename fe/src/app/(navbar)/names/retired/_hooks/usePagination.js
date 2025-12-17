import { useMemo } from "react";

export const usePagination = ({
  retiredNames,
  filteredNames,
  activeFilterCount,
  currentLetter,
}) => {
  // Get available letters (letters that have retired names)
  const availableLetters = useMemo(() => {
    const letters = new Set();
    retiredNames.forEach((name) => {
      letters.add(name.name.charAt(0).toUpperCase());
    });
    return Array.from(letters).sort();
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

  return { paginatedData, availableLetters };
};
