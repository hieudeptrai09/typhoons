"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LetterNavigation from "../../../../components/LetterNavigation";
import PageHeader from "../../../../components/PageHeader";
import { defaultRetiredName } from "../../../../constants";
import fetchData from "../../../../containers/utils/fetcher";
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
  const router = useRouter();
  const searchParams = useSearchParams();

  const [retiredNames, setRetiredNames] = useState<RetiredName[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedName, setSelectedName] = useState<RetiredName>(defaultRetiredName);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isNameDetailsModalOpen, setIsNameDetailsModalOpen] = useState(false);

  // Initialize filters from URL parameters
  const searchName = searchParams.get("name") || "";
  const selectedYear = searchParams.get("year") || "";
  const selectedCountry = searchParams.get("country") || "";
  const retirementReason = searchParams.get("lang") || "";
  const currentLetter = searchParams.get("letter") || "A";

  // Update URL when filters change
  const updateURL = (filters: FilterParams, letter: string = currentLetter) => {
    const params = new URLSearchParams();

    if (filters.name) {
      params.set("name", filters.name);
    }
    if (filters.year) {
      params.set("year", filters.year.toString());
    }
    if (filters.country) {
      params.set("country", filters.country);
    }
    if (filters.reason) {
      params.set("lang", filters.reason);
    }

    // Only add letter parameter if no filters are active
    if (!filters.name && !filters.year && !filters.country && !filters.reason) {
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

  const displayedNames = useMemo(() => {
    let filtered = [...retiredNames];

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
      // Parse comma-separated values
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

  // Calculate available letters (letters that have retired names)
  const availableLettersMap = useMemo(() => {
    const map: Record<string, boolean> = {};
    retiredNames.forEach((name) => {
      const letter = name.name.charAt(0).toUpperCase();
      map[letter] = true;
    });
    return map;
  }, [retiredNames]);

  const activeFilterCount = [searchName, selectedYear, selectedCountry, retirementReason].filter(
    Boolean,
  ).length;

  const loadSuggestions = async (nameId: number) => {
    fetchData<Suggestion[]>(`/suggested-names?nameId=${nameId}`).then((data) => {
      if (data) {
        setSuggestions(data.data);
      }
    });
  };

  const handleNameClick = async (name: RetiredName) => {
    setSelectedName(name);
    setIsNameDetailsModalOpen(true);
    await loadSuggestions(name.id);
  };

  const handleApplyFilters = (filters: FilterParams) => {
    setIsFilterModalOpen(false);
    updateURL(filters);
  };

  const handleLetterChange = (letter: string) => {
    updateURL(
      {
        name: "",
        year: "",
        country: "",
        reason: "",
      },
      letter,
    );
  };

  // Letter configuration for LetterNavigation
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
        suggestions={suggestions}
        onClose={() => setIsNameDetailsModalOpen(false)}
      />
    </PageHeader>
  );
};

export default RetiredNamesContent;
