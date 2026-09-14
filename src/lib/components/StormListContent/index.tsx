"use client";

import CountryFlag from "@/lib/components/CountryFlag";
import EmptyResults from "@/lib/components/EmptyResults";
import StormRow from "@/lib/components/StormRow";
import type { Storm } from "@/lib/types";
import { isExternalPosition } from "@/lib/utils/position";
import { Switch } from "antd";
import { Inbox } from "lucide-react";
import { useState } from "react";

export interface StormListContentProps {
  storms: Storm[];
}

const StormListContent = ({ storms }: StormListContentProps) => {
  const [showMap, setShowMap] = useState(false);

  if (storms.length === 0) {
    return <EmptyResults icon={Inbox} description="No storms found for this name." />;
  }

  const isInternal = !isExternalPosition(storms[0].position);

  return (
    <div className="space-y-4">
      {/* The averages live in the modal's Stats tab. */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-4">
        <div className="flex items-center gap-2 text-sm text-foreground">
          {isInternal && <CountryFlag country={storms[0].country} className="h-5 w-8" />}
          <span>{storms[0].country}</span>
          {isInternal && <span className="text-gray-400">· #{storms[0].position}</span>}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-foreground">Show Map</span>
          <Switch checked={showMap} onChange={setShowMap} aria-label="Show storm track map" />
        </div>
      </div>

      <div>
        <h3 id="storm-list-heading" className="mb-3 font-semibold text-foreground">
          All Storms ({storms.length})
        </h3>
        <div className="space-y-1" aria-describedby="storm-list-heading">
          {storms.map((storm, idx) => (
            <StormRow key={`${storm.year}-${storm.name}-${idx}`} storm={storm} showMap={showMap} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StormListContent;
