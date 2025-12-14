import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export const useFilterState = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchName, setSearchName] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [currentLetter, setCurrentLetter] = useState("A");

  // Initialize filters from URL
  useEffect(() => {
    const name = searchParams.get("name") || "";
    const country = searchParams.get("country") || "";
    const letter = searchParams.get("letter") || "A";

    setSearchName(name);
    setSelectedCountry(country);
    setCurrentLetter(letter);
  }, [searchParams]);

  const updateURL = (filters, letter = currentLetter) => {
    const params = new URLSearchParams();
    if (filters.searchName) params.set("name", filters.searchName);
    if (filters.selectedCountry) params.set("country", filters.selectedCountry);
    if (!filters.searchName && !filters.selectedCountry) {
      params.set("letter", letter);
    }

    const queryString = params.toString();
    const newURL = queryString
      ? `/names/filter?${queryString}`
      : "/names/filter";
    router.push(newURL);
  };

  const handleApplyFilters = (filters) => {
    setSearchName(filters.searchName);
    setSelectedCountry(filters.selectedCountry);
    updateURL(filters);
  };

  const handleLetterChange = (letter) => {
    setCurrentLetter(letter);
    updateURL({ searchName: "", selectedCountry: "" }, letter);
  };

  const activeFilterCount = [searchName, selectedCountry].filter(
    Boolean
  ).length;

  return {
    searchName,
    selectedCountry,
    currentLetter,
    activeFilterCount,
    handleApplyFilters,
    handleLetterChange,
  };
};
