import ImageWithLoader from "@/lib/components/ImageWithLoader";
import { INTENSITY_LABEL } from "@/lib/constants";
import type { Storm } from "@/lib/types";
import { BACKGROUND_BADGE, TEXT_COLOR_BADGE } from "@/lib/utils/colors";
import { formatStormDateRange } from "@/lib/utils/fns";
import { Calendar, Hash } from "lucide-react";

const StormCard = ({ storm }: { storm: Storm }) => {
  const bgColor = BACKGROUND_BADGE[storm.intensity];
  const textColor = TEXT_COLOR_BADGE[storm.intensity];
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
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex h-24 flex-col justify-center px-4" style={{ backgroundColor: bgColor }}>
        <span className="text-sm leading-tight font-bold" style={{ color: textColor }}>
          {label} {storm.name}
        </span>
        {storm.jtwcDesignation && (
          <div className="mt-1 flex items-center gap-1.5">
            <Hash size={12} style={{ color: textColor }} />
            <span className="text-xs font-medium" style={{ color: textColor }}>
              {storm.jtwcDesignation}
            </span>
          </div>
        )}
        {dateRange && (
          <div className="mt-1 flex items-center gap-1.5">
            <Calendar size={12} style={{ color: textColor }} />
            <span className="text-xs font-medium" style={{ color: textColor }}>
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
          <div className="flex h-full items-center justify-center text-xs text-foreground">
            No track map
          </div>
        )}
      </div>
    </div>
  );
};

export default StormCard;
