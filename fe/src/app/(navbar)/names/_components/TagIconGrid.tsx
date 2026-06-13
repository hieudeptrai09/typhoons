"use client";

import { useState } from "react";
import { Switch } from "antd";
import {
  PawPrint,
  Moon,
  Lightbulb,
  Sparkles,
  Tag,
  Apple,
  Diamond,
  Zap,
  User,
  MapPin,
  Leaf,
  Box,
} from "lucide-react";
import CountryFlag from "../../../../components/components/CountryFlag";
import { COUNTRY_FLAG_COMPONENTS } from "../../../../constants";
import type { TyphoonName } from "../../../../types";
import type { LucideIcon } from "lucide-react";

const TAG_ICONS: Record<string, LucideIcon> = {
  Animal: PawPrint,
  "Celestial body": Moon,
  Concept: Lightbulb,
  Deity: Sparkles,
  Descriptive: Tag,
  "Food and beverage": Apple,
  Mineral: Diamond,
  Nature: Zap,
  "People's name": User,
  Place: MapPin,
  Plant: Leaf,
  Thing: Box,
};

const TAG_COLORS: Record<string, string> = {
  Animal: "#0F6E56",
  "Celestial body": "#185FA5",
  Concept: "#534AB7",
  Deity: "#854F0B",
  Descriptive: "#993C1D",
  "Food and beverage": "#3B6D11",
  Mineral: "#5F5E5A",
  Nature: "#854F0B",
  "People's name": "#993556",
  Place: "#185FA5",
  Plant: "#3B6D11",
  Thing: "#5F5E5A",
};

const TagIcon = ({ tag, size = 20 }: { tag: string; size?: number }) => {
  const Icon = TAG_ICONS[tag];
  const color = TAG_COLORS[tag] ?? "#888";
  if (!Icon) return null;
  return <Icon size={size} color={color} />;
};

const sortByOldest = (names: TyphoonName[]) => [...names].sort((a, b) => a.id - b.id);

interface TagIconGridProps {
  names: TyphoonName[];
  currentNames: TyphoonName[];
  onNameClick: (name: TyphoonName) => void;
}

const TagIconGrid = ({ names, currentNames, onNameClick }: TagIconGridProps) => {
  const [showHistory, setShowHistory] = useState(false);
  const [expandedPosition, setExpandedPosition] = useState<number | null>(null);

  const rows = 10;
  const cols = 14;

  const countryEntries = Object.entries(COUNTRY_FLAG_COMPONENTS);
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

  const handleCellClick = (position: number) => {
    setExpandedPosition((prev) => (prev === position ? null : position));
  };

  const renderExpanded = (historyNames: TyphoonName[], position: number) => (
    <div className="flex min-h-16 flex-col items-center justify-center gap-1 py-1">
      {sortByOldest(historyNames).map((n) => (
        <button
          key={n.id}
          title={n.name}
          onClick={(e) => {
            e.stopPropagation();
            onNameClick(n);
          }}
          className="flex cursor-pointer items-center justify-center rounded border-0 bg-transparent p-0.5 hover:bg-stone-100"
        >
          <TagIcon tag={n.tag} size={13} />
        </button>
      ))}
    </div>
  );

  return (
    <div>
      <div className="mx-auto mb-4 flex max-w-4xl items-center justify-end gap-3">
        <span className="text-sm font-semibold text-gray-700">Show History</span>
        <Switch
          checked={showHistory}
          onChange={(v) => {
            setShowHistory(v);
            setExpandedPosition(null);
          }}
        />
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
                  const currentName = currentByPosition[position];
                  const historyNames = historyByPosition[position] ?? [];
                  const isExpanded = expandedPosition === position;

                  if (showHistory) {
                    return (
                      <td
                        key={col}
                        className={`cursor-pointer border border-stone-300 p-0 transition-colors ${
                          isExpanded ? "bg-sky-50" : "hover:bg-stone-100"
                        }`}
                        onClick={() => handleCellClick(position)}
                      >
                        {isExpanded ? (
                          <div className="flex min-h-16 items-center justify-center p-1">
                            {currentName ? (
                              <button
                                title={currentName.name}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onNameClick(currentName);
                                }}
                                className="flex cursor-pointer items-center justify-center rounded border-0 bg-transparent p-1 hover:bg-stone-100"
                              >
                                <TagIcon tag={currentName.tag} size={20} />
                              </button>
                            ) : (
                              <span className="text-xs text-gray-300">—</span>
                            )}
                          </div>
                        ) : (
                          <div className="flex min-h-16 flex-col items-center justify-center gap-0.5 py-1">
                            {historyNames.length === 0 ? (
                              <span className="text-xs text-gray-300">—</span>
                            ) : (
                              sortByOldest(historyNames).map((n) => (
                                <button
                                  key={n.id}
                                  title={n.name}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onNameClick(n);
                                  }}
                                  className="flex cursor-pointer items-center justify-center rounded border-0 bg-transparent p-0.5 hover:bg-stone-100"
                                >
                                  <TagIcon tag={n.tag} size={15} />
                                </button>
                              ))
                            )}
                          </div>
                        )}
                      </td>
                    );
                  }

                  return (
                    <td
                      key={col}
                      className={`cursor-pointer border border-stone-300 p-0 transition-colors ${
                        isExpanded ? "bg-sky-50" : "hover:bg-stone-100"
                      }`}
                      onClick={() => handleCellClick(position)}
                    >
                      {isExpanded ? (
                        renderExpanded(historyNames, position)
                      ) : (
                        <div className="flex min-h-16 items-center justify-center p-1">
                          {currentName ? (
                            <button
                              title={currentName.name}
                              onClick={(e) => {
                                e.stopPropagation();
                                onNameClick(currentName);
                              }}
                              className="flex cursor-pointer items-center justify-center rounded border-0 bg-transparent p-1 hover:bg-stone-100"
                            >
                              <TagIcon tag={currentName.tag} size={20} />
                            </button>
                          ) : (
                            <span className="text-xs text-gray-300">—</span>
                          )}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mx-auto mt-6 max-w-4xl">
        <div className="flex flex-wrap justify-center gap-3">
          {Object.entries(TAG_ICONS).map(([tag]) => (
            <div key={tag} className="flex items-center gap-1.5">
              <TagIcon tag={tag} size={14} />
              <span className="text-xs text-gray-600">{tag}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TagIconGrid;
