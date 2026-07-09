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

const NamesView = ({ allNames, viewMode, showName, showHistory, onToggleView }: NamesViewProps) => {
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

  const selectedStatus = settings.showHistory ? searchParams.get("status") || "" : "current";

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
    settings.showHistory ? selectedStatus : "",
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

  const letterStatusMap = useMemo(() => categorizeLettersByStatus(allNames), [allNames]);
  const currentLetter = searchParams.get("letter") || getFirstAvailableLetter(letterStatusMap);

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

  const filteredAllNames = useMemo(() => {
    if (hasActiveFilters) return applyNameFilters(statusFilteredNames, filterValues);
    if (!settings.showLetterNav) return statusFilteredNames;
    return statusFilteredNames.filter((n) => n.name.charAt(0).toUpperCase() === currentLetter);
  }, [statusFilteredNames, hasActiveFilters, filterValues, settings.showLetterNav, currentLetter]);

  const showLetterNav = !hasActiveFilters && settings.showLetterNav;

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
    if (settings.showHistory) {
      setHistoryPosition(position);
      setHistoryPositionNames(names);
      setIsHistoryModalOpen(true);
    } else {
      if (names.length > 0) handleNameClick(names[0]);
    }
  };

  // DUPLICATE: re-implements name-status color logic locally with its own hex
  // values instead of using colors.ts's getNameStatusColor/getNameStatusColorClass.
  // This is one of 3 independent copies of "status -> color" branching in the
  // app (see also RetiredView.tsx's getLetterConfig and SearchPageContent.tsx's
  // inline ternary) — none share a single source of truth, so shades/hues can
  // (and do) drift between them.
  // WCAG (all measured as text color on white, per LetterNavigation rendering):
  //   mixed active   #1e3a8a -> 10.36:1 PASS AAA
  //   mixed inactive #3b82f6 ->  3.68:1 FAIL normal-text AA (passes 3:1 large-text/UI only)
  //   all-retired active   #991b1b -> 8.31:1 PASS AAA
  //   all-retired inactive #ef4444 -> 3.76:1 FAIL normal-text AA (passes 3:1 large-text/UI only)
  //   all-active active    #166534 -> 7.13:1 PASS AAA
  //   all-active inactive  #22c55e -> 2.28:1 WCAG FAIL (fails even 3:1 large-text/UI)
  //   unavailable           #d1d5db -> 1.47:1 (intentionally muted, but this low a
  //     ratio also risks failing to be perceivable as "text" at all against white)
  // SEMANTIC NOTE: the "all-retired" red (#991b1b/#ef4444) is a 4th distinct red
  // shade pair in the app alongside colors.ts's red-600 (#dc2626, "retired name"),
  // StormGrid's red-300 ("strongest storm"), and PositionNameGrid's red-500
  // ("Food and beverage" tag) — none of these reds are reused consistently even
  // when they mean the same "retired" concept.
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
        <div className="mt-2 flex justify-center">
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
