"use client";

import { useState, useEffect } from "react";
import fetchData from "../../../../containers/utils/fetcher";
import FilterModal from "./_components/FilterModal";
import FilterButton from "./_components/FilterButton";
import FilteredNamesTable from "./_components/FilteredNamesTable";
import Toggle from "./_components/Toggle";
import LetterNavigation from "./_components/LetterNavigation";
import PageHeader from "../../../../components/PageHeader";
import { useFilterState } from "./_hooks/useFilterState";
import { useFilteredNames } from "./_hooks/useFilteredNames";
import { useLetterNavigation } from "./_hooks/useLetterNavigation";

const FilterNamesPage = () => {
  const [names, setNames] = useState([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [showImageAndDescription, setShowImageAndDescription] = useState(false);

  // Custom hooks for state management
  const {
    searchName,
    selectedCountry,
    currentLetter,
    activeFilterCount,
    handleApplyFilters,
    handleLetterChange,
  } = useFilterState();

  // Fetch typhoon names data
  useEffect(() => {
    fetchData("/typhoon-names").then((data) => {
      if (data) {
        setNames(data.data);
      }
    });
  }, []);

  const { filteredNames, paginatedNames, countries } = useFilteredNames(
    names,
    searchName,
    selectedCountry,
    currentLetter
  );

  const { availableLetters, retiredLetters } =
    useLetterNavigation(filteredNames);

  const onApplyFilters = (filters) => {
    handleApplyFilters(filters);
    setIsFilterModalOpen(false);
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
        onApply={onApplyFilters}
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
