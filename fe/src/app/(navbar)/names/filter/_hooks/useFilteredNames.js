import { useMemo } from "react";

export const useFilteredNames = (
  names,
  searchName,
  selectedCountry,
  currentLetter
) => {
  const filteredNames = useMemo(() => {
    let filtered = [...names];

    if (searchName) {
      filtered = filtered.filter((name) =>
        name.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    if (selectedCountry) {
      filtered = filtered.filter((name) => name.country === selectedCountry);
    }

    return filtered;
  }, [names, searchName, selectedCountry]);

  const paginatedNames = useMemo(() => {
    const sorted = [...filteredNames].sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    // If filters are active, show all results
    if (searchName || selectedCountry) {
      return sorted;
    }

    // Otherwise, filter by current letter
    return sorted.filter(
      (name) => name.name.charAt(0).toUpperCase() === currentLetter
    );
  }, [filteredNames, currentLetter, searchName, selectedCountry]);

  const countries = useMemo(() => {
    return [...new Set(names.map((name) => name.country))].sort();
  }, [names]);

  return {
    filteredNames,
    paginatedNames,
    countries,
  };
};
