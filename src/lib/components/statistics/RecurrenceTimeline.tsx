import type { Storm } from "@/lib/types";
import { getDistanceColor } from "@/lib/utils/colors";
import { formatStormDateRange } from "@/lib/utils/date";

const formatGapLabel = (gap: number): string => {
  if (gap === 0) return "same year";
  return gap === 1 ? "1 year" : `${gap} years`;
};

const RecurrenceTimeline = ({ storms }: { storms: Storm[] }) => {
  const timeline = [...storms].sort((a, b) => a.year - b.year);

  return (
    <div>
      <div className="mb-2 text-foreground">
        {timeline.length === 1
          ? "Only one storm, so no recurrence can be measured:"
          : "Storm timeline:"}
      </div>

      {timeline.length === 0 ? (
        <div className="text-sm text-foreground">No storms to show.</div>
      ) : (
        <ol>
          {timeline.map((storm, index) => {
            // The first storm has no earlier storm to measure against, which is
            // the same -1 "no gap" case the grid uses for a single storm.
            const gap = index > 0 ? storm.year - timeline[index - 1].year : -1;
            const color = getDistanceColor(gap);
            const dateRange = formatStormDateRange(storm.dateStart, storm.dateEnd);

            return (
              <li key={`${storm.name}-${storm.year}-${index}`}>
                {gap >= 0 && (
                  <div className="flex items-stretch gap-3">
                    <div className="flex w-2.5 shrink-0 justify-center">
                      <div className="w-0.5" style={{ backgroundColor: color }} />
                    </div>
                    <span className="py-1 text-xs font-semibold" style={{ color }}>
                      {formatGapLabel(gap)}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-3" style={{ color }}>
                  <span className="flex w-2.5 shrink-0 justify-center">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
                  </span>
                  <span className="font-semibold tabular-nums">{storm.year}</span>
                  <span className="font-semibold">{storm.name}</span>
                  <span className="text-xs">{dateRange}</span>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
};

export default RecurrenceTimeline;
