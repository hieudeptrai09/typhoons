import AverageFormulaPopover from "@/lib/components/AverageFormulaPopover";
import IntensityBreakdown from "@/lib/components/IntensityBreakdown";
import type { Storm } from "@/lib/types";
import { TEXT_COLOR_WHITE_BACKGROUND } from "@/lib/utils/colors";
import { calculateAverage, getIntensityFromNumber } from "@/lib/utils/storms";
import { useId, type ReactNode } from "react";

interface AvgIntensityPanelProps {
  storms: Storm[];
  heading?: ReactNode;
  emptyText?: ReactNode;
}

/** Overall average intensity with its formula, above the storms grouped by intensity. */
const AvgIntensityPanel = ({ storms, heading, emptyText }: AvgIntensityPanelProps) => {
  const labelId = useId();
  const average = storms.length > 0 ? calculateAverage(storms) : 0;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <span id={labelId} className="text-foreground">
          Overall Average Intensity:
        </span>
        <span
          className="text-lg font-bold tabular-nums"
          aria-describedby={labelId}
          style={{ color: TEXT_COLOR_WHITE_BACKGROUND[getIntensityFromNumber(average)] }}
        >
          {average.toFixed(2)}
        </span>
        <span className="text-sm text-gray-500">on a −2 to 5 scale</span>
        <AverageFormulaPopover storms={storms} />
      </div>
      <IntensityBreakdown storms={storms} heading={heading} emptyText={emptyText} />
    </div>
  );
};

export default AvgIntensityPanel;
