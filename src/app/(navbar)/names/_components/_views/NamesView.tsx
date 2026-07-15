import LetterNavigation from "@/lib/components/LetterNavigation";
import { defaultTyphoonName } from "@/lib/constants";
import type { FilterParams, TyphoonName } from "@/lib/types";
import { toArr } from "@/lib/utils/fns";
import { Badge } from "antd";
import { Filter, Settings, Skull } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import HistoryModal from "../_modals/HistoryModal";
import ListFilterModal from "../_modals/ListFilterModal";
import NameDetailsModal from "../_modals/NameDetailsModal";
import NamesSettingsModal from "../_modals/NamesSettingsModal";
import type { DisplaySettings } from "../_modals/NamesSettingsModal";
import FilteredNamesTable from "../_widgets/FilteredNamesTable";
import PositionNameGrid from "../_widgets/PositionNameGrid";
import type { NamesDisplayPrefs } from "../../_utils/displayPrefs";
import { writeDisplayPrefs } from "../../_utils/displayPrefs";
import { paramsToPath } from "../../_utils/fns";

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
  displayPrefs: NamesDisplayPrefs;
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

const getFirstAvailableLetter = (letterStatusMap: Record<string, [boolean, boolean, boolean]>) => {
  const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  return allLetters.find((letter) => letterStatusMap[letter]?.[0]) ?? "A";
};

const NamesView = ({
  allNames,
  viewMode,
  showName,
  showHistory,
  displayPrefs,
  onToggleView,
}: NamesViewProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const displayMode = viewMode === "list" ? ("list" as const) : ("grid" as const);
  const currentPath = paramsToPath(displayMode, showHistory, showName);

  const searchName = searchParams.get("name") || "";
  const selectedCountry = searchParams.get("country") || "";
  const selectedLanguage = searchParams.get("language") || "";
  const selectedTag = searchParams.get("tag") || "";
  const searchPosition = searchParams.get("position") || "";

  const countryArr = toArr(selectedCountry);
  const languageArr = toArr(selectedLanguage);
  const tagArr = toArr(selectedTag);

  const [prefs, setPrefs] = useState<NamesDisplayPrefs>(displayPrefs);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedName, setSelectedName] = useState<TyphoonName>(defaultTyphoonName);
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [historyPosition, setHistoryPosition] = useState<number>(0);
  const [historyPositionNames, setHistoryPositionNames] = useState<TyphoonName[]>([]);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const settings: DisplaySettings = { ...prefs, showName, showHistory };

  const selectedStatus = showHistory ? searchParams.get("status") || "" : "current";

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
    showHistory ? selectedStatus : "",
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

  const statusFilteredNames = useMemo(
    () =>
      selectedStatus
        ? applyNameFilters(allNames, {
            name: "",
            country: [],
            language: [],
            tag: [],
            position: "",
            status: selectedStatus,
          })
        : allNames,
    [allNames, selectedStatus],
  );

  const letterStatusMap = useMemo(
    () => categorizeLettersByStatus(statusFilteredNames),
    [statusFilteredNames],
  );
  const currentLetter = searchParams.get("letter") || getFirstAvailableLetter(letterStatusMap);

  const filteredAllNames = useMemo(() => {
    if (hasActiveFilters) return applyNameFilters(statusFilteredNames, filterValues);
    if (!prefs.showLetterNav) return statusFilteredNames;
    return statusFilteredNames.filter((n) => n.name.charAt(0).toUpperCase() === currentLetter);
  }, [statusFilteredNames, hasActiveFilters, filterValues, prefs.showLetterNav, currentLetter]);

  const showLetterNav = !hasActiveFilters && prefs.showLetterNav;

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
    const newPrefs: NamesDisplayPrefs = {
      showLetterNav: newSettings.showLetterNav,
      colorfulHistory: newSettings.colorfulHistory,
      showImageAndDescription: newSettings.showImageAndDescription,
    };

    setPrefs(newPrefs);
    setIsSettingsOpen(false);
    // Written before navigating so the next server render sees the new value.
    writeDisplayPrefs(newPrefs);

    if (mode === "list") {
      router.push(paramsToPath("list", newSettings.showHistory));
    } else {
      router.push(paramsToPath("grid", newSettings.showHistory, newSettings.showName));
    }
  };

  const handleNameClick = (name: TyphoonName) => {
    setSelectedName(name);
    setIsNameModalOpen(true);
  };

  const handleCellClick = (position: number, names: TyphoonName[]) => {
    if (showHistory) {
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

    if (!status?.[0]) return { isAvailable: false, color: "#9ca3af" };

    const hasRetired = status[1];
    const hasAlive = status[2];

    if (hasRetired && hasAlive) {
      return { isAvailable: true, color: isActive ? "#1e40af" : "#2563eb", isActive };
    } else if (hasRetired && !hasAlive) {
      return { isAvailable: true, color: isActive ? "#991b1b" : "#dc2626", isActive };
    } else {
      return { isAvailable: true, color: isActive ? "#166534" : "#16a34a", isActive };
    }
  };

  return (
    <>
      <div className="mx-auto mb-4 max-w-4xl">
        <div className="flex items-center justify-center gap-9">
          <button
            onClick={onToggleView}
            title="Switch to retired names"
            aria-label="Viewing all names, click to switch to retired"
            className="cursor-pointer border-0 bg-transparent p-1 text-red-500 transition-colors hover:text-red-700"
          >
            <Skull size={30} />
          </button>
          <Badge count={activeFilterCount} color="#ef4444" offset={[-4, 4]}>
            <button
              onClick={() => setIsFilterModalOpen(true)}
              title="Filters"
              aria-label={`Open filters${activeFilterCount > 0 ? `, ${activeFilterCount} active` : ""}`}
              className="cursor-pointer border-0 bg-transparent p-1 text-foreground transition-colors hover:text-highlight"
            >
              <Filter size={30} />
            </button>
          </Badge>
          <button
            onClick={() => setIsSettingsOpen(true)}
            title="Display settings"
            aria-label="Display settings"
            className="cursor-pointer border-0 bg-transparent p-1 text-foreground transition-colors hover:text-highlight"
          >
            <Settings size={30} />
          </button>
        </div>
        <div className="hidden mt-2 justify-center">
          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
            Click the skull icon to view retired names
          </span>
        </div>
      </div>

      {showLetterNav && (
        <LetterNavigation onLetterChange={handleLetterChange} getLetterConfig={getLetterConfig} />
      )}

      {displayMode === "grid" ? (
        <PositionNameGrid
          names={filteredAllNames}
          showName={showName}
          showHistory={showHistory}
          colorfulHistory={prefs.colorfulHistory}
          onNameClick={handleNameClick}
          onCellClick={handleCellClick}
        />
      ) : (
        <FilteredNamesTable
          filteredNames={filteredAllNames}
          showImageAndDescription={prefs.showImageAndDescription}
          onNameClick={handleNameClick}
        />
      )}

      <ListFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyFilters}
        countries={countries}
        languages={languages}
        tags={tags}
        showHistory={showHistory}
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
