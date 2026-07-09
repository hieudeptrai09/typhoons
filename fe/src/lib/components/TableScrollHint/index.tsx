import type { ReactNode } from "react";

interface TableScrollHintProps {
  children: ReactNode;
}

const TableScrollHint = ({ children }: TableScrollHintProps) => (
  <>
    <p className="mb-2 text-xs text-gray-500 md:hidden">Swipe right to see full table →</p>
    <div className="relative">
      {children}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-stone-100 to-transparent md:hidden"
        aria-hidden="true"
      />
    </div>
  </>
);

export default TableScrollHint;
