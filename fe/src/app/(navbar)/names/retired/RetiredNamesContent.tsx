"use client";

import { useState, useMemo } from "react";
import FrownNotFound from "../../../../components/components/FrownNotFound";
import LetterNavigation from "../../../../components/components/LetterNavigation";
import Loader from "../../../../components/components/Loader";
import PageHeader from "../../../../components/components/PageHeader";
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

  const {
    data: suggestionsRaw = [],
    loading: suggestionsLoading,
    error: suggestionsError,
  } = useFetchData<Suggestion[]>(
    selectedName.id ? `/suggested-names?nameId=${selectedName.id}` : "",
  );

  const isSuggestionsReady = !suggestionsLoading;
  const suggestions = isSuggestionsReady ? (suggestionsRaw ?? []) : [];

  const searchName = params.name || "";
  const selectedYear = params.year || "";
  const selectedCountry = params.country || "";
  const retirementReason = params.reason || "";
  const searchPosition = params.position || "";
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
      filtered = filtered.filter((name) => selectedReasons.includes(name.isLanguageProblem));
    }

    if (searchPosition) {
      filtered = filtered.filter((name) => name.position === Number(searchPosition));
    }

    const hasActiveFilters =
      searchName || selectedYear || selectedCountry || retirementReason || searchPosition;
    if (!hasActiveFilters) {
      filtered = filtered.filter((name) => name.name.charAt(0).toUpperCase() === currentLetter);
    }

    return filtered;
  }, [
    retiredNames,
    searchName,
    selectedYear,
    selectedCountry,
    retirementReason,
    searchPosition,
    currentLetter,
  ]);

  const availableLettersMap = useMemo(() => {
    const map: Record<string, boolean> = {};
    (retiredNames || []).forEach((name) => {
      const letter = name.name.charAt(0).toUpperCase();
      map[letter] = true;
    });
    return map;
  }, [retiredNames]);

  const activeFilterCount = [
    searchName,
    selectedYear,
    selectedCountry,
    retirementReason,
    searchPosition,
  ].filter(Boolean).length;

  const handleNameClick = (name: RetiredName) => {
    setSelectedName(name);
    setIsNameDetailsModalOpen(true);
  };

  const handleApplyFilters = (filters: FilterParams) => {
    setIsFilterModalOpen(false);

    const newParams: FilterParams & { letter?: string } = {
      name: filters.name,
      year: filters.year,
      country: filters.country,
      reason: filters.reason,
      position: filters.position,
    };

    if (
      !filters.name &&
      !filters.year &&
      !filters.country &&
      !filters.reason &&
      !filters.position
    ) {
      newParams.letter = currentLetter;
    }

    updateParams(newParams, true);
  };

  const handleLetterChange = (letter: string) => {
    updateParams({ name: "", year: "", country: "", reason: "", position: "", letter }, true);
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
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-100">
        <Loader size="lg" />
      </div>
    );
  }

  if (error) {
    return <FrownNotFound />;
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
          position: searchPosition,
        }}
      />

      {activeFilterCount === 0 && (
        <LetterNavigation onLetterChange={handleLetterChange} getLetterConfig={getLetterConfig} />
      )}

      <div className="mx-auto max-w-5xl">
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
          position: searchPosition,
        }}
      />

      <NameDetailsModal
        isOpen={isNameDetailsModalOpen}
        selectedName={selectedName}
        suggestions={suggestions}
        suggestionsLoading={suggestionsLoading || !isSuggestionsReady}
        suggestionsError={suggestionsError}
        onClose={() => setIsNameDetailsModalOpen(false)}
      />
    </PageHeader>
  );
};

export default RetiredNamesContent;
