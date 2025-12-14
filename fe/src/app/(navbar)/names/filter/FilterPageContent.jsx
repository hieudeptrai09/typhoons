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
  const [selectedLanguage, setSelectedLanguage] = useState("");

  // Toggle for showing images and descriptions
  const [showImageAndDescription, setShowImageAndDescription] = useState(false);

  // Pagination by letter
  const [currentLetter, setCurrentLetter] = useState("A");

  // Initialize filters from URL
  useEffect(() => {
    const name = searchParams.get("name") || "";
    const country = searchParams.get("country") || "";
    const language = searchParams.get("language") || "";
    const letter = searchParams.get("letter") || "A";

    setSearchName(name);
    setSelectedCountry(country);
    setSelectedLanguage(language);
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

  const languages = useMemo(() => {
    return [
      ...new Set(names.map((name) => name.language).filter(Boolean)),
    ].sort();
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

    if (selectedLanguage) {
      filtered = filtered.filter((name) => name.language === selectedLanguage);
    }

    return filtered;
  }, [names, searchName, selectedCountry, selectedLanguage]);

  // Sort by name and filter by current letter
  const paginatedNames = useMemo(() => {
    const sorted = [...filteredNames].sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    // If filters are active, show all results
    if (searchName || selectedCountry || selectedLanguage) {
      return sorted;
    }

    // Otherwise, filter by current letter
    return sorted.filter(
      (name) => name.name.charAt(0).toUpperCase() === currentLetter
    );
  }, [
    filteredNames,
    currentLetter,
    searchName,
    selectedCountry,
    selectedLanguage,
  ]);

  // Get available letters (letters that have names)
  const availableLetters = useMemo(() => {
    const letters = new Set();
    filteredNames.forEach((name) => {
      letters.add(name.name.charAt(0).toUpperCase());
    });
    return Array.from(letters).sort();
  }, [filteredNames]);

  // Get letters where ALL names are retired
  const retiredLetters = useMemo(() => {
    const letterGroups = {};

    // Group names by first letter
    filteredNames.forEach((name) => {
      const letter = name.name.charAt(0).toUpperCase();
      if (!letterGroups[letter]) {
        letterGroups[letter] = [];
      }
      letterGroups[letter].push(name);
    });

    // Check which letters have ALL retired names
    const fullyRetired = [];
    Object.entries(letterGroups).forEach(([letter, namesInLetter]) => {
      const allRetired = namesInLetter.every((name) =>
        Boolean(Number(name.isRetired))
      );
      if (allRetired) {
        fullyRetired.push(letter);
      }
    });

    return fullyRetired;
  }, [filteredNames]);

  const activeFilterCount = [
    searchName,
    selectedCountry,
    selectedLanguage,
  ].filter(Boolean).length;

  const updateURL = (filters, letter = currentLetter) => {
    const params = new URLSearchParams();
    if (filters.searchName) params.set("name", filters.searchName);
    if (filters.selectedCountry) params.set("country", filters.selectedCountry);
    if (filters.selectedLanguage)
      params.set("language", filters.selectedLanguage);
    if (
      !filters.searchName &&
      !filters.selectedCountry &&
      !filters.selectedLanguage
    ) {
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
    setSelectedLanguage(filters.selectedLanguage);
    setIsFilterModalOpen(false);
    updateURL(filters);
  };

  const handleLetterChange = (letter) => {
    setCurrentLetter(letter);
    updateURL(
      { searchName: "", selectedCountry: "", selectedLanguage: "" },
      letter
    );
  };

  return (
    <PageHeader title="Filter Names">
      <FilterButton
        onClick={() => setIsFilterModalOpen(true)}
        params={{
          name: searchName,
          country: selectedCountry,
          language: selectedLanguage,
        }}
      />

      {activeFilterCount === 0 && (
        <LetterNavigation
          currentLetter={currentLetter}
          availableLetters={availableLetters}
          retiredLetters={retiredLetters}
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
        languages={languages}
        initialFilters={{
          searchName,
          selectedCountry,
          selectedLanguage,
        }}
      />
    </PageHeader>
  );
};

export default FilterNamesPage;
