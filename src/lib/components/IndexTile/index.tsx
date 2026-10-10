import Link from "next/link";
import type { ReactNode } from "react";

interface IndexTileProps {
  href: string;
  label: ReactNode;
  // Missing when nothing has been recorded yet.
  count?: number;
  icon?: ReactNode;
}

/**
 * One entry of an index page. A soft <Link> so the detail opens as an intercepted modal,
 * while refreshing or sharing its URL still lands on the full page.
 * Kept neutral: the index is a gateway, and the detail page is where the stats live.
 * Not prefetched: an index holds dozens of tiles, and each prefetch is an ISR read.
 */
const IndexTile = ({ href, label, count, icon }: IndexTileProps) => (
  <Link
    href={href}
    prefetch={false}
    className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm transition-colors hover:bg-slate-50"
  >
    {icon}
    <span className="flex min-w-0 flex-col">
      <span className={`truncate font-bold ${count ? "text-slate-800" : "text-slate-400"}`}>
        {label}
      </span>
      <span className="text-xs text-slate-500 tabular-nums">
        {count ? `${count} ${count === 1 ? "storm" : "storms"}` : "No storms yet"}
      </span>
    </span>
  </Link>
);

export default IndexTile;
