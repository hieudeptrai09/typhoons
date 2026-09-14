import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

export interface PaginationLink {
  href: string;
  label: ReactNode;
  // Wrapping around from the last page to the first is shown in gray.
  isWrap?: boolean;
}

interface PagePaginationProps {
  prev: PaginationLink;
  next: PaginationLink;
  current: ReactNode;
  ariaLabel: string;
}

const linkClass = (isWrap?: boolean) =>
  `flex items-center gap-1 rounded-lg border px-4 py-2 text-sm font-semibold text-white transition-colors ${
    isWrap
      ? "border-gray-500 bg-gray-500 hover:border-slate-600 hover:bg-slate-600"
      : "border-sky-700 bg-sky-700 hover:border-sky-800 hover:bg-sky-800"
  }`;

/** Previous / next links at the foot of a detail page. */
const PagePagination = ({ prev, next, current, ariaLabel }: PagePaginationProps) => (
  <nav
    className="mt-6 flex items-center justify-between border-t border-slate-200 pt-6"
    aria-label={ariaLabel}
  >
    <a href={prev.href} className={linkClass(prev.isWrap)}>
      <ChevronLeft className="h-4 w-4" />
      {prev.label}
    </a>
    <span className="text-sm text-foreground">{current}</span>
    <a href={next.href} className={linkClass(next.isWrap)}>
      {next.label}
      <ChevronRight className="h-4 w-4" />
    </a>
  </nav>
);

export default PagePagination;
