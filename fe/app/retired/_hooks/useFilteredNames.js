import { useMemo } from "react";

export const useFilteredNames = ({
  retiredNames,
  searchName,
  selectedYear,
  selectedCountry,
  languageProblemFilter,
}) => {
  const filteredNames = useMemo(() => {
    let filtered = [...retiredNames];

    if (searchName) {
      filtered = filtered.filter((name) =>
        name.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    if (selectedYear) {
      filtered = filtered.filter((name) => name.lastYear === selectedYear);
    }

    if (selectedCountry) {
      filtered = filtered.filter((name) => name.country === selectedCountry);
    }

    if (languageProblemFilter === "true") {
      filtered = filtered.filter(
        (name) => Boolean(name.isLanguageProblem) === true
      );
    } else if (languageProblemFilter === "false") {
      filtered = filtered.filter(
        (name) => Boolean(name.isLanguageProblem) === false
      );
    }

    return filtered;
  }, [
    retiredNames,
    searchName,
    selectedYear,
    selectedCountry,
    languageProblemFilter,
  ]);

  const activeFilterCount = [
    searchName,
    selectedYear,
    selectedCountry,
    languageProblemFilter !== "all" ? languageProblemFilter : "",
  ].filter(Boolean).length;

  return { filteredNames, activeFilterCount };
};
