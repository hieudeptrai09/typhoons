import type { Storm } from "@/lib/types";
import { ArrowDownToLine, EyeOff, Medal, Zap } from "lucide-react";

export const hasHighlight = (storm: Storm): boolean =>
  Boolean(storm.isStrongest) ||
  Boolean(storm.isFirst) ||
  Boolean(storm.isLast) ||
  storm.isJtwcForecasted === false;

const BADGE_CLASS =
  "inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] leading-none font-semibold";

const StormHighlightBadges = ({ storm }: { storm: Storm }) => {
  if (!hasHighlight(storm)) return null;

  return (
    <div className="flex flex-wrap items-center gap-1">
      {Boolean(storm.isStrongest) && (
        <span className={`${BADGE_CLASS} bg-rose-200 text-rose-700`}>
          <Zap size={10} /> Strongest
        </span>
      )}
      {Boolean(storm.isFirst) && (
        <span className={`${BADGE_CLASS} bg-blue-200 text-blue-700`}>
          <Medal size={10} /> First
        </span>
      )}
      {Boolean(storm.isLast) && (
        <span className={`${BADGE_CLASS} bg-orange-200 text-orange-700`}>
          <ArrowDownToLine size={10} /> Last
        </span>
      )}
      {storm.isJtwcForecasted === false && (
        <span className={`${BADGE_CLASS} bg-slate-200 text-slate-700`}>
          <EyeOff size={10} /> Untracked
        </span>
      )}
    </div>
  );
};

export default StormHighlightBadges;
