import { useMemo } from "react";

export const useFilteredNames = ({
  retiredNames,
  searchName,
  selectedYear,
  selectedCountry,
  retirementReasons,
}) => {
  const filteredNames = useMemo(() => {
    let filtered = [...retiredNames];

    if (searchName) {
      filtered = filtered.filter((name) =>
        name.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    if (selectedYear) {
      filtered = filtered.filter((name) => name.lastYear === String(selectedYear));
    }

    if (selectedCountry) {
      filtered = filtered.filter((name) => name.country === selectedCountry);
    }

    if (retirementReasons.length > 0) {
      filtered = filtered.filter((name) => {
        const isLanguageProblem = Boolean(Number(name.isLanguageProblem));

        // Check if name matches any selected reason
        if (retirementReasons.includes("language") && isLanguageProblem) {
          return true;
        }
        if (retirementReasons.includes("destructive") && !isLanguageProblem) {
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
    retirementReasons,
  ]);

  const activeFilterCount = [
    searchName,
    selectedYear,
    selectedCountry,
    retirementReasons.length > 0 ? "reasons" : "",
  ].filter(Boolean).length;

  return { filteredNames, activeFilterCount };
};
