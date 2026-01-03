"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PageHeader from "../../../../components/PageHeader";
import fetchData from "../../../../containers/utils/fetcher";
import FilterButton from "./_components/FilterButton";
import FilteredNamesTable from "./_components/FilteredNamesTable";
import FilterModal from "./_components/FilterModal";
import LetterNavigation from "./_components/LetterNavigation";
import NameDetailsModal from "./_components/NameDetailsModal";
import Toggle from "./_components/Toggle";
import { categorizeLettersByStatus } from "./_utils/fns";
import { FilterParams, TyphoonName } from "../../../../types";

const FilterNamesPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [names, setNames] = useState<TyphoonName[]>([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isNameDetailsModalOpen, setIsNameDetailsModalOpen] = useState(false);
  const [selectedName, setSelectedName] = useState<TyphoonName | null>(null);

  // Toggle for showing images and descriptions
  const [showImageAndDescription, setShowImageAndDescription] = useState(false);

  // Initialize filters from URL
  const searchName = searchParams.get("name") || "";
  const selectedCountry = searchParams.get("country") || "";
  const selectedLanguage = searchParams.get("language") || "";
  const currentLetter = searchParams.get("letter") || "A";

  useEffect(() => {
    // Fetch all names (both current and retired)
    fetchData<TyphoonName[]>("/typhoon-names").then((data) => {
      if (data) {
        setNames(data.data);
      }
    });
  }, []);

  const countries = useMemo(() => {
    return [...new Set(names.map((name) => name.country))].sort();
  }, [names]);

  const languages = useMemo(() => {
    return [...new Set(names.map((name) => name.language).filter(Boolean))].sort();
  }, [names]);

  const filteredNames = useMemo(() => {
    let filtered = [...names];

    if (searchName) {
      filtered = filtered.filter((name) =>
        name.name.toLowerCase().includes(searchName.toLowerCase()),
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
    // If filters are active, show all results
    if (searchName || selectedCountry || selectedLanguage) {
      return filteredNames;
    }

    // Otherwise, filter by current letter
    return filteredNames.filter((name) => name.name.charAt(0).toUpperCase() === currentLetter);
  }, [filteredNames, currentLetter, searchName, selectedCountry, selectedLanguage]);

  // Categorize letters by their retired/alive status using optimized map
  const letterStatusMap = useMemo(() => {
    return categorizeLettersByStatus(filteredNames);
  }, [filteredNames]);

  const activeFilterCount = [searchName, selectedCountry, selectedLanguage].filter(Boolean).length;

  const updateURL = (filters: FilterParams, letter = currentLetter) => {
    const params = new URLSearchParams();
    if (filters.name) params.set("name", filters.name);
    if (filters.country) params.set("country", filters.country);
    if (filters.language) params.set("language", filters.language);
    if (!filters.name && !filters.country && !filters.language) {
      params.set("letter", letter);
    }

    const queryString = params.toString();
    const newURL = queryString ? `/names/filter?${queryString}` : "/names/filter";
    router.push(newURL);
  };

  const handleApplyFilters = (filters: FilterParams) => {
    setIsFilterModalOpen(false);
    updateURL(filters);
  };

  const handleLetterChange = (letter: string) => {
    updateURL({ name: "", country: "", language: "" }, letter);
  };

  const handleNameClick = (name: TyphoonName) => {
    setSelectedName(name);
    setIsNameDetailsModalOpen(true);
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
          letterStatusMap={letterStatusMap}
          onLetterChange={handleLetterChange}
        />
      )}

      {paginatedNames.length > 0 && (
        <Toggle value={showImageAndDescription} onChange={setShowImageAndDescription} />
      )}

      <FilteredNamesTable
        filteredNames={paginatedNames}
        showImageAndDescription={showImageAndDescription}
        onNameClick={handleNameClick}
      />

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyFilters}
        countries={countries}
        languages={languages}
        initialFilters={{
          name: searchName,
          country: selectedCountry,
          language: selectedLanguage,
        }}
      />

      <NameDetailsModal
        isOpen={isNameDetailsModalOpen}
        selectedName={selectedName}
        onClose={() => setIsNameDetailsModalOpen(false)}
      />
    </PageHeader>
  );
};

export default FilterNamesPage;
