import { useMemo } from "react";

export const useFilteredNames = ({
  retiredNames,
  searchName,
  selectedYear,
  selectedCountry,
  retirementReason,
}) => {
  const filteredNames = useMemo(() => {
    let filtered = [...retiredNames];

    if (searchName) {
      filtered = filtered.filter((name) =>
        name.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    if (selectedYear) {
      filtered = filtered.filter(
        (name) => name.lastYear === String(selectedYear)
      );
    }

    if (selectedCountry) {
      filtered = filtered.filter((name) => name.country === selectedCountry);
    }

    if (retirementReason) {
      filtered = filtered.filter((name) => {
        const isLanguageProblem = Boolean(Number(name.isLanguageProblem));

        if (retirementReason === "language" && isLanguageProblem) {
          return true;
        }
        if (retirementReason === "destructive" && !isLanguageProblem) {
          return true;
        }
        return false;
      });
    }

    return filtered;
  }, [
    retiredNames,
    searchName,
    selectedYear,
    selectedCountry,
    retirementReason,
  ]);

  const activeFilterCount = [
    searchName,
    selectedYear,
    selectedCountry,
    retirementReason,
  ].filter(Boolean).length;

  return { filteredNames, activeFilterCount };
};
