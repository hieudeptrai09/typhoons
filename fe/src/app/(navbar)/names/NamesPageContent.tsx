"use client";

import { useState, useMemo } from "react";
import { Spin, Switch } from "antd";
import FilterButton from "../../../components/components/FilterButton";
import FrownNotFound from "../../../components/components/FrownNotFound";
import LetterNavigation from "../../../components/components/LetterNavigation";
import PageHeader from "../../../components/components/PageHeader";
import HistoryModal from "../../../components/ui/HistoryModal";
import NameDetailsModal from "../../../components/ui/NameDetailsModal";
import { defaultRetiredName, defaultTyphoonName } from "../../../constants";
import { useFetchData } from "../../../containers/hooks/useFetchData";
import { useURLParams } from "../../../containers/hooks/useURLParams";
import { toArr } from "../../../containers/utils/fns";
import FilteredNamesTable from "./_components/FilteredNamesTable";
import ListFilterModal from "./_components/ListFilterModal";
import RetiredFilterModal from "./_components/RetiredFilterModal";
import RetiredNameDetailsModal from "./_components/RetiredNameDetailsModal";
import RetiredNamesTable from "./_components/RetiredNamesTable";
import PositionNameGrid from "./_components/PositionNameGrid";
import { categorizeLettersByStatus } from "./_utils/fns";
import type {
  TyphoonName,
  RetiredName,
  Suggestion,
  FilterParams,
  RetiredFilterParams,
} from "../../../types";

type ViewMode = "grid" | "list" | "retired";

interface URLState {
  view?: string;
  letter?: string;
  name?: string;
  country?: string;
  language?: string;
  tag?: string;
  position?: string;
  status?: string;
  year?: string;
  reason?: string;
}

const VIEW_TABS: { key: ViewMode; label: string }[] = [
  { key: "grid", label: "Grid" },
  { key: "list", label: "List" },
  { key: "retired", label: "Retired" },
];

const NamesPageContent = () => {
  const { params, updateParams } = useURLParams<URLState>();

  const viewMode = (params.view as ViewMode) || "grid";
  const currentLetter = params.letter || "A";

  // --- Grid state ---
  const [showAll, setShowAll] = useState(true);
  const [historyPosition, setHistoryPosition] = useState<number>(0);
  const [historyPositionNames, setHistoryPositionNames] = useState<TyphoonName[]>([]);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // --- List state ---
  const [showImageAndDescription, setShowImageAndDescription] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // --- Retired state ---
  const [isRetiredFilterModalOpen, setIsRetiredFilterModalOpen] = useState(false);
  const [selectedRetiredName, setSelectedRetiredName] = useState<RetiredName>(defaultRetiredName);
  const [isRetiredNameModalOpen, setIsRetiredNameModalOpen] = useState(false);

  // --- Shared name modal state ---
  const [selectedName, setSelectedName] = useState<TyphoonName>(defaultTyphoonName);
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);

  // --- Data fetching ---
  const {
    data: allNames,
    loading: allLoading,
    error: allError,
  } = useFetchData<TyphoonName[]>("/typhoon-names");

  const {
    data: currentNames,
    loading: currentLoading,
    error: currentError,
  } = useFetchData<TyphoonName[]>("/typhoon-names?isRetired=0");

  const {
    data: retiredNames,
    loading: retiredLoading,
    error: retiredError,
  } = useFetchData<RetiredName[]>("/typhoon-names?isRetired=1");

  const {
    data: suggestionsRaw = [],
    loading: suggestionsLoading,
    error: suggestionsError,
  } = useFetchData<Suggestion[]>(
    selectedRetiredName.id ? `/suggested-names?nameId=${selectedRetiredName.id}` : "",
  );

  const isSuggestionsReady = !suggestionsLoading;
  const suggestions = isSuggestionsReady ? (suggestionsRaw ?? []) : [];

  // --- List filter params ---
  const listSearchName = params.name || "";
  const listSearchPosition = params.position || "";
  const listSelectedCountry = params.country || "";
  const listSelectedLanguage = params.language || "";
  const listSelectedTag = params.tag || "";
  const listSelectedStatus = params.status || "";

  const listCountryArr = toArr(listSelectedCountry);
  const listLanguageArr = toArr(listSelectedLanguage);
  const listTagArr = toArr(listSelectedTag);

  // --- Retired filter params ---
  const retiredSearchName = params.name || "";
  const retiredSelectedYear = params.year || "";
  const retiredSearchPosition = params.position || "";
  const retiredSelectedCountry = params.country || "";
  const retiredReason = params.reason || "";

  const retiredCountryArr = toArr(retiredSelectedCountry);
  const retiredReasonArr = toArr(retiredReason).map(Number);

  // --- Derived data for List view ---
  const listCountries = useMemo(
    () => [...new Set((allNames || []).map((n) => n.country))].sort(),
    [allNames],
  );
  const listLanguages = useMemo(
    () => [...new Set((allNames || []).map((n) => n.language).filter(Boolean))].sort(),
    [allNames],
  );
  const listTags = useMemo(
    () => [...new Set((allNames || []).map((n) => n.tag).filter(Boolean) as string[])].sort(),
    [allNames],
  );

  const listDisplayedNames = useMemo(() => {
    if (viewMode !== "list") return [];
    let filtered = [...(allNames || [])];

    if (listSearchName) {
      filtered = filtered.filter((n) => n.name.toLowerCase().includes(listSearchName.toLowerCase()));
    }
    if (listCountryArr.length > 0) {
      filtered = filtered.filter((n) => listCountryArr.includes(n.country));
    }
    if (listLanguageArr.length > 0) {
      filtered = filtered.filter((n) => listLanguageArr.includes(n.language));
    }
    if (listTagArr.length > 0) {
      filtered = filtered.filter((n) => listTagArr.includes(n.tag));
    }
    if (listSearchPosition) {
      filtered = filtered.filter((n) => n.position === Number(listSearchPosition));
    }
    if (listSelectedStatus === "active") {
      filtered = filtered.filter((n) => !n.isRetired);
    } else if (listSelectedStatus === "retired") {
      filtered = filtered.filter((n) => n.isRetired);
    } else if (listSelectedStatus === "current") {
      filtered = filtered.filter((n) => !n.isRetired || !n.isReplaced);
    }

    const hasActiveFilters =
      listSearchName ||
      listCountryArr.length > 0 ||
      listLanguageArr.length > 0 ||
      listTagArr.length > 0 ||
      listSearchPosition ||
      listSelectedStatus;

    if (!hasActiveFilters) {
      filtered = filtered.filter((n) => n.name.charAt(0).toUpperCase() === currentLetter);
    }

    return filtered;
  }, [
    viewMode,
    allNames,
    listSearchName,
    listCountryArr,
    listLanguageArr,
    listTagArr,
    listSearchPosition,
    listSelectedStatus,
    currentLetter,
  ]);

  const listLetterStatusMap = useMemo(
    () => categorizeLettersByStatus(allNames || []),
    [allNames],
  );

  const listActiveFilterCount = [
    listSearchName,
    listSelectedCountry,
    listSelectedLanguage,
    listSearchPosition,
    listSelectedTag,
    listSelectedStatus,
  ].filter(Boolean).length;

  // --- Derived data for Grid view (filtered) ---
  const gridHasActiveFilters = listActiveFilterCount > 0;
  const gridNeedsLetterFilter = !showAll && !gridHasActiveFilters;

  const gridFilteredAllNames = useMemo(() => {
    let filtered = [...(allNames || [])];

    if (gridHasActiveFilters) {
      if (listSearchName) {
        filtered = filtered.filter((n) =>
          n.name.toLowerCase().includes(listSearchName.toLowerCase()),
        );
      }
      if (listCountryArr.length > 0) {
        filtered = filtered.filter((n) => listCountryArr.includes(n.country));
      }
      if (listLanguageArr.length > 0) {
        filtered = filtered.filter((n) => listLanguageArr.includes(n.language));
      }
      if (listTagArr.length > 0) {
        filtered = filtered.filter((n) => listTagArr.includes(n.tag));
      }
      if (listSearchPosition) {
        filtered = filtered.filter((n) => n.position === Number(listSearchPosition));
      }
      if (listSelectedStatus === "active") {
        filtered = filtered.filter((n) => !n.isRetired);
      } else if (listSelectedStatus === "retired") {
        filtered = filtered.filter((n) => n.isRetired);
      } else if (listSelectedStatus === "current") {
        filtered = filtered.filter((n) => !n.isRetired || !n.isReplaced);
      }
    } else if (gridNeedsLetterFilter) {
      filtered = filtered.filter((n) => n.name.charAt(0).toUpperCase() === currentLetter);
    }

    return filtered;
  }, [
    allNames,
    gridHasActiveFilters,
    gridNeedsLetterFilter,
    currentLetter,
    listSearchName,
    listCountryArr,
    listLanguageArr,
    listTagArr,
    listSearchPosition,
    listSelectedStatus,
  ]);

  const gridFilteredCurrentNames = useMemo(() => {
    let filtered = [...(currentNames || [])];

    if (gridHasActiveFilters) {
      if (listSearchName) {
        filtered = filtered.filter((n) =>
          n.name.toLowerCase().includes(listSearchName.toLowerCase()),
        );
      }
      if (listCountryArr.length > 0) {
        filtered = filtered.filter((n) => listCountryArr.includes(n.country));
      }
      if (listLanguageArr.length > 0) {
        filtered = filtered.filter((n) => listLanguageArr.includes(n.language));
      }
      if (listTagArr.length > 0) {
        filtered = filtered.filter((n) => listTagArr.includes(n.tag));
      }
      if (listSearchPosition) {
        filtered = filtered.filter((n) => n.position === Number(listSearchPosition));
      }
      if (listSelectedStatus === "retired") {
        return [];
      }
    } else if (gridNeedsLetterFilter) {
      filtered = filtered.filter((n) => n.name.charAt(0).toUpperCase() === currentLetter);
    }

    return filtered;
  }, [
    currentNames,
    gridHasActiveFilters,
    gridNeedsLetterFilter,
    currentLetter,
    listSearchName,
    listCountryArr,
    listLanguageArr,
    listTagArr,
    listSearchPosition,
    listSelectedStatus,
  ]);

  // --- Derived data for Retired view ---
  const retiredCountries = useMemo(
    () => [...new Set((retiredNames || []).map((n) => n.country))].sort(),
    [retiredNames],
  );

  const retiredDisplayedNames = useMemo(() => {
    if (viewMode !== "retired") return [];
    let filtered = [...(retiredNames || [])];

    if (retiredSearchName) {
      filtered = filtered.filter((n) =>
        n.name.toLowerCase().includes(retiredSearchName.toLowerCase()),
      );
    }
    if (retiredSelectedYear) {
      filtered = filtered.filter((n) => n.lastYear === Number(retiredSelectedYear));
    }
    if (retiredCountryArr.length > 0) {
      filtered = filtered.filter((n) => retiredCountryArr.includes(n.country));
    }
    if (retiredReasonArr.length > 0) {
      filtered = filtered.filter((n) => retiredReasonArr.includes(n.isLanguageProblem));
    }
    if (retiredSearchPosition) {
      filtered = filtered.filter((n) => n.position === Number(retiredSearchPosition));
    }

    const hasActiveFilters =
      retiredSearchName ||
      retiredSelectedYear ||
      retiredCountryArr.length > 0 ||
      retiredReasonArr.length > 0 ||
      retiredSearchPosition;

    if (!hasActiveFilters) {
      filtered = filtered.filter((n) => n.name.charAt(0).toUpperCase() === currentLetter);
    }

    return filtered;
  }, [
    viewMode,
    retiredNames,
    retiredSearchName,
    retiredSelectedYear,
    retiredCountryArr,
    retiredReasonArr,
    retiredSearchPosition,
    currentLetter,
  ]);

  const retiredAvailableLettersMap = useMemo(() => {
    const map: Record<string, boolean> = {};
    (retiredNames || []).forEach((n) => {
      map[n.name.charAt(0).toUpperCase()] = true;
    });
    return map;
  }, [retiredNames]);

  const retiredActiveFilterCount = [
    retiredSearchName,
    retiredSelectedYear,
    retiredSelectedCountry,
    retiredReason,
    retiredSearchPosition,
  ].filter(Boolean).length;

  // --- Handlers: Tab switching ---
  const handleViewChange = (view: ViewMode) => {
    if (view === "grid") {
      updateParams({ view: "grid" }, true);
    } else {
      updateParams({ view, letter: "A" }, true);
    }
  };

  // --- Handlers: Grid view ---
  const handleGridNameClick = (name: TyphoonName) => {
    setSelectedName(name);
    setIsNameModalOpen(true);
  };

  const handleGridCellClick = (
    position: number,
    currentName: TyphoonName | undefined,
    historyNames: TyphoonName[],
    isShowingHistory: boolean,
  ) => {
    if (isShowingHistory) {
      setHistoryPosition(position);
      setHistoryPositionNames(historyNames);
      setIsHistoryModalOpen(true);
    } else if (currentName) {
      setSelectedName(currentName);
      setIsNameModalOpen(true);
    }
  };

  const handleGridLetterChange = (letter: string) => {
    updateParams({ view: "grid", letter }, true);
  };

  // --- Handlers: Grid filter ---
  const handleGridApplyFilters = (filters: FilterParams) => {
    setIsFilterModalOpen(false);
    const newParams: URLState = {
      view: "grid",
      name: filters.name,
      country: filters.country,
      language: filters.language,
      position: filters.position,
      tag: filters.tag,
      status: filters.status,
    };
    updateParams(newParams, true);
  };

  // --- Handlers: List view ---
  const handleListNameClick = (name: TyphoonName) => {
    setSelectedName(name);
    setIsNameModalOpen(true);
  };

  const handleListApplyFilters = (filters: FilterParams) => {
    setIsFilterModalOpen(false);
    const newParams: URLState = {
      view: "list",
      name: filters.name,
      country: filters.country,
      language: filters.language,
      position: filters.position,
      tag: filters.tag,
      status: filters.status,
    };
    const hasFilters =
      filters.name ||
      filters.country ||
      filters.language ||
      filters.position ||
      filters.tag ||
      filters.status;
    if (!hasFilters) newParams.letter = currentLetter;
    updateParams(newParams, true);
  };

  const handleListLetterChange = (letter: string) => {
    updateParams(
      { view: "list", name: "", country: "", language: "", position: "", tag: "", status: "", letter },
      true,
    );
  };

  const getListLetterConfig = (letter: string) => {
    const status = listLetterStatusMap[letter];
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

  // --- Handlers: Retired view ---
  const handleRetiredNameClick = (name: RetiredName) => {
    setSelectedRetiredName(name);
    setIsRetiredNameModalOpen(true);
  };

  const handleRetiredApplyFilters = (filters: RetiredFilterParams) => {
    setIsRetiredFilterModalOpen(false);
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

  const handleRetiredLetterChange = (letter: string) => {
    updateParams(
      { view: "retired", name: "", year: "", country: "", reason: "", position: "", letter },
      true,
    );
  };

  const getRetiredLetterConfig = (letter: string) => {
    const isAvailable = retiredAvailableLettersMap[letter];
    const isActive = currentLetter === letter;
    return {
      isAvailable,
      color: !isAvailable ? "#d1d5db" : isActive ? "#991b1b" : "#ef4444",
      isActive: !!isAvailable && isActive,
    };
  };

  // --- Loading / Error ---
  if (allLoading || currentLoading || retiredLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-100">
        <Spin size="large" />
      </div>
    );
  }

  if (allError || currentError || retiredError) {
    return <FrownNotFound />;
  }

  // --- Render ---
  return (
    <PageHeader title="Typhoon Names">
      {/* View mode tabs */}
      <div className="mx-auto mb-6 flex max-w-4xl justify-center gap-1">
        {VIEW_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleViewChange(tab.key)}
            className={`rounded-lg px-5 py-2 text-sm font-semibold transition-colors ${
              viewMode === tab.key
                ? "bg-blue-600 text-white"
                : "bg-stone-200 text-gray-700 hover:bg-stone-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ==================== GRID VIEW ==================== */}
      {viewMode === "grid" && (
        <>
          <FilterButton
            onClick={() => setIsFilterModalOpen(true)}
            count={listActiveFilterCount}
            color="#10b981"
            hoverClassName="hover:!border-emerald-600 hover:!bg-emerald-600"
          />

          {!showAll && !gridHasActiveFilters && (
            <LetterNavigation
              onLetterChange={handleGridLetterChange}
              getLetterConfig={getListLetterConfig}
            />
          )}

          <PositionNameGrid
            names={gridFilteredAllNames}
            currentNames={gridFilteredCurrentNames}
            hasActiveFilters={gridHasActiveFilters}
            showAll={showAll}
            onShowAllChange={setShowAll}
            onNameClick={handleGridNameClick}
            onCellClick={handleGridCellClick}
          />

          <ListFilterModal
            key={`grid-${listSearchName}-${listSelectedCountry}-${listSelectedLanguage}-${listSearchPosition}-${listSelectedTag}`}
            isOpen={isFilterModalOpen}
            onClose={() => setIsFilterModalOpen(false)}
            onApply={handleGridApplyFilters}
            countries={listCountries}
            languages={listLanguages}
            tags={listTags}
            initialFilters={{
              name: listSearchName,
              country: listSelectedCountry,
              language: listSelectedLanguage,
              position: listSearchPosition,
              tag: listSelectedTag,
              status: listSelectedStatus,
              letter: "",
            }}
          />
        </>
      )}

      {/* ==================== LIST VIEW ==================== */}
      {viewMode === "list" && (
        <>
          <FilterButton
            onClick={() => setIsFilterModalOpen(true)}
            count={listActiveFilterCount}
            color="#10b981"
            hoverClassName="hover:!border-emerald-600 hover:!bg-emerald-600"
          />

          {listActiveFilterCount === 0 && (
            <LetterNavigation
              onLetterChange={handleListLetterChange}
              getLetterConfig={getListLetterConfig}
            />
          )}

          {listDisplayedNames.length > 0 && (
            <div className="mx-auto mb-6 flex max-w-4xl items-center justify-end gap-3">
              <span className="text-sm font-semibold text-gray-700">
                Show Images & Descriptions
              </span>
              <Switch checked={showImageAndDescription} onChange={setShowImageAndDescription} />
            </div>
          )}

          <FilteredNamesTable
            filteredNames={listDisplayedNames}
            showImageAndDescription={showImageAndDescription}
            onNameClick={handleListNameClick}
          />

          <ListFilterModal
            key={`${listSearchName}-${listSelectedCountry}-${listSelectedLanguage}-${listSearchPosition}-${listSelectedTag}`}
            isOpen={isFilterModalOpen}
            onClose={() => setIsFilterModalOpen(false)}
            onApply={handleListApplyFilters}
            countries={listCountries}
            languages={listLanguages}
            tags={listTags}
            initialFilters={{
              name: listSearchName,
              country: listSelectedCountry,
              language: listSelectedLanguage,
              position: listSearchPosition,
              tag: listSelectedTag,
              status: listSelectedStatus,
              letter: "",
            }}
          />
        </>
      )}

      {/* ==================== RETIRED VIEW ==================== */}
      {viewMode === "retired" && (
        <>
          <FilterButton
            onClick={() => setIsRetiredFilterModalOpen(true)}
            count={retiredActiveFilterCount}
            color="#f97316"
            hoverClassName="hover:!border-orange-600 hover:!bg-orange-600"
          />

          {retiredActiveFilterCount === 0 && (
            <LetterNavigation
              onLetterChange={handleRetiredLetterChange}
              getLetterConfig={getRetiredLetterConfig}
            />
          )}

          <div className="mx-auto max-w-5xl">
            <RetiredNamesTable
              paginatedData={retiredDisplayedNames}
              onNameClick={handleRetiredNameClick}
            />
          </div>

          <RetiredFilterModal
            isOpen={isRetiredFilterModalOpen}
            onClose={() => setIsRetiredFilterModalOpen(false)}
            onApply={handleRetiredApplyFilters}
            countries={retiredCountries}
            initialFilters={{
              name: retiredSearchName,
              year: retiredSelectedYear,
              country: retiredSelectedCountry,
              reason: retiredReason,
              position: retiredSearchPosition,
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
      )}

      {/* Shared modals (Grid + List views) */}
      <NameDetailsModal
        isOpen={isNameModalOpen}
        name={selectedName}
        hideReplacedBy={viewMode === "list"}
        onClose={() => setIsNameModalOpen(false)}
      />
      <HistoryModal
        isOpen={isHistoryModalOpen}
        position={historyPosition}
        positionNames={historyPositionNames}
        onClose={() => setIsHistoryModalOpen(false)}
      />
    </PageHeader>
  );
};

export default NamesPageContent;
