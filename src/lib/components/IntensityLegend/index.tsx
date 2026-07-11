import { INTENSITY_LABEL, INTENSITY_RANK, SORTING_RANK } from "@/lib/constants";
import type { IntensityType } from "@/lib/types";
import { BACKGROUND_BADGE, TEXT_COLOR_BADGE } from "@/lib/utils/colors";

export default function IntensityLegend() {
  return (
    <section className="mt-6 border-t border-slate-200 pt-6" aria-label="Intensity scale legend">
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 sm:justify-start">
        <span className="text-xs font-semibold text-muted">Intensity Scale:</span>
        {(Object.keys(INTENSITY_LABEL) as IntensityType[])
          .sort((a, b) => SORTING_RANK[a] - SORTING_RANK[b])
          .map((intensity) => (
            <span key={intensity} className="flex items-center gap-1.5">
              <span
                className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-sm text-[10px] font-bold"
                style={{
                  backgroundColor: BACKGROUND_BADGE[intensity],
                  color: TEXT_COLOR_BADGE[intensity],
                }}
              >
                {intensity}
              </span>
              <span className="text-xs text-muted">
                {INTENSITY_LABEL[intensity]}{" "}
                <span className="text-muted">({INTENSITY_RANK[intensity]})</span>
              </span>
            </span>
          ))}
      </div>
    </section>
  );
}
