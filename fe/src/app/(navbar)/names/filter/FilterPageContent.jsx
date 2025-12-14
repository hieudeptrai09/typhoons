"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import fetchData from "../../../../containers/utils/fetcher";
import FilterModal from "./_components/FilterModal";
import FilterButton from "./_components/FilterButton";
import FilteredNamesTable from "./_components/FilteredNamesTable";
import Toggle from "./_components/Toggle";
import LetterNavigation from "./_components/LetterNavigation";
import PageHeader from "../../../../components/PageHeader";

const FilterNamesPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [names, setNames] = useState([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Filter states
  const [searchName, setSearchName] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");

  // Toggle for showing images and descriptions
  const [showImageAndDescription, setShowImageAndDescription] = useState(false);

  // Pagination by letter
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

  useEffect(() => {
    // Fetch all names (both current and retired)
    fetchData("/typhoon-names").then((data) => {
      if (data) {
        setNames(data.data);
      }
    });
  }, []);

  const countries = useMemo(() => {
    return [...new Set(names.map((name) => name.country))].sort();
  }, [names]);

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

  // Sort by name and filter by current letter
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

  // Get available letters (letters that have names)
  const availableLetters = useMemo(() => {
    const letters = new Set();
    filteredNames.forEach((name) => {
      letters.add(name.name.charAt(0).toUpperCase());
    });
    return Array.from(letters).sort();
  }, [filteredNames]);

  const activeFilterCount = [searchName, selectedCountry].filter(
    Boolean
  ).length;

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
    setIsFilterModalOpen(false);
    updateURL(filters);
  };

  const handleLetterChange = (letter) => {
    setCurrentLetter(letter);
    updateURL({ searchName: "", selectedCountry: "" }, letter);
  };

  return (
    <PageHeader title="Filter Names">
      <FilterButton
        onClick={() => setIsFilterModalOpen(true)}
        params={{
          name: searchName,
          country: selectedCountry,
        }}
      />

      {activeFilterCount === 0 && (
        <LetterNavigation
          currentLetter={currentLetter}
          availableLetters={availableLetters}
          onLetterChange={handleLetterChange}
        />
      )}

      {paginatedNames.length > 0 && (
        <Toggle
          value={showImageAndDescription}
          onChange={setShowImageAndDescription}
        />
      )}

      <FilteredNamesTable
        filteredNames={paginatedNames}
        showImageAndDescription={showImageAndDescription}
      />

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyFilters}
        countries={countries}
        initialFilters={{
          searchName,
          selectedCountry,
        }}
      />
    </PageHeader>
  );
};

export default FilterNamesPage;
