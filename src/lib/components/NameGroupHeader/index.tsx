import { INTENSITY_LABEL } from "@/lib/constants";
import type { Storm } from "@/lib/types";
import {
  BACKGROUND_BADGE,
  getDistanceColor,
  TEXT_COLOR_WHITE_BACKGROUND,
} from "@/lib/utils/colors";
import {
  calculateAverage,
  calculateGapAverage,
  formatDistance,
  getIntensityFromNumber,
} from "@/lib/utils/storms";
import type { ReactNode } from "react";

interface NameGroupHeaderProps {
  label: ReactNode;
  storms: Storm[];
  showRecurrence?: boolean;
}

/** The bar above a group of storms (one name, one position): count, average intensity and recurrence. */
const NameGroupHeader = ({ label, storms, showRecurrence = true }: NameGroupHeaderProps) => {
  const average = calculateAverage(storms);
  const intensity = getIntensityFromNumber(average);
  const recurrence = calculateGapAverage(storms);

  return (
    <div
      className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-md bg-slate-50 py-2 pr-4 pl-3"
      style={{ borderLeft: `4px solid ${BACKGROUND_BADGE[intensity]}` }}
    >
      <span className="font-semibold text-foreground">{label}</span>
      <span className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-foreground">
        <span>
          Count: <span className="font-semibold text-foreground">{storms.length}</span>
        </span>
        <span title={INTENSITY_LABEL[intensity]}>
          Avg:{" "}
          <span className="font-bold" style={{ color: TEXT_COLOR_WHITE_BACKGROUND[intensity] }}>
            {average.toFixed(2)}
          </span>
        </span>
        {/* A lone storm leaves no gap to measure, so the stat is left off entirely. */}
        {showRecurrence && recurrence >= 0 && (
          <span>
            Every:{" "}
            <span className="font-bold" style={{ color: getDistanceColor(recurrence) }}>
              {formatDistance(recurrence)}
            </span>{" "}
            yrs
          </span>
        )}
      </span>
    </div>
  );
};

export default NameGroupHeader;
