import { useState, useMemo, useCallback } from "react";
import { Badge } from "antd";
import { Filter, Flame, Settings } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import LetterNavigation from "../../../../../components/components/LetterNavigation";
import HistoryModal from "../../../../../components/ui/HistoryModal";
import NameDetailsModal from "../../../../../components/ui/NameDetailsModal";
import { defaultTyphoonName } from "../../../../../constants";
import { toArr } from "../../../../../containers/utils/fns";
import { paramsToPath } from "../../_utils/fns";
import FilteredNamesTable from "../_components/FilteredNamesTable";
import PositionNameGrid from "../_components/PositionNameGrid";
import ListFilterModal from "../_modals/ListFilterModal";
import NamesSettingsModal from "../_modals/NamesSettingsModal";
import type { TyphoonName, FilterParams } from "../../../../../types";
import type { DisplaySettings } from "../_modals/NamesSettingsModal";

interface NameFilterValues {
  name: string;
  country: string[];
  language: string[];
  tag: string[];
  position: string;
  status: string;
}

interface NamesViewProps {
  allNames: TyphoonName[];
  viewMode: string;
  showName: boolean;
  showHistory: boolean;
  onToggleView: () => void;
}

const applyNameFilters = (names: TyphoonName[], filters: NameFilterValues): TyphoonName[] => {
  let filtered = [...names];

  if (filters.name) {
    filtered = filtered.filter((n) => n.name.toLowerCase().includes(filters.name.toLowerCase()));
  }
  if (filters.country.length > 0) {
    filtered = filtered.filter((n) => filters.country.includes(n.country));
  }
  if (filters.language.length > 0) {
    filtered = filtered.filter((n) => filters.language.includes(n.language));
  }
  if (filters.tag.length > 0) {
    filtered = filtered.filter((n) => filters.tag.includes(n.tag));
  }
  if (filters.position) {
    filtered = filtered.filter((n) => n.position === Number(filters.position));
  }
  if (filters.status === "active") {
    filtered = filtered.filter((n) => !n.isRetired);
  } else if (filters.status === "retired") {
    filtered = filtered.filter((n) => n.isRetired);
  } else if (filters.status === "current") {
    filtered = filtered.filter((n) => !n.isRetired || !n.isReplaced);
  }

  return filtered;
};

const categorizeLettersByStatus = (
  namesList: TyphoonName[],
): Record<string, [boolean, boolean, boolean]> => {
  const letterStatusMap: Record<string, [boolean, boolean, boolean]> = {};

  namesList.forEach((name) => {
    const letter = name.name.charAt(0).toUpperCase();
    const isRetired = Boolean(name.isRetired);

    if (!letterStatusMap[letter]) letterStatusMap[letter] = [false, false, false];

    letterStatusMap[letter][0] = true;
    if (isRetired) letterStatusMap[letter][1] = true;
    else letterStatusMap[letter][2] = true;
  });

  return letterStatusMap;
};

const NamesView = ({ allNames, viewMode, showName, showHistory, onToggleView }: NamesViewProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const displayMode = viewMode === "list" ? ("list" as const) : ("grid" as const);
  const currentLetter = searchParams.get("letter") || "A";
  const currentPath = paramsToPath(displayMode, showHistory, showName);

  const searchName = searchParams.get("name") || "";
  const selectedCountry = searchParams.get("country") || "";
  const selectedLanguage = searchParams.get("language") || "";
  const selectedTag = searchParams.get("tag") || "";
  const searchPosition = searchParams.get("position") || "";
  const selectedStatus = showHistory ? searchParams.get("status") || "" : "current";

  const countryArr = toArr(selectedCountry);
  const languageArr = toArr(selectedLanguage);
  const tagArr = toArr(selectedTag);

  const [settings, setSettings] = useState<DisplaySettings>({
    showLetterNav: false,
    showName,
    showHistory,
    colorfulHistory: false,
    showImageAndDescription: false,
  });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedName, setSelectedName] = useState<TyphoonName>(defaultTyphoonName);
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [historyPosition, setHistoryPosition] = useState<number>(0);
  const [historyPositionNames, setHistoryPositionNames] = useState<TyphoonName[]>([]);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

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
    if (displayMode === "grid" && !settings.showLetterNav) return [...allNames];
    return allNames.filter((n) => n.name.charAt(0).toUpperCase() === currentLetter);
  }, [allNames, hasActiveFilters, filterValues, displayMode, settings.showLetterNav, currentLetter]);

  const letterStatusMap = useMemo(() => categorizeLettersByStatus(allNames), [allNames]);

  const showLetterNav = !hasActiveFilters && (displayMode === "list" || settings.showLetterNav);

  const buildQuery = useCallback((params: Record<string, string>) => {
    const urlParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) urlParams.set(key, value);
    });
    const qs = urlParams.toString();
    return qs ? `?${qs}` : "";
  }, []);

  const handleLetterChange = (letter: string) => {
    router.push(`${currentPath}${buildQuery({ letter })}`);
  };

  const handleApplyFilters = (filters: FilterParams) => {
    setIsFilterModalOpen(false);
    const hasFilters =
      filters.name ||
      filters.country ||
      filters.language ||
      filters.position ||
      filters.tag ||
      filters.status;
    const query = buildQuery({
      name: filters.name,
      country: filters.country,
      language: filters.language,
      position: filters.position,
      tag: filters.tag,
      status: filters.status,
      ...(!hasFilters ? { letter: currentLetter } : {}),
    });
    router.push(`${currentPath}${query}`);
  };

  const handleApplySettings = (mode: "grid" | "list", newSettings: DisplaySettings) => {
    setSettings(newSettings);
    setIsSettingsOpen(false);
    if (mode === "list") {
      router.push(paramsToPath("list"));
    } else {
      router.push(paramsToPath("grid", newSettings.showHistory, newSettings.showName));
    }
  };

  const handleNameClick = (name: TyphoonName) => {
    setSelectedName(name);
    setIsNameModalOpen(true);
  };

  const handleCellClick = (position: number, names: TyphoonName[]) => {
    if (settings.showHistory) {
      setHistoryPosition(position);
      setHistoryPositionNames(names);
      setIsHistoryModalOpen(true);
    } else {
      if (names.length > 0) handleNameClick(names[0]);
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
            title="Switch to retired names"
            aria-label="Viewing active names, click to switch to retired"
            className="cursor-pointer border-0 bg-transparent p-1 text-emerald-600 transition-colors hover:text-emerald-800"
          >
            <Flame size={30} />
          </button>
          <Badge count={activeFilterCount} color="#10b981" offset={[-4, 4]}>
            <button
              onClick={() => setIsFilterModalOpen(true)}
              title="Filters"
              aria-label={`Open filters${activeFilterCount > 0 ? `, ${activeFilterCount} active` : ""}`}
              className="cursor-pointer border-0 bg-transparent p-1 text-gray-500 transition-colors hover:text-gray-800"
            >
              <Filter size={30} />
            </button>
          </Badge>
          <button
            onClick={() => setIsSettingsOpen(true)}
            title="Display settings"
            aria-label="Display settings"
            className="cursor-pointer border-0 bg-transparent p-1 text-gray-500 transition-colors hover:text-gray-800"
          >
            <Settings size={30} />
          </button>
        </div>
      </div>

      {showLetterNav && (
        <LetterNavigation onLetterChange={handleLetterChange} getLetterConfig={getLetterConfig} />
      )}

      {displayMode === "grid" ? (
        <PositionNameGrid
          names={filteredAllNames}
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
        showHistory={settings.showHistory}
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
