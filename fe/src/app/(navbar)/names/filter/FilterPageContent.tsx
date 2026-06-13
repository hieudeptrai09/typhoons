"use client";

import { useState, useMemo } from "react";
import { Spin, Switch } from "antd";
import FrownNotFound from "../../../../components/components/FrownNotFound";
import LetterNavigation from "../../../../components/components/LetterNavigation";
import PageHeader from "../../../../components/components/PageHeader";
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

const toArr = (val: string) => (val ? val.split(",").filter(Boolean) : []);
const removeFromCommaString = (val: string, item: string) =>
  val
    .split(",")
    .filter((v) => v !== item)
    .join(",");

const FilterNamesContent = () => {
  const { params, updateParams } = useURLParams<FilterParams & { letter?: string }>();
  const { data: names, loading, error } = useFetchData<TyphoonName[]>("/typhoon-names");

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isNameDetailsModalOpen, setIsNameDetailsModalOpen] = useState(false);
  const [selectedName, setSelectedName] = useState<TyphoonName>(defaultTyphoonName);
  const [showImageAndDescription, setShowImageAndDescription] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const searchName = params.name || "";
  const searchPosition = params.position || "";
  const selectedCountry = params.country || "";
  const selectedLanguage = params.language || "";
  const selectedTag = params.tag || "";
  const currentLetter = params.letter || "A";

  const countryArr = toArr(selectedCountry);
  const languageArr = toArr(selectedLanguage);
  const tagArr = toArr(selectedTag);

  const countries = useMemo(
    () => [...new Set((names || []).map((n) => n.country))].sort(),
    [names],
  );
  const languages = useMemo(
    () => [...new Set((names || []).map((n) => n.language).filter(Boolean))].sort(),
    [names],
  );
  const tags = useMemo(
    () => [...new Set((names || []).map((n) => n.tag).filter(Boolean) as string[])].sort(),
    [names],
  );

  const displayedNames = useMemo(() => {
    let filtered = [...(names || [])];

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

    const hasActiveFilters =
      searchName ||
      countryArr.length > 0 ||
      languageArr.length > 0 ||
      tagArr.length > 0 ||
      searchPosition;

    if (!hasActiveFilters) {
      filtered = filtered.filter((n) => n.name.charAt(0).toUpperCase() === currentLetter);
    }

    return filtered;
  }, [names, searchName, countryArr, languageArr, tagArr, searchPosition, currentLetter]);

  const letterStatusMap = useMemo(() => categorizeLettersByStatus(names || []), [names]);

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
    const hasFilters =
      filters.name || filters.country || filters.language || filters.position || filters.tag;
    if (!hasFilters) newParams.letter = currentLetter;
    updateParams(newParams, true);
  };

  const handleRemoveTag = (key: keyof FilterParams, value?: string) => {
    const current = params[key] || "";

    const multiKeys: (keyof FilterParams)[] = ["country", "language", "tag"];
    const newVal = value && multiKeys.includes(key) ? removeFromCommaString(current, value) : "";

    const newParams = { ...params, [key]: newVal };

    const hasFilters =
      newParams.name ||
      newParams.country ||
      newParams.language ||
      newParams.position ||
      newParams.tag;
    if (!hasFilters) newParams.letter = currentLetter;

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

    if (!status?.[0]) return { isAvailable: false, color: "#d1d5db" };

    const hasRetired = status[1];
    const hasAlive = status[2];

    if (hasRetired && hasAlive) {
      return { isAvailable: true, color: isActive ? "#1e3a8a" : "#3b82f6", isActive };
    } else if (hasRetired && !hasAlive) {
      return { isAvailable: true, color: isActive ? "#991b1b" : "#ef4444", isActive };
    } else {
      return { isAvailable: true, color: isActive ? "#166534" : "#22c55e", isActive };
    }
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
            <div className="mx-auto mb-6 flex max-w-4xl items-center justify-end gap-3">
              <span className="text-sm font-semibold text-gray-700">
                Show Images & Descriptions
              </span>
              <Switch checked={showImageAndDescription} onChange={setShowImageAndDescription} />
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
        key={`${searchName}-${selectedCountry}-${selectedLanguage}-${searchPosition}-${selectedTag}`}
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
