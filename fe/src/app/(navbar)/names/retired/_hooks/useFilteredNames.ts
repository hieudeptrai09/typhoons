import { useMemo } from "react";
import { RetiredName } from "../../../../../types";

interface UseFilteredNamesParams {
  retiredNames: RetiredName[];
  searchName: string;
  selectedYear: string;
  selectedCountry: string;
  retirementReason: string;
}

interface UseFilteredNamesReturn {
  filteredNames: RetiredName[];
  activeFilterCount: number;
}

export const useFilteredNames = ({
  retiredNames,
  searchName,
  selectedYear,
  selectedCountry,
  retirementReason,
}: UseFilteredNamesParams): UseFilteredNamesReturn => {
  const filteredNames = useMemo(() => {
    let filtered = [...retiredNames];

    if (searchName) {
      filtered = filtered.filter((name) =>
        name.name.toLowerCase().includes(searchName.toLowerCase()),
      );
    }

    if (selectedYear) {
      filtered = filtered.filter((name) => name.lastYear === Number(selectedYear));
    }

    if (selectedCountry) {
      filtered = filtered.filter((name) => name.country === selectedCountry);
    }

    if (retirementReason) {
      // Parse comma-separated values
      const selectedReasons = retirementReason.split(",").map(Number);

      filtered = filtered.filter((name) => {
        return selectedReasons.includes(name.isLanguageProblem);
      });
    }

    return filtered;
  }, [retiredNames, searchName, selectedYear, selectedCountry, retirementReason]);

  const activeFilterCount = [searchName, selectedYear, selectedCountry, retirementReason].filter(
    Boolean,
  ).length;

  return { filteredNames, activeFilterCount };
};
