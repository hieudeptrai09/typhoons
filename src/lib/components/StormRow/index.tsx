import ImageWithLoader from "@/lib/components/ImageWithLoader";
import StormHighlightBadges, { hasHighlight } from "@/lib/components/StormHighlightBadges";
import ZoomEarth from "@/lib/components/ZoomEarth";
import { INTENSITY_LABEL } from "@/lib/constants";
import type { Storm } from "@/lib/types";
import { BACKGROUND_BADGE, TEXT_COLOR_WHITE_BACKGROUND } from "@/lib/utils/colors";
import { formatStormDateRange } from "@/lib/utils/date";

/** One storm as a compact, intensity-bordered row, optionally with its track map. */
const StormRow = ({ storm, showMap }: { storm: Storm; showMap: boolean }) => {
  const borderColor = BACKGROUND_BADGE[storm.intensity];
  const textColor = TEXT_COLOR_WHITE_BACKGROUND[storm.intensity];
  const label = INTENSITY_LABEL[storm.intensity];
  const hasMap = storm.map && storm.map.trim() !== "";
  const dateRange = formatStormDateRange(storm.dateStart, storm.dateEnd);

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
      <div className="flex flex-wrap items-center justify-between gap-x-2">
        <span className="text-xs text-foreground">{dateRange}</span>
        <ZoomEarth storm={storm} />
      </div>
    </div>
  );
};

export default StormRow;
