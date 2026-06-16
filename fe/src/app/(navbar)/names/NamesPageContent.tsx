"use client";

import { useMemo, useState } from "react";
import { Segmented, Spin, Switch } from "antd";
import FrownNotFound from "../../../components/components/FrownNotFound";
import LetterNavigation from "../../../components/components/LetterNavigation";
import PageHeader from "../../../components/components/PageHeader";
import HistoryModal from "../../../components/ui/HistoryModal";
import NameDetailsModal from "../../../components/ui/NameDetailsModal";
import { defaultRetiredName } from "../../../constants";
import { useFetchData } from "../../../containers/hooks/useFetchData";
import { useURLParams } from "../../../containers/hooks/useURLParams";
import { toArr } from "../../../containers/utils/fns";
import FilterButton from "./_components/FilterButton";
import FilterModal from "./_components/FilterModal";
import NamesGrid from "./_components/NamesGrid";
import NamesListTable from "./_components/NamesListTable";
import type { NamesFilterParams, RetiredName, Suggestion } from "../../../types";

const STATUS_OPTIONS = [
  { label: "Current", value: "current" },
  { label: "Retired", value: "retired" },
];

const VIEW_OPTIONS = [
  { label: "Grid", value: "grid" },
  { label: "List", value: "list" },
];

const NamesPageContent = () => {
  const { params, updateParams } = useURLParams<NamesFilterParams>();

  const [showHistory, setShowHistory] = useState(false);
  const [showName, setShowName] = useState(true);
  const [showImageAndDescription, setShowImageAndDescription] = useState(false);
  const [showLetterNav, setShowLetterNav] = useState(false);

  const [selectedName, setSelectedName] = useState<RetiredName>(defaultRetiredName);
  const [isNameDetailsModalOpen, setIsNameDetailsModalOpen] = useState(false);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const [historyPosition, setHistoryPosition] = useState(0);
  const [historyPositionNames, setHistoryPositionNames] = useState<RetiredName[]>([]);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const {
    data: allNamesRaw,
    loading: allLoading,
    error: allError,
  } = useFetchData<RetiredName[]>("/typhoon-names");
  const {
    data: currentNamesRaw,
    loading: currentLoading,
    error: currentError,
  } = useFetchData<RetiredName[]>("/typhoon-names?isRetired=0");

  const status = params.status || "current";
  const view = params.view || "grid";
  const showRetiredFields = status === "retired";

  const searchName = params.name || "";
  const selectedCountry = params.country || "";
  const selectedLanguage = params.language || "";
  const selectedTag = params.tag || "";
  const searchPosition = params.position || "";
  const selectedYear = params.year || "";
  const retirementReason = params.reason || "";
  const currentLetter = params.letter || "A";

  const countryArr = toArr(selectedCountry);
  const languageArr = toArr(selectedLanguage);
  const tagArr = toArr(selectedTag);
  const reasonArr = toArr(retirementReason).map(Number);

  const allNames = useMemo(() => allNamesRaw ?? [], [allNamesRaw]);

  const pool = useMemo(() => {
    if (status === "retired") {
      return allNames.filter((n) => Boolean(n.isRetired));
    }
    return (currentNamesRaw ?? []).filter((n) => n.isLanguageProblem !== 2);
  }, [status, allNames, currentNamesRaw]);

  const countries = useMemo(() => [...new Set(pool.map((n) => n.country))].sort(), [pool]);
  const languages = useMemo(
    () => [...new Set(pool.map((n) => n.language).filter(Boolean))].sort(),
    [pool],
  );
  const tags = useMemo(() => [...new Set(pool.map((n) => n.tag).filter(Boolean))].sort(), [pool]);

  const displayedNames = useMemo(() => {
    let filtered = [...pool];

    if (searchName) {
      filtered = filtered.filter((n) => n.name.toLowerCase().includes(searchName.toLowerCase()));
    }
    if (countryArr.length > 0) {
      filtered = filtered.filter((n) => countryArr.includes(n.country));
    }
    if (languageArr.length > 0) {
      filtered = filtered.filter((n) => languageArr.includes(n.language));
    }
    if (tagArr.length > 0) {
      filtered = filtered.filter((n) => tagArr.includes(n.tag));
    }
    if (searchPosition) {
      filtered = filtered.filter((n) => n.position === Number(searchPosition));
    }
    if (showRetiredFields && selectedYear) {
      filtered = filtered.filter((n) => n.lastYear === Number(selectedYear));
    }
    if (showRetiredFields && reasonArr.length > 0) {
      filtered = filtered.filter((n) => reasonArr.includes(n.isLanguageProblem));
    }

    const hasActiveFilters =
      searchName ||
      countryArr.length > 0 ||
      languageArr.length > 0 ||
      tagArr.length > 0 ||
      searchPosition ||
      (showRetiredFields && (selectedYear || reasonArr.length > 0));

    if (!hasActiveFilters && showLetterNav) {
      filtered = filtered.filter((n) => n.name.charAt(0).toUpperCase() === currentLetter);
    }

    return filtered;
  }, [
    pool,
    searchName,
    countryArr,
    languageArr,
    tagArr,
    searchPosition,
    showRetiredFields,
    selectedYear,
    reasonArr,
    currentLetter,
    showLetterNav,
  ]);

  const availableLetters = useMemo(
    () => new Set(pool.map((n) => n.name.charAt(0).toUpperCase())),
    [pool],
  );

  const activeFilterCount = [
    searchName,
    selectedCountry,
    selectedLanguage,
    selectedTag,
    searchPosition,
    ...(showRetiredFields ? [selectedYear, retirementReason] : []),
  ].filter(Boolean).length;

  const showSuggestions = Boolean(selectedName.isRetired);
  const {
    data: suggestionsRaw,
    loading: suggestionsLoading,
    error: suggestionsError,
  } = useFetchData<Suggestion[]>(
    showSuggestions && selectedName.id ? `/suggested-names?nameId=${selectedName.id}` : "",
  );

  const handleStatusChange = (value: string) => {
    updateParams({
      status: value,
      name: "",
      country: "",
      language: "",
      tag: "",
      position: "",
      year: "",
      reason: "",
      letter: "",
    });
  };

  const handleViewChange = (value: string) => {
    updateParams({ view: value });
  };

  const handleApplyFilters = (filters: NamesFilterParams) => {
    setIsFilterModalOpen(false);
    const hasFilters =
      filters.name ||
      filters.country ||
      filters.language ||
      filters.tag ||
      filters.position ||
      (showRetiredFields && (filters.year || filters.reason));

    updateParams({
      name: filters.name,
      country: filters.country,
      language: filters.language,
      tag: filters.tag,
      position: filters.position,
      year: filters.year,
      reason: filters.reason,
      letter: hasFilters ? "" : currentLetter,
    });
  };

  const handleLetterChange = (letter: string) => {
    updateParams(
      { name: "", country: "", language: "", tag: "", position: "", year: "", reason: "", letter },
    );
  };

  const handleNameClick = (name: RetiredName) => {
    setSelectedName(name);
    setIsNameDetailsModalOpen(true);
  };

  const handlePositionClick = (position: number, historyNames: RetiredName[]) => {
    setHistoryPosition(position);
    setHistoryPositionNames(historyNames);
    setIsHistoryModalOpen(true);
  };

  const getLetterConfig = (letter: string) => {
    const isActive = currentLetter === letter;

    if (!availableLetters.has(letter)) return { isAvailable: false, color: "#d1d5db" };

    const color = showRetiredFields
      ? isActive
        ? "#991b1b"
        : "#ef4444"
      : isActive
        ? "#166534"
        : "#22c55e";

    return { isAvailable: true, color, isActive };
  };

  if (allLoading || currentLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-100">
        <Spin size="large" />
      </div>
    );
  }

  if (allError || currentError) return <FrownNotFound />;

  return (
    <PageHeader title="Typhoon Names">
      <div className="mx-auto mb-4 flex max-w-4xl flex-wrap items-center justify-center gap-4">
        <Segmented options={STATUS_OPTIONS} value={status} onChange={handleStatusChange} />
        <Segmented options={VIEW_OPTIONS} value={view} onChange={handleViewChange} />
      </div>

      <FilterButton onClick={() => setIsFilterModalOpen(true)} count={activeFilterCount} />

      <div className="mx-auto mb-4 flex max-w-4xl flex-wrap items-center justify-end gap-6">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-700">Show Letter Navigation</span>
          <Switch checked={showLetterNav} onChange={setShowLetterNav} />
        </div>
      </div>

      {showLetterNav && activeFilterCount === 0 && (
        <LetterNavigation onLetterChange={handleLetterChange} getLetterConfig={getLetterConfig} />
      )}

      <div className="mx-auto mb-4 flex max-w-4xl flex-wrap items-center justify-end gap-6">
        {view === "grid" ? (
          <>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-700">Show Name</span>
              <Switch checked={showName} onChange={setShowName} />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-700">Show History</span>
              <Switch checked={showHistory} onChange={setShowHistory} />
            </div>
          </>
        ) : (
          displayedNames.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-700">
                Show Images &amp; Descriptions
              </span>
              <Switch checked={showImageAndDescription} onChange={setShowImageAndDescription} />
            </div>
          )
        )}
      </div>

      {view === "grid" ? (
        <NamesGrid
          displayedNames={displayedNames}
          allNames={allNames}
          showHistory={showHistory}
          showName={showName}
          onNameClick={handleNameClick}
          onPositionClick={handlePositionClick}
        />
      ) : (
        <NamesListTable
          names={displayedNames}
          showRetiredColumns={showRetiredFields}
          showImageAndDescription={showImageAndDescription}
          onNameClick={handleNameClick}
        />
      )}

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyFilters}
        countries={countries}
        languages={languages}
        tags={tags}
        showRetiredFields={showRetiredFields}
        initialFilters={{
          name: searchName,
          country: selectedCountry,
          language: selectedLanguage,
          tag: selectedTag,
          position: searchPosition,
          year: selectedYear,
          reason: retirementReason,
          status,
          view,
          letter: currentLetter,
        }}
      />

      <NameDetailsModal
        isOpen={isNameDetailsModalOpen}
        onClose={() => setIsNameDetailsModalOpen(false)}
        name={selectedName}
        suggestions={showSuggestions ? suggestionsRaw ?? [] : undefined}
        suggestionsLoading={suggestionsLoading}
        suggestionsError={suggestionsError}
      />

      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        position={historyPosition}
        positionNames={historyPositionNames}
      />
    </PageHeader>
  );
};

export default NamesPageContent;
