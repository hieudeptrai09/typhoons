"use client";

import { useState } from "react";
import { Switch } from "antd";
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
import { getNameStatusColorClass } from "../../../../components/colors";
import CountryFlag from "../../../../components/components/CountryFlag";
import { COUNTRY_NAMES } from "../../../../components/components/CountryFlag";
import type { TyphoonName } from "../../../../types";
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

const sortByOldest = (names: TyphoonName[]) => [...names].sort((a, b) => a.id - b.id);

const CELL_SIZE = {
  current: { name: 14, icon: 20 },
  history: { name: 12, icon: 15 },
} as const;

const NameButton = ({
  name,
  size,
  showName,
  onNameClick,
}: {
  name: TyphoonName;
  size: { name: number; icon: number };
  showName: boolean;
  onNameClick: (n: TyphoonName) => void;
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
        className={`leading-tight font-medium ${getNameStatusColorClass(name)}`}
        style={{ fontSize: size.name }}
      >
        {name.name}
      </span>
    ) : (
      <TagIcon tag={name.tag} size={size.icon} />
    )}
  </button>
);

const CellContent = ({
  currentName,
  historyNames,
  showHistory,
  showName,
  onNameClick,
}: {
  currentName: TyphoonName | undefined;
  historyNames: TyphoonName[];
  showHistory: boolean;
  showName: boolean;
  onNameClick: (n: TyphoonName) => void;
}) => {
  if (showHistory) {
    return (
      <div className="flex min-h-16 flex-col items-center justify-center gap-0.5 py-1">
        {historyNames.length === 0 ? (
          <span className="text-xs text-gray-400">—</span>
        ) : (
          sortByOldest(historyNames).map((n) => (
            <NameButton
              key={n.id}
              name={n}
              size={CELL_SIZE.history}
              showName={showName}
              onNameClick={onNameClick}
            />
          ))
        )}
      </div>
    );
  }

  return (
    <div className="flex min-h-16 items-center justify-center p-1">
      {currentName ? (
        <NameButton
          name={currentName}
          size={CELL_SIZE.current}
          showName={showName}
          onNameClick={onNameClick}
        />
      ) : (
        <span className="text-xs text-gray-400">—</span>
      )}
    </div>
  );
};

interface TagIconGridProps {
  names: TyphoonName[];
  currentNames: TyphoonName[];
  onNameClick: (name: TyphoonName) => void;
  onCellClick: (
    position: number,
    currentName: TyphoonName | undefined,
    historyNames: TyphoonName[],
    showHistory: boolean,
  ) => void;
}

const TagIconGrid = ({ names, currentNames, onNameClick, onCellClick }: TagIconGridProps) => {
  const [showHistory, setShowHistory] = useState(false);
  const [showName, setShowName] = useState(false);

  const rows = 10;
  const cols = 14;

  const columnWidth = `${100 / cols}%`;

  const currentByPosition = currentNames.reduce<Record<number, TyphoonName>>((acc, n) => {
    if (n.isLanguageProblem === 2) return acc;
    acc[n.position] = n;
    return acc;
  }, {});

  const historyByPosition = names.reduce<Record<number, TyphoonName[]>>((acc, n) => {
    if (n.isLanguageProblem === 2) return acc;
    if (!acc[n.position]) acc[n.position] = [];
    acc[n.position].push(n);
    return acc;
  }, {});

  return (
    <div>
      <div className="mx-auto mb-4 flex max-w-4xl items-center justify-end gap-6">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-700">Show Name</span>
          <Switch checked={showName} onChange={(v) => setShowName(v)} />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-700">Show History</span>
          <Switch checked={showHistory} onChange={(v) => setShowHistory(v)} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <colgroup>
            {[...Array(cols)].map((_, idx) => (
              <col key={idx} style={{ width: columnWidth }} />
            ))}
          </colgroup>
          <thead>
            <tr>
              {COUNTRY_NAMES.map((countryName, index) => (
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
                  const currentName = currentByPosition[position];
                  const historyNames = historyByPosition[position] ?? [];

                  return (
                    <td
                      key={col}
                      className="cursor-pointer border border-stone-300 p-0 transition-colors hover:bg-stone-100"
                      onClick={() => onCellClick(position, currentName, historyNames, showHistory)}
                    >
                      <CellContent
                        currentName={currentName}
                        historyNames={historyNames}
                        showHistory={showHistory}
                        showName={showName}
                        onNameClick={onNameClick}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!showName && (
        <div className="max-w-8xl mx-auto mt-6">
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

export default TagIconGrid;
