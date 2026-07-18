"use client";

import CountryFlag from "@/lib/components/CountryFlag";
import EmptyResults from "@/lib/components/EmptyResults";
import ImageWithLoader from "@/lib/components/ImageWithLoader";
import StormHighlightBadges, { hasHighlight } from "@/lib/components/StormHighlightBadges";
import { INTENSITY_LABEL } from "@/lib/constants";
import type { Storm } from "@/lib/types";
import { BACKGROUND_BADGE, TEXT_COLOR_WHITE_BACKGROUND } from "@/lib/utils/colors";
import { formatStormDateRange } from "@/lib/utils/fns";
import { Switch } from "antd";
import { Inbox } from "lucide-react";
import { useState } from "react";

export interface StormListContentProps {
  storms: Storm[];
}

function StormRow({ storm, showMap }: { storm: Storm; showMap: boolean }) {
  const borderColor = BACKGROUND_BADGE[storm.intensity];
  const textColor = TEXT_COLOR_WHITE_BACKGROUND[storm.intensity];
  const label = INTENSITY_LABEL[storm.intensity];
  const hasMap = storm.map && storm.map.trim() !== "";
  const dateRange = formatStormDateRange(
    storm.year,
    storm.monthStart,
    storm.dateStart,
    storm.monthEnd,
    storm.dateEnd,
    storm.isFromPrevYear,
  );

  return (
    <div
      className="rounded-md px-3 py-2 transition-colors hover:bg-gray-50"
      style={{ borderLeft: `4px solid ${borderColor}` }}
    >
      {showMap && hasMap && (
        <div className="relative mb-2 h-48 w-full">
          <ImageWithLoader
            src={storm.map}
            alt={`${storm.name} ${storm.year} track`}
            fill
            className="rounded border border-gray-200 object-contain"
            unoptimized
          />
        </div>
      )}
      {hasHighlight(storm) && (
        <div className="mb-1.5">
          <StormHighlightBadges storm={storm} />
        </div>
      )}
      <div className="text-sm font-bold" style={{ color: textColor }}>
        {label} {storm.name}
        {storm.jtwcDesignation && ` (${storm.jtwcDesignation})`}
      </div>
      {dateRange && <div className="text-xs text-foreground">{dateRange}</div>}
    </div>
  );
}

const StormListContent = ({ storms }: StormListContentProps) => {
  const [showMap, setShowMap] = useState(false);

  if (storms.length === 0) {
    return <EmptyResults icon={Inbox} description="No storms found for this name." />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 border-b border-gray-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span id="storm-list-country-label" className="font-semibold text-foreground">
              Contributed by:
            </span>
            {storms[0].position <= 140 && (
              <CountryFlag country={storms[0].country} className="h-5 w-8" />
            )}
            <span className="text-foreground">{storms[0].country}</span>
          </div>
          <div>
            <span id="storm-list-position-label" className="font-semibold text-foreground">
              Position:
            </span>
            <span className="ml-2 text-foreground" aria-describedby="storm-list-position-label">
              {storms[0].position}
            </span>
          </div>
          {storms[0].correctSpelling && (
            <div>
              <span className="font-semibold text-foreground">Correct spelling:</span>
              <span className="ml-2 text-foreground">{storms[0].correctSpelling}</span>
            </div>
          )}
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
