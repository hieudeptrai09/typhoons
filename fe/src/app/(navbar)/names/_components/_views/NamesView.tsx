import { useState, useMemo } from "react";
import { Badge } from "antd";
import { Filter, Settings, Wind } from "lucide-react";
import LetterNavigation from "../../../../../components/components/LetterNavigation";
import HistoryModal from "../../../../../components/ui/HistoryModal";
import NameDetailsModal from "../../../../../components/ui/NameDetailsModal";
import { defaultTyphoonName } from "../../../../../constants";
import { useURLParams } from "../../../../../containers/hooks/useURLParams";
import { toArr } from "../../../../../containers/utils/fns";
import FilteredNamesTable from "../_components/FilteredNamesTable";
import PositionNameGrid from "../_components/PositionNameGrid";
import ListFilterModal from "../_modals/ListFilterModal";
import NamesSettingsModal from "../_modals/NamesSettingsModal";
import { applyNameFilters, categorizeLettersByStatus } from "../../_utils/fns";
import type { TyphoonName, FilterParams } from "../../../../../types";
import type { DisplaySettings } from "../_modals/NamesSettingsModal";

interface URLState {
  view?: string;
  letter?: string;
  name?: string;
  country?: string;
  language?: string;
  tag?: string;
  position?: string;
  status?: string;
}

interface NamesViewProps {
  allNames: TyphoonName[];
  currentNames: TyphoonName[];
  activeTab: "names" | "retired";
  onToggleView: () => void;
}

const NamesView = ({ allNames, currentNames, activeTab, onToggleView }: NamesViewProps) => {
  const { params, updateParams } = useURLParams<URLState>();
  const displayMode = params.view === "list" ? ("list" as const) : ("grid" as const);
  const currentLetter = params.letter || "A";

  const [settings, setSettings] = useState<DisplaySettings>({
    showAll: true,
    showName: false,
    showHistory: false,
    colorfulHistory: false,
    showImageAndDescription: false,
  });
  const handleApplySettings = (mode: "grid" | "list", newSettings: DisplaySettings) => {
    setSettings(newSettings);
    setIsSettingsOpen(false);
    if (mode !== displayMode) {
      updateParams({ ...params, view: mode }, true);
    }
  };

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [selectedName, setSelectedName] = useState<TyphoonName>(defaultTyphoonName);
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);

  const [historyPosition, setHistoryPosition] = useState<number>(0);
  const [historyPositionNames, setHistoryPositionNames] = useState<TyphoonName[]>([]);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const searchName = params.name || "";
  const selectedCountry = params.country || "";
  const selectedLanguage = params.language || "";
  const selectedTag = params.tag || "";
  const searchPosition = params.position || "";
  const selectedStatus = params.status || "";

  const countryArr = toArr(selectedCountry);
  const languageArr = toArr(selectedLanguage);
  const tagArr = toArr(selectedTag);

  const countries = useMemo(() => [...new Set(allNames.map((n) => n.country))].sort(), [allNames]);
  const languages = useMemo(
    () => [...new Set(allNames.map((n) => n.language).filter(Boolean))].sort(),
    [allNames],
  );
  const tags = useMemo(
    () => [...new Set(allNames.map((n) => n.tag).filter(Boolean) as string[])].sort(),
    [allNames],
  );

  const activeFilterCount = [
    searchName,
    selectedCountry,
    selectedLanguage,
    searchPosition,
    selectedTag,
    selectedStatus,
  ].filter(Boolean).length;

  const hasActiveFilters = activeFilterCount > 0;

  const filterValues = useMemo(
    () => ({
      name: searchName,
      country: countryArr,
      language: languageArr,
      tag: tagArr,
      position: searchPosition,
      status: selectedStatus,
    }),
    [searchName, countryArr, languageArr, tagArr, searchPosition, selectedStatus],
  );

  const filteredAllNames = useMemo(() => {
    if (hasActiveFilters) return applyNameFilters(allNames, filterValues);
    if (displayMode === "grid" && settings.showAll) return [...allNames];
    return allNames.filter((n) => n.name.charAt(0).toUpperCase() === currentLetter);
  }, [allNames, hasActiveFilters, filterValues, displayMode, settings.showAll, currentLetter]);

  const filteredCurrentNames = useMemo(() => {
    if (displayMode !== "grid") return [];
    if (hasActiveFilters) {
      if (selectedStatus === "retired") return [];
      return applyNameFilters(currentNames, { ...filterValues, status: "" });
    }
    if (settings.showAll) return [...currentNames];
    return currentNames.filter((n) => n.name.charAt(0).toUpperCase() === currentLetter);
  }, [
    currentNames,
    displayMode,
    hasActiveFilters,
    filterValues,
    selectedStatus,
    settings.showAll,
    currentLetter,
  ]);

  const letterStatusMap = useMemo(() => categorizeLettersByStatus(allNames), [allNames]);

  const showLetterNav =
    displayMode === "grid" ? !settings.showAll && !hasActiveFilters : activeFilterCount === 0;

  const handleLetterChange = (letter: string) => {
    updateParams(
      {
        view: displayMode,
        name: "",
        country: "",
        language: "",
        position: "",
        tag: "",
        status: "",
        letter,
      },
      true,
    );
  };

  const handleApplyFilters = (filters: FilterParams) => {
    setIsFilterModalOpen(false);
    const newParams: URLState = {
      view: displayMode,
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

  const handleNameClick = (name: TyphoonName) => {
    setSelectedName(name);
    setIsNameModalOpen(true);
  };

  const handleCellClick = (
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
      handleNameClick(currentName);
    }
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

  return (
    <>
      <div className="mx-auto mb-4 max-w-4xl">
        <div className="flex items-center justify-center gap-9">
          <button
            onClick={onToggleView}
            title={activeTab === "names" ? "Switch to retired names" : "Switch to active names"}
            aria-label={activeTab === "names" ? "Viewing active names, click to switch to retired" : "Viewing retired names, click to switch to active"}
            className="cursor-pointer border-0 bg-transparent p-1 text-emerald-600 transition-colors hover:text-emerald-800"
          >
            <Wind size={35} />
          </button>
          <Badge count={activeFilterCount} color="#10b981" offset={[-4, 4]}>
            <button
              onClick={() => setIsFilterModalOpen(true)}
              title="Filters"
              aria-label={`Open filters${activeFilterCount > 0 ? `, ${activeFilterCount} active` : ""}`}
              className="cursor-pointer border-0 bg-transparent p-1 text-gray-500 transition-colors hover:text-gray-800"
            >
              <Filter size={35} />
            </button>
          </Badge>
          <button
            onClick={() => setIsSettingsOpen(true)}
            title="Display settings"
            aria-label="Display settings"
            className="cursor-pointer border-0 bg-transparent p-1 text-gray-500 transition-colors hover:text-gray-800"
          >
            <Settings size={35} />
          </button>
        </div>
      </div>

      {showLetterNav && (
        <LetterNavigation onLetterChange={handleLetterChange} getLetterConfig={getLetterConfig} />
      )}

      {displayMode === "grid" ? (
        <PositionNameGrid
          names={filteredAllNames}
          currentNames={filteredCurrentNames}
          hasActiveFilters={hasActiveFilters}
          showAll={settings.showAll}
          showName={settings.showName}
          showHistory={settings.showHistory}
          colorfulHistory={settings.colorfulHistory}
          onNameClick={handleNameClick}
          onCellClick={handleCellClick}
        />
      ) : (
        <FilteredNamesTable
          filteredNames={filteredAllNames}
          showImageAndDescription={settings.showImageAndDescription}
          onNameClick={handleNameClick}
        />
      )}

      <ListFilterModal
        key={`${displayMode}-${searchName}-${selectedCountry}-${selectedLanguage}-${searchPosition}-${selectedTag}`}
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
          status: selectedStatus,
          letter: "",
        }}
      />

      <NamesSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        displayMode={displayMode}
        settings={settings}
        hasActiveFilters={hasActiveFilters}
        onApply={handleApplySettings}
      />

      <NameDetailsModal
        isOpen={isNameModalOpen}
        name={selectedName}
        hideReplacedBy
        onClose={() => setIsNameModalOpen(false)}
      />

      <HistoryModal
        isOpen={isHistoryModalOpen}
        position={historyPosition}
        positionNames={historyPositionNames}
        onClose={() => setIsHistoryModalOpen(false)}
      />
    </>
  );
};

export default NamesView;
