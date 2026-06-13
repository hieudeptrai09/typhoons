"use client";

import { useState, useMemo } from "react";
import { Spin } from "antd";
import FrownNotFound from "../../../../components/components/FrownNotFound";
import LetterNavigation from "../../../../components/components/LetterNavigation";
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

const DELIMITER = "|";

const toArr = (val: string) => (val ? val.split(DELIMITER).filter(Boolean) : []);
const removeFromDelimitedString = (val: string, item: string) =>
  val
    .split(DELIMITER)
    .filter((v) => v !== item)
    .join(DELIMITER);

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
  const searchPosition = params.position || "";
  const selectedCountry = params.country || "";
  const retirementReason = params.reason || "";
  const currentLetter = params.letter || "A";

  const countryArr = toArr(selectedCountry);
  const reasonArr = toArr(retirementReason).map(Number);

  const countries = [...new Set((retiredNames || []).map((n) => n.country))].sort();

  const displayedNames = useMemo(() => {
    let filtered = [...(retiredNames || [])];

    if (searchName) {
      filtered = filtered.filter((n) => n.name.toLowerCase().includes(searchName.toLowerCase()));
    }
    if (selectedYear) {
      filtered = filtered.filter((n) => n.lastYear === Number(selectedYear));
    }
    if (countryArr.length > 0) {
      filtered = filtered.filter((n) => countryArr.includes(n.country));
    }
    if (reasonArr.length > 0) {
      filtered = filtered.filter((n) => reasonArr.includes(n.isLanguageProblem));
    }
    if (searchPosition) {
      filtered = filtered.filter((n) => n.position === Number(searchPosition));
    }

    const hasActiveFilters =
      searchName || selectedYear || countryArr.length > 0 || reasonArr.length > 0 || searchPosition;

    if (!hasActiveFilters) {
      filtered = filtered.filter((n) => n.name.charAt(0).toUpperCase() === currentLetter);
    }

    return filtered;
  }, [
    retiredNames,
    searchName,
    selectedYear,
    countryArr,
    reasonArr,
    searchPosition,
    currentLetter,
  ]);

  const availableLettersMap = useMemo(() => {
    const map: Record<string, boolean> = {};
    (retiredNames || []).forEach((n) => {
      map[n.name.charAt(0).toUpperCase()] = true;
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
    const hasFilters =
      filters.name || filters.year || filters.country || filters.reason || filters.position;
    if (!hasFilters) newParams.letter = currentLetter;
    updateParams(newParams, true);
  };

  const handleRemoveTag = (key: keyof FilterParams, value?: string) => {
    const current = params[key] || "";

    const multiKeys: (keyof FilterParams)[] = ["country", "reason"];
    const newVal =
      value && multiKeys.includes(key) ? removeFromDelimitedString(current, value) : "";

    const newParams = { ...params, [key]: newVal };

    const hasFilters =
      newParams.name ||
      newParams.year ||
      newParams.country ||
      newParams.reason ||
      newParams.position;
    if (!hasFilters) newParams.letter = currentLetter;

    updateParams(newParams as FilterParams & { letter?: string }, true);
  };

  const handleLetterChange = (letter: string) => {
    updateParams({ name: "", year: "", country: "", reason: "", position: "", letter }, true);
  };

  const getLetterConfig = (letter: string) => {
    const isAvailable = availableLettersMap[letter];
    const isActive = currentLetter === letter;
    return {
      isAvailable,
      color: !isAvailable ? "#d1d5db" : isActive ? "#991b1b" : "#ef4444",
      isActive: !!isAvailable && isActive,
    };
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-100">
        <Spin size="large" />
      </div>
    );
  }

  if (error) return <FrownNotFound />;

  return (
    <PageHeader title="Retired Typhoon Names">
      <FilterButton
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
