import ComparisonBarList, { type ComparisonBarRow } from "@/lib/components/ComparisonBarList";
import { MONTH_NAMES } from "@/lib/constants";
import type { Storm } from "@/lib/types";
import { getAvgDateColor } from "@/lib/utils/colors";
import { formatStormDateRange, parseStormDate } from "@/lib/utils/date";

interface MonthGroup {
  month: number;
  label: string;
  storms: Storm[];
}

const groupByStartMonth = (storms: Storm[]): MonthGroup[] => {
  const buckets = new Map<number, Storm[]>();
  storms.forEach((storm) => {
    const { month } = parseStormDate(storm.dateStart);
    if (!buckets.has(month)) buckets.set(month, []);
    buckets.get(month)!.push(storm);
  });

  return [...buckets.entries()]
    .map(([month, groupStorms]) => ({
      month,
      label: MONTH_NAMES[month],
      storms: [...groupStorms].sort((a, b) => a.year - b.year),
    }))
    .sort((a, b) => a.month - b.month);
};

const StartMonthBreakdown = ({ storms }: { storms: Storm[] }) => {
  const rows: ComparisonBarRow[] = groupByStartMonth(storms).map((group) => ({
    key: group.label,
    label: group.label,
    color: getAvgDateColor(group.month),
    count: group.storms.length,
    details: (
      <div className="flex flex-col gap-1.5">
        {group.storms.map((storm) => (
          <div key={`${storm.name}-${storm.year}`} className="text-sm text-foreground">
            <span className="font-semibold text-sky-800">{storm.name}</span> {storm.year}
            <span className="text-xs text-gray-500">
              {" · "}
              {formatStormDateRange(storm.dateStart, storm.dateEnd)}
            </span>
          </div>
        ))}
      </div>
    ),
  }));

  return (
    <ComparisonBarList
      heading="Storms by start month:"
      emptyText="No storms to show."
      rows={rows}
    />
  );
};

export default StartMonthBreakdown;
