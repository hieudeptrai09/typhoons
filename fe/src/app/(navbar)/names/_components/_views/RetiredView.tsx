import { useState, useMemo } from "react";
import { Badge } from "antd";
import { Filter, Skull } from "lucide-react";
import LetterNavigation from "../../../../../components/components/LetterNavigation";
import { defaultRetiredName } from "../../../../../constants";
import { useFetchData } from "../../../../../containers/hooks/useFetchData";
import { useURLParams } from "../../../../../containers/hooks/useURLParams";
import { toArr } from "../../../../../containers/utils/fns";
import RetiredNamesTable from "../_components/RetiredNamesTable";
import RetiredFilterModal from "../_modals/RetiredFilterModal";
import RetiredNameDetailsModal from "../_modals/RetiredNameDetailsModal";
import type { RetiredName, Suggestion, RetiredFilterParams } from "../../../../../types";

interface URLState {
  view?: string;
  letter?: string;
  name?: string;
  year?: string;
  country?: string;
  reason?: string;
  position?: string;
}

interface RetiredViewProps {
  retiredNames: RetiredName[];
  activeTab: "names" | "retired";
  onToggleView: () => void;
}

const RetiredView = ({ retiredNames, activeTab, onToggleView }: RetiredViewProps) => {
  const { params, updateParams } = useURLParams<URLState>();
  const currentLetter = params.letter || "A";

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedRetiredName, setSelectedRetiredName] = useState<RetiredName>(defaultRetiredName);
  const [isRetiredNameModalOpen, setIsRetiredNameModalOpen] = useState(false);

  const {
    data: suggestionsRaw = [],
    loading: suggestionsLoading,
    error: suggestionsError,
  } = useFetchData<Suggestion[]>(
    selectedRetiredName.id ? `/suggested-names?nameId=${selectedRetiredName.id}` : "",
  );

  const isSuggestionsReady = !suggestionsLoading;
  const suggestions = isSuggestionsReady ? (suggestionsRaw ?? []) : [];

  const searchName = params.name || "";
  const selectedYear = params.year || "";
  const selectedCountry = params.country || "";
  const selectedReason = params.reason || "";
  const searchPosition = params.position || "";

  const countryArr = toArr(selectedCountry);
  const reasonArr = toArr(selectedReason).map(Number);

  const countries = useMemo(
    () => [...new Set(retiredNames.map((n) => n.country))].sort(),
    [retiredNames],
  );

  const displayedNames = useMemo(() => {
    let filtered = [...retiredNames];

    if (searchName) {
      filtered = filtered.filter((n) =>
        n.name.toLowerCase().includes(searchName.toLowerCase()),
      );
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
      searchName ||
      selectedYear ||
      countryArr.length > 0 ||
      reasonArr.length > 0 ||
      searchPosition;

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
    retiredNames.forEach((n) => {
      map[n.name.charAt(0).toUpperCase()] = true;
    });
    return map;
  }, [retiredNames]);

  const activeFilterCount = [
    searchName,
    selectedYear,
    selectedCountry,
    selectedReason,
    searchPosition,
  ].filter(Boolean).length;

  const handleNameClick = (name: RetiredName) => {
    setSelectedRetiredName(name);
    setIsRetiredNameModalOpen(true);
  };

  const handleApplyFilters = (filters: RetiredFilterParams) => {
    setIsFilterModalOpen(false);
    const newParams: URLState = {
      view: "retired",
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

  const handleLetterChange = (letter: string) => {
    updateParams(
      { view: "retired", name: "", year: "", country: "", reason: "", position: "", letter },
      true,
    );
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

  return (
    <>
      <div className="mx-auto mb-4 max-w-4xl">
        <div className="flex items-center justify-center gap-9">
          <button
            onClick={onToggleView}
            title={activeTab === "retired" ? "Switch to active names" : "Switch to retired names"}
            aria-label={activeTab === "retired" ? "Viewing retired names, click to switch to active" : "Viewing active names, click to switch to retired"}
            className="cursor-pointer border-0 bg-transparent p-1 text-red-500 transition-colors hover:text-red-700"
          >
            <Skull size={35} />
          </button>
          <Badge count={activeFilterCount} color="#f97316" offset={[-4, 4]}>
            <button
              onClick={() => setIsFilterModalOpen(true)}
              title="Filters"
              aria-label={`Open filters${activeFilterCount > 0 ? `, ${activeFilterCount} active` : ""}`}
              className="cursor-pointer border-0 bg-transparent p-1 text-gray-500 transition-colors hover:text-gray-800"
            >
              <Filter size={35} />
            </button>
          </Badge>
        </div>
      </div>

      {activeFilterCount === 0 && (
        <LetterNavigation
          onLetterChange={handleLetterChange}
          getLetterConfig={getLetterConfig}
        />
      )}

      <div className="mx-auto max-w-5xl">
        <RetiredNamesTable
          paginatedData={displayedNames}
          onNameClick={handleNameClick}
        />
      </div>

      <RetiredFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyFilters}
        countries={countries}
        initialFilters={{
          name: searchName,
          year: selectedYear,
          country: selectedCountry,
          reason: selectedReason,
          position: searchPosition,
        }}
      />

      <RetiredNameDetailsModal
        isOpen={isRetiredNameModalOpen}
        selectedName={selectedRetiredName}
        suggestions={suggestions}
        suggestionsLoading={suggestionsLoading || !isSuggestionsReady}
        suggestionsError={suggestionsError}
        onClose={() => setIsRetiredNameModalOpen(false)}
      />
    </>
  );
};

export default RetiredView;
