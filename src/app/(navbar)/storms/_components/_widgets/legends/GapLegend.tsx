import {
  DISTANCE_LONG_COLOR,
  DISTANCE_NA_COLOR,
  DISTANCE_SHORT_COLOR,
  DISTANCE_STANDARD_COLOR,
} from "@/lib/utils/colors";

const GAP_LEGEND: { color: string; label: string }[] = [
  { color: DISTANCE_SHORT_COLOR, label: "Under 6 years" },
  { color: DISTANCE_STANDARD_COLOR, label: "Exactly 6 years" },
  { color: DISTANCE_LONG_COLOR, label: "Over 6 years" },
  { color: DISTANCE_NA_COLOR, label: "N/A (single storm)" },
];

export default function GapLegend() {
  return (
    <section className="mt-6 border-t border-slate-200 pt-6" aria-label="Average gap legend">
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 sm:justify-start">
        <span className="text-xs font-semibold text-foreground">Average Gap:</span>
        {GAP_LEGEND.map(({ color, label }) => (
          <span key={label} className="flex items-center gap-1.5">
            <span
              className="inline-block h-3 w-3 shrink-0 rounded-sm"
              style={{ backgroundColor: color }}
              aria-hidden="true"
            />
            <span className="text-xs text-foreground">{label}</span>
          </span>
        ))}
      </div>
    </section>
  );
}
