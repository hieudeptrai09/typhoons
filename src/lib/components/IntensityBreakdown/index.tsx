import ComparisonBarList, { type ComparisonBarRow } from "@/lib/components/ComparisonBarList";
import { INTENSITY_LABEL } from "@/lib/constants";
import type { Storm } from "@/lib/types";
import { BACKGROUND_BADGE, TEXT_COLOR_WHITE_BACKGROUND } from "@/lib/utils/colors";
import { getIntensityGroups } from "@/lib/utils/storms";
import type { ReactNode } from "react";

interface IntensityBreakdownProps {
  storms: Storm[];
  heading?: ReactNode;
  emptyText?: ReactNode;
}

const IntensityBreakdown = ({
  storms,
  heading = "Storms by intensity:",
  emptyText = "No storms to show.",
}: IntensityBreakdownProps) => {
  const rows: ComparisonBarRow[] = getIntensityGroups(storms).map((group) => ({
    key: group.intensity,
    label: INTENSITY_LABEL[group.intensity],
    labelColor: TEXT_COLOR_WHITE_BACKGROUND[group.intensity],
    color: BACKGROUND_BADGE[group.intensity],
    count: group.storms.length,
    details: (
      <div className="flex flex-col gap-1.5">
        {group.storms.map((storm) => (
          <div key={`${storm.name}-${storm.year}`} className="text-sm text-foreground">
            <span
              className="font-semibold"
              style={{ color: TEXT_COLOR_WHITE_BACKGROUND[group.intensity] }}
            >
              {storm.name}
            </span>{" "}
            {storm.year}
          </div>
        ))}
      </div>
    ),
  }));

  return <ComparisonBarList heading={heading} emptyText={emptyText} rows={rows} />;
};

export default IntensityBreakdown;
