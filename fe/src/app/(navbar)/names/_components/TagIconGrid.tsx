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
import PositionGrid from "../../../../components/components/PositionGrid";
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
    aria-label={`View details for ${name.name}`}
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
          <span className="text-sm font-semibold text-gray-700" id="show-name-label">
            Show Name
          </span>
          <Switch checked={showName} onChange={(v) => setShowName(v)} aria-label="Show Name" />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-700" id="show-history-label">
            Show History
          </span>
          <Switch
            checked={showHistory}
            onChange={(v) => setShowHistory(v)}
            aria-label="Show History"
          />
        </div>
      </div>

      <PositionGrid
        renderCell={(position, _row, col) => {
          const currentName = currentByPosition[position];
          const historyNames = historyByPosition[position] ?? [];

          return (
            <td
              key={col}
              className="cursor-pointer border border-stone-300 p-0 transition-colors hover:bg-stone-100"
              role="button"
              tabIndex={0}
              aria-label={`Position ${position}${currentName ? `, ${currentName.name}` : ""}`}
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
        }}
      />

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
