"use client";

import NameGroupHeader from "@/lib/components/NameGroupHeader";
import StormCard from "@/lib/components/StormCard";
import type { Storm } from "@/lib/types";
import { Switch } from "antd";
import { useState, type ReactNode } from "react";

export interface StormGroup {
  key: string;
  label: ReactNode;
  storms: Storm[];
}

interface GroupedStormCardsProps {
  groups: StormGroup[];
  // Gap years only mean something within one name or slot.
  showRecurrence?: boolean;
  // A modal is narrower than the viewport breakpoints suggest, so it caps the grid at two columns.
  isCompact?: boolean;
}

/** Storms as card grids under group headers, maps hidden until asked for. */
const GroupedStormCards = ({
  groups,
  showRecurrence = true,
  isCompact = false,
}: GroupedStormCardsProps) => {
  const [showMap, setShowMap] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end gap-3 border-b border-gray-200 pb-4">
        <span className="text-sm font-semibold text-foreground">Show Map</span>
        <Switch checked={showMap} onChange={setShowMap} aria-label="Show storm track maps" />
      </div>

      {groups.map((group) => (
        <div key={group.key}>
          <div className="mb-3">
            <NameGroupHeader
              label={group.label}
              storms={group.storms}
              showRecurrence={showRecurrence}
            />
          </div>
          <div
            className={`grid gap-4 ${isCompact ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}`}
          >
            {group.storms.map((storm, idx) => (
              <StormCard
                key={`${storm.year}-${storm.name}-${idx}`}
                storm={storm}
                showMap={showMap}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GroupedStormCards;
