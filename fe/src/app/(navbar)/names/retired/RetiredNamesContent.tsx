"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PageHeader from "../../../../components/PageHeader";
import fetchData from "../../../../containers/utils/fetcher";
import FilterModal from "./_components/FilterModal";
import FilterButton from "./_components/MainPage/FilterButton";
import LetterNavigation from "./_components/MainPage/LetterNavigation";
import RetiredNamesTable from "./_components/MainPage/RetiredNamesTable";
import NameDetailsModal from "./_components/NameDetailsModal";
import { useFilteredNames } from "./_hooks/useFilteredNames";
import { usePagination } from "./_hooks/usePagination";

interface RetiredName {
  id: number;
  name: string;
  meaning: string;
  country: string;
  position: number;
  language: string;
  isLanguageProblem: number;
  lastYear: number;
  note?: string;
  image?: string;
  description?: string;
}

interface Suggestion {
  replacementName: string;
  replacementMeaning: string;
  isChosen: number;
  image?: string;
}

interface FilterParams {
  searchName: string;
  selectedYear: string;
  selectedCountry: string;
  retirementReason: string;
}

const RetiredNamesContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [retiredNames, setRetiredNames] = useState<RetiredName[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedName, setSelectedName] = useState<RetiredName | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Initialize filters from URL parameters
  const searchName = searchParams.get("name") || "";
  const selectedYear = searchParams.get("year") || "";
  const selectedCountry = searchParams.get("country") || "";
  const retirementReason = searchParams.get("lang") || "";
  const currentLetter = searchParams.get("letter") || "A";

  // Update URL when filters change
  const updateURL = (filters: FilterParams, letter: string = currentLetter) => {
    const params = new URLSearchParams();

    if (filters.searchName) {
      params.set("name", filters.searchName);
    }
    if (filters.selectedYear) {
      params.set("year", filters.selectedYear.toString());
    }
    if (filters.selectedCountry) {
      params.set("country", filters.selectedCountry);
    }
    if (filters.retirementReason) {
      params.set("lang", filters.retirementReason);
    }

    // Only add letter parameter if no filters are active
    if (
      !filters.searchName &&
      !filters.selectedYear &&
      !filters.selectedCountry &&
      !filters.retirementReason
    ) {
      params.set("letter", letter);
    }

    const queryString = params.toString();
    const newURL = queryString ? `/names/retired?${queryString}` : "/names/retired";
    router.push(newURL);
  };

  useEffect(() => {
    fetchData<RetiredName[]>("/typhoon-names?isRetired=1").then((data) => {
      if (data) {
        setRetiredNames(data.data);
      }
    });
  }, []);

  const countries = [...new Set(retiredNames.map((name) => name.country))].sort();

  const { filteredNames, activeFilterCount } = useFilteredNames({
    retiredNames,
    searchName,
    selectedYear,
    selectedCountry,
    retirementReason,
  });

  const { paginatedData, availableLettersMap } = usePagination({
    retiredNames,
    filteredNames,
    activeFilterCount,
    currentLetter,
  });

  const loadSuggestions = async (nameId: number) => {
    fetchData<Suggestion[]>(`/suggested-names?nameId=${nameId}`).then((data) => {
      if (data) {
        setSuggestions(data.data);
      }
    });
  };

  const handleNameClick = async (name: RetiredName) => {
    setSelectedName(name);
    await loadSuggestions(name.id);
  };

  const handleApplyFilters = (filters: FilterParams) => {
    setIsFilterModalOpen(false);
    updateURL(filters);
  };

  const handleLetterChange = (letter: string) => {
    updateURL(
      {
        searchName: "",
        selectedYear: "",
        selectedCountry: "",
        retirementReason: "",
      },
      letter,
    );
  };

  return (
    <PageHeader title="Retired Typhoon Names">
      <FilterButton
        activeFilterCount={activeFilterCount}
        onClick={() => setIsFilterModalOpen(true)}
        params={{
          name: searchName,
          year: selectedYear,
          country: selectedCountry,
          lang: retirementReason,
        }}
      />

      {activeFilterCount === 0 && (
        <LetterNavigation
          currentLetter={currentLetter}
          availableLettersMap={availableLettersMap}
          onLetterChange={handleLetterChange}
        />
      )}

      <div className="mx-auto max-w-4xl">
        <RetiredNamesTable paginatedData={paginatedData} onNameClick={handleNameClick} />
      </div>

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyFilters}
        countries={countries}
        initialFilters={{
          searchName,
          selectedYear,
          selectedCountry,
          retirementReason,
        }}
      />

      <NameDetailsModal
        selectedName={selectedName}
        suggestions={suggestions}
        onClose={() => setSelectedName(null)}
      />
    </PageHeader>
  );
};

export default RetiredNamesContent;
