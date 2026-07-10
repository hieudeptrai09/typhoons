"use client";

import { useScrollEndFade } from "@/lib/hooks/useScrollEndFade";
import type { ReactNode } from "react";

interface TableScrollHintProps {
  children: ReactNode;
}

// Wraps a horizontally-scrollable antd table with a mobile "swipe" hint and a
// right-edge gradient fade so the columns clipped off-screen are discoverable
// on small screens. The fade tracks scroll position and disappears once the
// user reaches the end, so the last column stays readable. Both cues are
// md:hidden — desktop shows the table directly.
const TableScrollHint = ({ children }: TableScrollHintProps) => {
  const { wrapperRef, showEndFade } = useScrollEndFade();

  return (
    <>
      <p className="mb-2 text-xs text-gray-500 md:hidden">Swipe right to see full table →</p>
      <div ref={wrapperRef} className="relative">
        {children}
        <div
          className={`pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-stone-100 to-transparent transition-opacity duration-200 md:hidden ${
            showEndFade ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden="true"
        />
      </div>
    </>
  );
};

export default TableScrollHint;
