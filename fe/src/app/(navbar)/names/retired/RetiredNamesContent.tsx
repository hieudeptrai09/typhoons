"use client";

import { useState, useMemo } from "react";
import LetterNavigation from "../../../../components/LetterNavigation";
import PageHeader from "../../../../components/PageHeader";
import Waiting from "../../../../components/Waiting";
import { defaultRetiredName } from "../../../../constants";
import { useFetchData } from "../../../../containers/hooks/useFetchData";
import { useURLParams } from "../../../../containers/hooks/useURLParams";
import FilterModal from "./_components/FilterModal";
import FilterButton from "./_components/MainPage/FilterButton";
import RetiredNamesTable from "./_components/MainPage/RetiredNamesTable";
import NameDetailsModal from "./_components/NameDetailsModal";
import type {
  RetiredName,
  Suggestion,
  RetiredFilterParams as FilterParams,
} from "../../../../types";

const RetiredNamesContent = () => {
  const [selectedName, setSelectedName] = useState<RetiredName>(defaultRetiredName);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isNameDetailsModalOpen, setIsNameDetailsModalOpen] = useState(false);

  const { params, updateParams } = useURLParams<FilterParams & { letter?: string }>();
  const {
    data: retiredNames,
    loading,
    error,
  } = useFetchData<RetiredName[]>("/typhoon-names?isRetired=1");
  const { data: suggestions = [], refetch: refetchSuggestions } = useFetchData<Suggestion[]>(
    selectedName.id ? `/suggested-names?nameId=${selectedName.id}` : "",
  );

  // Get URL params with defaults
  const searchName = params.name || "";
  const selectedYear = params.year || "";
  const selectedCountry = params.country || "";
  const retirementReason = params.reason || "";
  const currentLetter = params.letter || "A";

  const countries = [...new Set((retiredNames || []).map((name) => name.country))].sort();

  const displayedNames = useMemo(() => {
    let filtered = [...(retiredNames || [])];

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
      const selectedReasons = retirementReason.split(",").map(Number);
      filtered = filtered.filter((name) => {
        return selectedReasons.includes(name.isLanguageProblem);
      });
    }

    const hasActiveFilters = searchName || selectedYear || selectedCountry || retirementReason;
    if (!hasActiveFilters) {
      filtered = filtered.filter((name) => name.name.charAt(0).toUpperCase() === currentLetter);
    }

    return filtered;
  }, [retiredNames, searchName, selectedYear, selectedCountry, retirementReason, currentLetter]);

  const availableLettersMap = useMemo(() => {
    const map: Record<string, boolean> = {};
    (retiredNames || []).forEach((name) => {
      const letter = name.name.charAt(0).toUpperCase();
      map[letter] = true;
    });
    return map;
  }, [retiredNames]);

  const activeFilterCount = [searchName, selectedYear, selectedCountry, retirementReason].filter(
    Boolean,
  ).length;

  const handleNameClick = async (name: RetiredName) => {
    setSelectedName(name);
    setIsNameDetailsModalOpen(true);
    if (name.id) {
      refetchSuggestions();
    }
  };

  const handleApplyFilters = (filters: FilterParams) => {
    setIsFilterModalOpen(false);

    const newParams: FilterParams & { letter?: string } = {
      name: filters.name,
      year: filters.year,
      country: filters.country,
      reason: filters.reason,
    };

    // Only include letter if no other filters
    if (!filters.name && !filters.year && !filters.country && !filters.reason) {
      newParams.letter = currentLetter;
    }

    updateParams(newParams, true);
  };

  const handleLetterChange = (letter: string) => {
    updateParams(
      {
        name: "",
        year: "",
        country: "",
        reason: "",
        letter,
      },
      true,
    );
  };

  const getLetterConfig = (letter: string) => {
    const isAvailable = availableLettersMap[letter];
    const isActive = currentLetter === letter;

    return {
      isAvailable,
      colorClass: isActive
        ? "text-red-800 underline decoration-2 underline-offset-4"
        : isAvailable
          ? "text-red-500 underline-offset-4 hover:text-red-600 hover:underline"
          : "cursor-not-allowed text-gray-300",
    };
  };

  if (loading) {
    return <Waiting content="Loading Current Names..." />;
  }

  if (error) {
    return <Waiting content="There are some errors during loading data..." />;
  }

  return (
    <PageHeader title="Retired Typhoon Names">
      <FilterButton
        activeFilterCount={activeFilterCount}
        onClick={() => setIsFilterModalOpen(true)}
        params={{
          name: searchName,
          year: selectedYear,
          country: selectedCountry,
          reason: retirementReason,
        }}
      />

      {activeFilterCount === 0 && (
        <LetterNavigation onLetterChange={handleLetterChange} getLetterConfig={getLetterConfig} />
      )}

      <div className="mx-auto max-w-4xl">
        <RetiredNamesTable paginatedData={displayedNames} onNameClick={handleNameClick} />
      </div>

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyFilters}
        countries={countries}
        initialFilters={{
          name: searchName,
          year: selectedYear,
          country: selectedCountry,
          reason: retirementReason,
        }}
      />

      <NameDetailsModal
        isOpen={isNameDetailsModalOpen}
        selectedName={selectedName}
        suggestions={suggestions || []}
        onClose={() => setIsNameDetailsModalOpen(false)}
      />
    </PageHeader>
  );
};

export default RetiredNamesContent;
