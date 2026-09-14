import StartMonthBreakdown from "@/lib/components/StartMonthBreakdown";
import StatTile from "@/lib/components/StatTile";
import type { Storm } from "@/lib/types";
import { getAvgDateColor } from "@/lib/utils/colors";
import {
  calculateAvgDates,
  calculateAvgDuration,
  formatDayOfYear,
  formatDuration,
  getDoyMonth,
} from "@/lib/utils/stormDates";

/** Average start, end and duration, above the storms grouped by start month. */
const AvgDatesPanel = ({ storms }: { storms: Storm[] }) => {
  const { startDoy, endDoy } = calculateAvgDates(storms);
  const avgDuration = calculateAvgDuration(storms);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <StatTile label="Avg. Start" title="Average start date">
          <span style={{ color: getAvgDateColor(getDoyMonth(startDoy)) }}>
            {formatDayOfYear(startDoy)}
          </span>
        </StatTile>
        <StatTile label="Avg. End" title="Average end date">
          <span style={{ color: getAvgDateColor(getDoyMonth(endDoy)) }}>
            {formatDayOfYear(endDoy)}
          </span>
        </StatTile>
        <StatTile label="Avg. Duration" title="Average days from start to end">
          <span className="text-slate-700">{formatDuration(avgDuration)}</span>
        </StatTile>
      </div>

      <StartMonthBreakdown storms={storms} />
    </div>
  );
};

export default AvgDatesPanel;
