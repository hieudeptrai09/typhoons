"use client";

import NameGroupHeader from "@/lib/components/NameGroupHeader";
import StormRow from "@/lib/components/StormRow";
import type { Storm } from "@/lib/types";
import { Switch } from "antd";
import { useState, type ReactNode } from "react";

export interface StormGroup {
  key: string;
  label: ReactNode;
  storms: Storm[];
}

interface GroupedStormListProps {
  groups: StormGroup[];
  // Gap years only mean something within one name or slot.
  showRecurrence?: boolean;
}

/** A modal's storms tab: a map toggle, then compact rows under group headers. */
const GroupedStormList = ({ groups, showRecurrence = true }: GroupedStormListProps) => {
  const [showMap, setShowMap] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-3 border-b border-gray-200 pb-4">
        <span className="text-sm font-semibold text-foreground">Show Map</span>
        <Switch checked={showMap} onChange={setShowMap} aria-label="Show storm track maps" />
      </div>

      <div className="space-y-5">
        {groups.map((group) => (
          <div key={group.key}>
            <div className="mb-2">
              <NameGroupHeader
                label={group.label}
                storms={group.storms}
                showRecurrence={showRecurrence}
              />
            </div>
            <div className="space-y-1">
              {group.storms.map((storm, idx) => (
                <StormRow
                  key={`${storm.year}-${storm.name}-${idx}`}
                  storm={storm}
                  showMap={showMap}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupedStormList;
