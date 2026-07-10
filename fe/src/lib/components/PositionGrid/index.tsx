"use client";

import { useScrollEndFade } from "@/lib/hooks/useScrollEndFade";
import type { ReactNode } from "react";
import CountryFlag, { COUNTRY_NAMES } from "../CountryFlag";

const ROWS = 10;
const COLS = 14;

interface PositionGridProps {
  renderCell: (position: number, row: number, col: number) => ReactNode;
  positionOffset?: number;
  showHeader?: boolean;
}

const PositionGrid = ({ renderCell, positionOffset = 1, showHeader = true }: PositionGridProps) => {
  const columnWidth = `${100 / COLS}%`;
  const { wrapperRef, showEndFade } = useScrollEndFade();

  return (
    <div>
      <p className="mb-2 text-xs text-gray-500 md:hidden">Swipe right to see full table →</p>
      <div ref={wrapperRef} className="relative">
        <div className="overflow-x-auto" data-scroll-container>
          <table
            className="min-w-full border-collapse"
          aria-label="Typhoon name positions by country"
        >
          <colgroup>
            {[...Array(COLS)].map((_, idx) => (
              <col key={idx} style={{ width: columnWidth }} />
            ))}
          </colgroup>
          {showHeader && (
            <thead>
              <tr>
                {COUNTRY_NAMES.map((countryName, index) => (
                  <th
                    key={index}
                    className="border border-sky-300 bg-sky-600 p-2"
                    title={countryName}
                  >
                    <div className="flex items-center justify-center">
                      <CountryFlag country={countryName} className="h-7 w-10 border-white/30" />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {[...Array(ROWS)].map((_, row) => (
              <tr key={row}>
                {[...Array(COLS)].map((_, col) => {
                  const position = row * COLS + col + positionOffset;
                  return renderCell(position, row, col);
                })}
              </tr>
            ))}
          </tbody>
          </table>
        </div>
        <div
          className={`pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-stone-100 to-transparent transition-opacity duration-200 md:hidden ${
            showEndFade ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

export default PositionGrid;
