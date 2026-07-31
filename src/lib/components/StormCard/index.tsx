import ImageWithLoader from "@/lib/components/ImageWithLoader";
import StormHighlightBadges, { hasHighlight } from "@/lib/components/StormHighlightBadges";
import { INTENSITY_LABEL } from "@/lib/constants";
import type { Storm } from "@/lib/types";
import { BACKGROUND_BADGE, TEXT_COLOR_BADGE } from "@/lib/utils/colors";
import { formatStormDateRange, getZoomEarthUrl } from "@/lib/utils/fns";
import { Calendar, ExternalLink, Hash, ImageOff } from "lucide-react";

const StormCard = ({ storm }: { storm: Storm }) => {
  const bgColor = BACKGROUND_BADGE[storm.intensity];
  const textColor = TEXT_COLOR_BADGE[storm.intensity];
  const label = INTENSITY_LABEL[storm.intensity];
  const hasMap = storm.map && storm.map.trim() !== "";
  const dateRange = formatStormDateRange(storm.dateStart, storm.dateEnd);

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex h-28 flex-col justify-center px-4" style={{ backgroundColor: bgColor }}>
        {hasHighlight(storm) && (
          <div className="mb-1.5">
            <StormHighlightBadges storm={storm} />
          </div>
        )}
        <span className="text-sm leading-tight font-bold" style={{ color: textColor }}>
          {label} {storm.name}
        </span>
        {storm.jtwcDesignation && (
          <div className="mt-1 flex items-center gap-1.5">
            <Hash size={12} style={{ color: textColor }} />
            <span className="text-xs font-semibold" style={{ color: textColor }}>
              {storm.jtwcDesignation}
            </span>
          </div>
        )}
        {dateRange && (
          <div className="mt-1 flex items-center gap-1.5">
            <Calendar size={12} style={{ color: textColor }} />
            <span className="text-xs font-semibold" style={{ color: textColor }}>
              {dateRange}
            </span>
          </div>
        )}
      </div>
      <div className="relative h-44 w-full bg-slate-50">
        {hasMap ? (
          <ImageWithLoader
            src={storm.map}
            alt={`${storm.name} ${storm.year} track`}
            fill
            className="object-contain"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center gap-1.5 text-xs text-slate-400">
            <ImageOff size={14} />
          </div>
        )}
      </div>
      <div className="border-t border-slate-100 px-4 py-2">
        <a
          href={getZoomEarthUrl(storm.name, storm.year)}
          target="_blank"
          rel="noopener noreferrer"
          title={`View ${storm.name} ${storm.year} on Zoom Earth`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-sky-700 hover:underline"
        >
          Zoom Earth
          <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
};

export default StormCard;
