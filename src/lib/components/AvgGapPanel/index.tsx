import RecurrenceTimeline from "@/lib/components/RecurrenceTimeline";
import type { Storm } from "@/lib/types";
import { getDistanceColor } from "@/lib/utils/colors";
import { calculateGapAverage, formatDistance } from "@/lib/utils/storms";
import { useId } from "react";

/** Average years between appearances, above the year-by-year timeline. */
const AvgGapPanel = ({ storms }: { storms: Storm[] }) => {
  const labelId = useId();
  const average = calculateGapAverage(storms);

  return (
    <div>
      <div className="mb-3">
        <span id={labelId} className="text-foreground">
          Average Recurrence:{" "}
        </span>
        <span
          className="text-lg font-bold"
          aria-describedby={labelId}
          style={{ color: getDistanceColor(average) }}
        >
          {formatDistance(average)}
        </span>
        {average >= 0 && <span className="text-foreground"> years</span>}
      </div>

      <RecurrenceTimeline storms={storms} />
    </div>
  );
};

export default AvgGapPanel;
