import { AVG_DATE_MONTH_COLOR } from "@/lib/utils/colors";

const MONTH_LABELS: Record<number, string> = {
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
};

const AVG_DATE_LEGEND = Object.entries(AVG_DATE_MONTH_COLOR).map(([month, color]) => ({
  color,
  label: MONTH_LABELS[Number(month)],
}));

export default function AvgDateLegend() {
  return (
    <section className="mt-6 border-t border-slate-200 pt-6" aria-label="Average date month legend">
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 sm:justify-start">
        <span className="text-xs font-semibold text-foreground">Average month:</span>
        {AVG_DATE_LEGEND.map(({ color, label }) => (
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
