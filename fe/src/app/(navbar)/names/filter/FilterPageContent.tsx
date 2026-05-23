"use client";

import { useState, useMemo } from "react";
import FrownNotFound from "../../../../components/components/FrownNotFound";
import LetterNavigation from "../../../../components/components/LetterNavigation";
import Loader from "../../../../components/components/Loader";
import PageHeader from "../../../../components/components/PageHeader";
import Toggle from "../../../../components/components/Toggle";
import NameDetailsModal from "../../../../components/ui/NameDetailsModal";
import { defaultTyphoonName } from "../../../../constants";
import { useFetchData } from "../../../../containers/hooks/useFetchData";
import { useURLParams } from "../../../../containers/hooks/useURLParams";
import FilterButton from "./_components/FilterButton";
import FilteredNamesTable from "./_components/FilteredNamesTable";
import FilterModal from "./_components/FilterModal";
import FilterNamesGrid from "./_components/FilterNamesGrid";
import { categorizeLettersByStatus } from "./_utils/fns";
import type { FilterParams, TyphoonName } from "../../../../types";

type ViewMode = "list" | "table";

const FilterNamesContent = () => {
  const { params, updateParams } = useURLParams<FilterParams & { letter?: string }>();
  const { data: names, loading, error } = useFetchData<TyphoonName[]>("/typhoon-names");

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isNameDetailsModalOpen, setIsNameDetailsModalOpen] = useState(false);
  const [selectedName, setSelectedName] = useState<TyphoonName>(defaultTyphoonName);
  const [showImageAndDescription, setShowImageAndDescription] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const searchName = params.name || "";
  const selectedCountry = params.country || "";
  const selectedLanguage = params.language || "";
  const searchPosition = params.position || "";
  const selectedTag = params.tag || "";
  const currentLetter = params.letter || "A";

  const countries = useMemo(() => {
    return [...new Set((names || []).map((name) => name.country))].sort();
  }, [names]);

  const languages = useMemo(() => {
    return [...new Set((names || []).map((name) => name.language).filter(Boolean))].sort();
  }, [names]);

  const tags = useMemo(() => {
    return [...new Set((names || []).map((name) => name.tag).filter(Boolean) as string[])].sort();
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

    if (searchPosition) {
      filtered = filtered.filter((name) => name.position === Number(searchPosition));
    }

    if (selectedTag) {
      filtered = filtered.filter((name) => name.tag === selectedTag);
    }

    const hasActiveFilters =
      searchName || selectedCountry || selectedLanguage || searchPosition || selectedTag;
    if (!hasActiveFilters) {
      filtered = filtered.filter((name) => name.name.charAt(0).toUpperCase() === currentLetter);
    }

    return filtered;
  }, [
    names,
    searchName,
    selectedCountry,
    selectedLanguage,
    searchPosition,
    selectedTag,
    currentLetter,
  ]);

  const letterStatusMap = useMemo(() => {
    return categorizeLettersByStatus(names || []);
  }, [names]);

  const activeFilterCount = [
    searchName,
    selectedCountry,
    selectedLanguage,
    searchPosition,
    selectedTag,
  ].filter(Boolean).length;

  const handleApplyFilters = (filters: FilterParams) => {
    setIsFilterModalOpen(false);

    const newParams: FilterParams & { letter?: string } = {
      name: filters.name,
      country: filters.country,
      language: filters.language,
      position: filters.position,
      tag: filters.tag,
    };

    if (
      !filters.name &&
      !filters.country &&
      !filters.language &&
      !filters.position &&
      !filters.tag
    ) {
      newParams.letter = currentLetter;
    }

    updateParams(newParams, true);
  };

  const handleLetterChange = (letter: string) => {
    updateParams({ name: "", country: "", language: "", position: "", tag: "", letter }, true);
  };

  const handleNameClick = (name: TyphoonName) => {
    setSelectedName(name);
    setIsNameDetailsModalOpen(true);
  };

  const getLetterConfig = (letter: string) => {
    const status = letterStatusMap[letter];
    const isActive = currentLetter === letter;

    if (!status || !status[0]) {
      return { isAvailable: false, colorClass: "text-gray-300 cursor-not-allowed" };
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

    return { isAvailable: true, colorClass };
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
    <PageHeader title="Filter Names">
      <div className="mx-auto mb-3 max-w-4xl">
        <FilterButton
          onClick={() => setIsFilterModalOpen(true)}
          params={{
            name: searchName,
            country: selectedCountry,
            language: selectedLanguage,
            position: searchPosition,
            tag: selectedTag,
          }}
        />
      </div>

      <div className="mx-auto mb-6 flex max-w-4xl justify-center gap-6">
        {(["list", "table"] as ViewMode[]).map((mode) => (
          <label key={mode} className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="viewMode"
              value={mode}
              checked={viewMode === mode}
              onChange={() => setViewMode(mode)}
              className="accent-emerald-500"
            />
            <span className="text-sm font-semibold text-gray-700 capitalize">{mode}</span>
          </label>
        ))}
      </div>

      {activeFilterCount === 0 && (
        <LetterNavigation onLetterChange={handleLetterChange} getLetterConfig={getLetterConfig} />
      )}

      {viewMode === "list" ? (
        <>
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
        </>
      ) : (
        <FilterNamesGrid
          allNames={names || []}
          filteredNames={displayedNames}
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
        initialFilters={{
          name: searchName,
          country: selectedCountry,
          language: selectedLanguage,
          position: searchPosition,
          tag: selectedTag,
          letter: "",
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

export default FilterNamesContent;
