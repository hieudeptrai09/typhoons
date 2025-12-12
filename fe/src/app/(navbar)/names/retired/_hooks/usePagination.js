import { useMemo } from "react";

export const usePagination = ({
  retiredNames,
  filteredNames,
  activeFilterCount,
  currentPage,
}) => {
  const paginatedData = useMemo(() => {
    let result = [];

    if (activeFilterCount > 0) {
      // If a condition is applied, show all items
      result.push({
        country: "",
        items: filteredNames,
      });
    } else {
      // Group by country and paginate
      const groupedByCountry = {};
      retiredNames.forEach((name) => {
        if (!groupedByCountry[name.country]) {
          groupedByCountry[name.country] = [];
        }
        groupedByCountry[name.country].push(name);
      });

      const countryKeys = Object.keys(groupedByCountry).sort();

      result.push({
        country: countryKeys[currentPage - 1],
        items: groupedByCountry[countryKeys[currentPage - 1]] || [],
      });
    }

    return result;
  }, [retiredNames, filteredNames, activeFilterCount, currentPage]);

  const totalPages = 14;

  return { paginatedData, totalPages };
};
