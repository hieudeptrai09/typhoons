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
      // Parse comma-separated values
      const selectedReasons = retirementReason.split(",");

      filtered = filtered.filter((name) => {
        const ilp = String(name.isLanguageProblem);
        // Check if the name's isLanguageProblem value is in the selected reasons
        return selectedReasons.includes(ilp);
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
