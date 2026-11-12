import type { Storm } from "@/lib/types";
import { getDistanceColor } from "@/lib/utils/colors";
import { durationFromDays, formatDayCount, formatDuration } from "@/lib/utils/date";
import { calculateGapAverage, calculateGapDaysAverage, formatDistance } from "@/lib/utils/storms";
import { useId } from "react";
import RecurrenceTimeline from "./RecurrenceTimeline";

/** Average gap between appearances, in years and in days, above the timeline. */
const AvgGapPanel = ({ storms }: { storms: Storm[] }) => {
  const labelId = useId();
  const daysLabelId = useId();
  const average = calculateGapAverage(storms);
  const averageDays = calculateGapDaysAverage(storms);
  const color = getDistanceColor(average);

  return (
    <div>
      <div className="mb-3">
        <div>
          <span id={labelId} className="text-foreground">
            Average Recurrence:{" "}
          </span>
          <span className="text-lg font-bold" aria-describedby={labelId} style={{ color }}>
            {formatDistance(average)}
          </span>
          {average >= 0 && <span className="text-foreground"> years</span>}
        </div>
        {averageDays >= 0 && (
          <div>
            <span id={daysLabelId} className="text-foreground">
              In days:{" "}
            </span>
            <span className="font-bold" aria-describedby={daysLabelId} style={{ color }}>
              {formatDayCount(averageDays)}
            </span>
            <span className="text-foreground">
              {" "}
              ≈ {formatDuration(durationFromDays(averageDays))}
            </span>
          </div>
        )}
      </div>

      <RecurrenceTimeline storms={storms} />
    </div>
  );
};

export default AvgGapPanel;
