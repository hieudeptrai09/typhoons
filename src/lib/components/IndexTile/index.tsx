import { BACKGROUND_BADGE, TEXT_COLOR_WHITE_BACKGROUND } from "@/lib/utils/colors";
import type { GroupSummary } from "@/lib/utils/storms";
import { getIntensityFromNumber } from "@/lib/utils/storms";
import Link from "next/link";
import type { ReactNode } from "react";

interface IndexTileProps {
  href: string;
  label: ReactNode;
  // Missing when nothing has been recorded yet.
  summary?: GroupSummary;
  icon?: ReactNode;
}

const EMPTY_COLOR = "#94a3b8";

/**
 * One entry of an index page. A soft <Link> so the detail opens as an intercepted modal,
 * while refreshing or sharing its URL still lands on the full page.
 */
const IndexTile = ({ href, label, summary, icon }: IndexTileProps) => {
  const intensity = summary ? getIntensityFromNumber(summary.average) : null;

  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm transition-colors hover:bg-slate-50"
      style={{ borderLeft: `4px solid ${intensity ? BACKGROUND_BADGE[intensity] : EMPTY_COLOR}` }}
    >
      {icon}
      <span className="flex min-w-0 flex-col">
        <span
          className="truncate font-bold"
          style={{ color: intensity ? TEXT_COLOR_WHITE_BACKGROUND[intensity] : EMPTY_COLOR }}
        >
          {label}
        </span>
        <span className="text-xs text-slate-500 tabular-nums">
          {summary
            ? `${summary.count} ${summary.count === 1 ? "storm" : "storms"} · avg ${summary.average.toFixed(2)}`
            : "No storms yet"}
        </span>
      </span>
    </Link>
  );
};

export default IndexTile;
