"use client";

import { useState, useMemo } from "react";
import LetterNavigation from "../../../../components/LetterNavigation";
import NameDetailsModal from "../../../../components/NameDetailsModal";
import PageHeader from "../../../../components/PageHeader";
import Toggle from "../../../../components/Toggle";
import Waiting from "../../../../components/Waiting";
import { defaultTyphoonName } from "../../../../constants";
import { useFetchData } from "../../../../containers/hooks/useFetchData";
import { useURLParams } from "../../../../containers/hooks/useURLParams";
import FilterButton from "./_components/FilterButton";
import FilteredNamesTable from "./_components/FilteredNamesTable";
import FilterModal from "./_components/FilterModal";
import { categorizeLettersByStatus } from "./_utils/fns";
import type { FilterParams, TyphoonName } from "../../../../types";

const FilterNamesPage = () => {
  const { params, updateParams } = useURLParams<FilterParams & { letter?: string }>();
  const { data: names, loading, error } = useFetchData<TyphoonName[]>("/typhoon-names");

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isNameDetailsModalOpen, setIsNameDetailsModalOpen] = useState(false);
  const [selectedName, setSelectedName] = useState<TyphoonName>(defaultTyphoonName);
  const [showImageAndDescription, setShowImageAndDescription] = useState(false);

  // Get URL params with defaults
  const searchName = params.name || "";
  const selectedCountry = params.country || "";
  const selectedLanguage = params.language || "";
  const currentLetter = params.letter || "A";

  const countries = useMemo(() => {
    return [...new Set((names || []).map((name) => name.country))].sort();
  }, [names]);

  const languages = useMemo(() => {
    return [...new Set((names || []).map((name) => name.language).filter(Boolean))].sort();
  }, [names]);

  const displayedNames = useMemo(() => {
    let filtered = [...(names || [])];

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

    const hasActiveFilters = searchName || selectedCountry || selectedLanguage;
    if (!hasActiveFilters) {
      filtered = filtered.filter((name) => name.name.charAt(0).toUpperCase() === currentLetter);
    }

    return filtered;
  }, [names, searchName, selectedCountry, selectedLanguage, currentLetter]);

  const letterStatusMap = useMemo(() => {
    return categorizeLettersByStatus(names || []);
  }, [names]);

  const activeFilterCount = [searchName, selectedCountry, selectedLanguage].filter(Boolean).length;

  const handleApplyFilters = (filters: FilterParams) => {
    setIsFilterModalOpen(false);

    const newParams: FilterParams & { letter?: string } = {
      name: filters.name,
      country: filters.country,
      language: filters.language,
    };

    // Only include letter if no other filters
    if (!filters.name && !filters.country && !filters.language) {
      newParams.letter = currentLetter;
    }

    updateParams(newParams, true);
  };

  const handleLetterChange = (letter: string) => {
    updateParams({ name: "", country: "", language: "", letter }, true);
  };

  const handleNameClick = (name: TyphoonName) => {
    setSelectedName(name);
    setIsNameDetailsModalOpen(true);
  };

  const getLetterConfig = (letter: string) => {
    const status = letterStatusMap[letter];
    const isActive = currentLetter === letter;

    if (!status || !status[0]) {
      return {
        isAvailable: false,
        colorClass: "text-gray-300 cursor-not-allowed",
      };
    }

    const hasRetired = status[1];
    const hasAlive = status[2];

    let colorClass = "";

    if (hasRetired && hasAlive) {
      colorClass = isActive
        ? "text-blue-800 underline decoration-2"
        : "text-blue-500 hover:text-blue-600 hover:underline";
    } else if (hasRetired && !hasAlive) {
      colorClass = isActive
        ? "text-red-800 underline decoration-2"
        : "text-red-500 hover:text-red-600 hover:underline";
    } else if (!hasRetired && hasAlive) {
      colorClass = isActive
        ? "text-green-800 underline decoration-2"
        : "text-green-500 hover:text-green-600 hover:underline";
    }

    return {
      isAvailable: true,
      colorClass,
    };
  };

  if (loading) {
    return <Waiting content="Loading Current Names..." />;
  }

  if (error) {
    return <Waiting content="There are some errors during loading data..." />;
  }

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
        <LetterNavigation onLetterChange={handleLetterChange} getLetterConfig={getLetterConfig} />
      )}

      {displayedNames.length > 0 && (
        <div className="mx-auto mb-6 flex max-w-4xl items-center justify-end">
          <Toggle
            value={showImageAndDescription}
            onChange={setShowImageAndDescription}
            label="Show Images & Descriptions"
          />
        </div>
      )}

      <FilteredNamesTable
        filteredNames={displayedNames}
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
        name={selectedName}
        onClose={() => setIsNameDetailsModalOpen(false)}
      />
    </PageHeader>
  );
};

export default FilterNamesPage;
