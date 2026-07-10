"use client";

import { useScrollEndFade } from "@/lib/hooks/useScrollEndFade";
import type { ReactNode } from "react";

interface TableScrollHintProps {
  children: ReactNode;
}

const TableScrollHint = ({ children }: TableScrollHintProps) => {
  const { wrapperRef, showEndFade } = useScrollEndFade();

  return (
    <>
      <p className="mb-2 text-xs text-muted hidden">Swipe right to see full table →</p>
      <div ref={wrapperRef} className="relative">
        {children}
        <div
          className={`pointer-events-none absolute inset-y-0 right-0 w-8 bg-linear-to-l from-stone-100 to-transparent transition-opacity duration-200 md:hidden ${
            showEndFade ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden="true"
        />
      </div>
    </>
  );
};

export default TableScrollHint;
