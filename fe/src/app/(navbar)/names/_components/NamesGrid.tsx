import { useMemo } from "react";
import {
  PawPrint,
  Moon,
  LibraryBig,
  Tag,
  Gem,
  Wind,
  User,
  MapPin,
  Leaf,
  Swords,
  Ham,
  Hammer,
} from "lucide-react";
import CountryFlag from "../../../../components/components/CountryFlag";
import { COUNTRY_FLAG_COMPONENTS } from "../../../../constants";
import { getCellBg } from "../_utils/fns";
import type { RetiredName } from "../../../../types";
import type { LucideIcon } from "lucide-react";

const TAG_ICONS: Record<string, LucideIcon> = {
  Animal: PawPrint,
  "Celestial body": Moon,
  Concept: LibraryBig,
  Deity: Swords,
  Descriptive: Tag,
  "Food and beverage": Ham,
  Mineral: Gem,
  Nature: Wind,
  "People's name": User,
  Place: MapPin,
  Plant: Leaf,
  Thing: Hammer,
};

const TAG_COLORS: Record<string, string> = {
  Animal: "text-emerald-700",
  "Celestial body": "text-indigo-800",
  Concept: "text-violet-700",
  Deity: "text-amber-700",
  Descriptive: "text-rose-700",
  "Food and beverage": "text-red-500",
  Mineral: "text-slate-500",
  Nature: "text-cyan-600",
  "People's name": "text-pink-600",
  Place: "text-blue-600",
  Plant: "text-green-600",
  Thing: "text-amber-800",
};

const TagIcon = ({ tag, size = 20 }: { tag: string; size?: number }) => {
  const Icon = TAG_ICONS[tag];
  const colorClass = TAG_COLORS[tag] ?? "text-gray-400";
  if (!Icon) return null;
  return <Icon size={size} className={colorClass} />;
};

const sortByOldest = (names: RetiredName[]) => [...names].sort((a, b) => a.id - b.id);

const CELL_SIZE = {
  single: { name: 14, icon: 20 },
  stacked: { name: 12, icon: 15 },
} as const;

const NameButton = ({
  name,
  size,
  showName,
  onNameClick,
}: {
  name: RetiredName;
  size: { name: number; icon: number };
  showName: boolean;
  onNameClick: (n: RetiredName) => void;
}) => (
  <button
    title={name.name}
    onClick={(e) => {
      e.stopPropagation();
      onNameClick(name);
    }}
    className="flex cursor-pointer items-center justify-center rounded border-0 bg-transparent p-0.5 hover:bg-stone-100"
  >
    {showName ? (
      <span
        className={`leading-tight font-medium ${name.isRetired ? "text-red-500" : "text-green-600"}`}
        style={{ fontSize: size.name }}
      >
        {name.name}
      </span>
    ) : (
      <TagIcon tag={name.tag} size={size.icon} />
    )}
  </button>
);

interface NamesGridProps {
  displayedNames: RetiredName[];
  allNames: RetiredName[];
  showHistory: boolean;
  showName: boolean;
  onNameClick: (name: RetiredName) => void;
  onPositionClick: (position: number, historyNames: RetiredName[]) => void;
}

const NamesGrid = ({
  displayedNames,
  allNames,
  showHistory,
  showName,
  onNameClick,
  onPositionClick,
}: NamesGridProps) => {
  const rows = 10;
  const cols = 14;

  const countryEntries = Object.entries(COUNTRY_FLAG_COMPONENTS);
  const columnWidth = `${100 / cols}%`;

  const displayedByPosition = useMemo(() => {
    const map: Record<number, RetiredName[]> = {};
    displayedNames.forEach((n) => {
      if (!map[n.position]) map[n.position] = [];
      map[n.position].push(n);
    });
    return map;
  }, [displayedNames]);

  const historyByPosition = useMemo(() => {
    const map: Record<number, RetiredName[]> = {};
    allNames.forEach((n) => {
      if (n.isLanguageProblem === 2) return;
      if (!map[n.position]) map[n.position] = [];
      map[n.position].push(n);
    });
    return map;
  }, [allNames]);

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <colgroup>
            {[...Array(cols)].map((_, idx) => (
              <col key={idx} style={{ width: columnWidth }} />
            ))}
          </colgroup>
          <thead>
            <tr>
              {countryEntries.map(([countryName], index) => (
                <th
                  key={index}
                  className="border border-sky-300 bg-sky-600 p-2"
                  title={countryName}
                >
                  <div className="flex items-center justify-center">
                    <CountryFlag country={countryName} className="h-7 w-10 border-white/30" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(rows)].map((_, row) => (
              <tr key={row}>
                {[...Array(cols)].map((_, col) => {
                  const position = row * cols + col + 1;
                  const cellNames = displayedByPosition[position] ?? [];
                  const historyNames = historyByPosition[position] ?? [];
                  const cellBg =
                    !showHistory && cellNames.length === 1 ? getCellBg(cellNames[0]) : "";

                  return (
                    <td
                      key={col}
                      className={`cursor-pointer border border-stone-300 p-0 transition-colors hover:bg-stone-100 ${cellBg}`}
                      onClick={() => {
                        if (showHistory) {
                          onPositionClick(position, historyNames);
                        } else if (cellNames.length === 1) {
                          onNameClick(cellNames[0]);
                        }
                      }}
                    >
                      <div className="flex min-h-16 flex-col items-center justify-center gap-0.5 p-1">
                        {showHistory ? (
                          historyNames.length === 0 ? (
                            <span className="text-xs text-gray-400">—</span>
                          ) : (
                            sortByOldest(historyNames).map((n) => (
                              <NameButton
                                key={n.id}
                                name={n}
                                size={CELL_SIZE.stacked}
                                showName={showName}
                                onNameClick={onNameClick}
                              />
                            ))
                          )
                        ) : cellNames.length === 0 ? (
                          <span className="text-xs text-gray-400">—</span>
                        ) : (
                          cellNames.map((n) => (
                            <NameButton
                              key={n.id}
                              name={n}
                              size={cellNames.length > 1 ? CELL_SIZE.stacked : CELL_SIZE.single}
                              showName={showName}
                              onNameClick={onNameClick}
                            />
                          ))
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!showName && (
        <div className="mx-auto mt-6 max-w-6xl">
          <div className="flex flex-wrap justify-center gap-3">
            {Object.entries(TAG_ICONS).map(([tag]) => (
              <div key={tag} className="flex items-center gap-1.5">
                <TagIcon tag={tag} size={14} />
                <span className="text-xs text-gray-600">{tag}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NamesGrid;
