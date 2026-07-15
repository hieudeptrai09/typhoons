import DefModal from "@/lib/components/DefModal";
import { INTENSITY_LABEL, SORTING_RANK } from "@/lib/constants";
import type { BaseModalProps, IntensityType, Storm } from "@/lib/types";
import { BACKGROUND_BADGE, TEXT_COLOR_WHITE_BACKGROUND } from "@/lib/utils/colors";
import { Popover } from "antd";
import { getGroupedStorms, getIntensityFromNumber } from "../../_utils/fns";

export type AverageModalCriteria = "position" | "country" | "year" | "month" | "name";

interface AverageModalProps extends BaseModalProps {
  title: string;
  average: number;
  storms: Storm[];
  criteria: AverageModalCriteria;
}

interface IntensityGroupData {
  intensity: IntensityType;
  count: number;
  storms: Storm[];
}

const POSITION_AGENCIES = new Set(["CPHC", "NHC", "IMD"]);

const CRITERIA_TEXT: Record<
  AverageModalCriteria,
  { heading: (title: string) => string; empty: (title: string) => string }
> = {
  position: {
    heading: (title) =>
      POSITION_AGENCIES.has(title)
        ? `Storms which are named by ${title}, by intensity:`
        : `Storms in position ${title} by intensity:`,
    empty: (title) =>
      POSITION_AGENCIES.has(title)
        ? `No storms named by ${title}.`
        : `No storms in position ${title}.`,
  },
  country: {
    heading: (title) => `Storms whose names were contributed by ${title}, by intensity:`,
    empty: (title) => `No storms whose names were contributed by ${title}.`,
  },
  year: {
    heading: (title) => `Storms in ${title} by intensity:`,
    empty: (title) => `No storms in ${title}.`,
  },
  month: {
    heading: (title) => `Storms in ${title} by intensity:`,
    empty: (title) => `No storms in ${title}.`,
  },
  name: {
    heading: (title) => `Storms named ${title} by intensity:`,
    empty: (title) => `No storms named ${title}.`,
  },
};

// The position part is used to a part of modal @modal/(.)positions/[position], but the owner forced to divorce and go back to here.
const AverageModal = ({ isOpen, onClose, title, average, storms, criteria }: AverageModalProps) => {
  const { heading, empty } = CRITERIA_TEXT[criteria];
  const intensityGroups = getGroupedStorms(storms, "intensity");
  const intensityData: IntensityGroupData[] = Object.entries(intensityGroups)
    .map(([intensity, groupStorms]) => ({
      intensity: intensity as IntensityType,
      count: groupStorms.length,
      storms: [...groupStorms].sort((a, b) => a.year - b.year),
    }))
    .sort((a, b) => SORTING_RANK[b.intensity] - SORTING_RANK[a.intensity]);

  return (
    <DefModal
      open={isOpen}
      onClose={onClose}
      width={448}
      title={<span className="text-2xl font-bold text-foreground">{title}</span>}
    >
      <div className="pt-3">
        <div className="space-y-3">
          <div>
            <span id="avg-intensity-label" className="text-foreground">
              Overall Average Intensity:{" "}
            </span>
            <span
              className="text-lg font-bold"
              aria-describedby="avg-intensity-label"
              style={{ color: TEXT_COLOR_WHITE_BACKGROUND[getIntensityFromNumber(average)] }}
            >
              {average.toFixed(2)}
            </span>
          </div>
          <div>
            <div className="mb-2 text-foreground">{heading(title)}</div>
            {intensityData.length === 0 && (
              <div className="text-sm text-foreground">{empty(title)}</div>
            )}
            <div className="space-y-2">
              {intensityData.map((data, idx) => {
                const bgColor = BACKGROUND_BADGE[data.intensity];
                const textColor = TEXT_COLOR_WHITE_BACKGROUND[data.intensity];

                return (
                  <Popover
                    key={data.intensity}
                    styles={{ container: { backgroundColor: "#f3f4f6" } }}
                    content={
                      <div className="flex flex-col gap-1.5">
                        {data.storms.map((storm) => (
                          <div
                            key={`${storm.name}-${storm.year}`}
                            className="text-sm text-foreground"
                          >
                            <span className="font-semibold" style={{ color: textColor }}>
                              {storm.name}
                            </span>{" "}
                            {storm.year}
                          </div>
                        ))}
                      </div>
                    }
                    trigger={["hover", "click"]}
                    placement="bottom"
                  >
                    <div
                      className="flex cursor-pointer items-center justify-between rounded-md bg-white px-3 py-2 transition-colors hover:bg-gray-200"
                      style={{ borderLeft: `4px solid ${bgColor}` }}
                    >
                      <span
                        className="font-semibold"
                        style={{ color: textColor }}
                        aria-describedby={`avg-stats-${idx}`}
                      >
                        {INTENSITY_LABEL[data.intensity]}
                      </span>
                      <div id={`avg-stats-${idx}`} className="text-sm text-foreground">
                        <span>
                          Count: <span className="font-semibold text-foreground">{data.count}</span>
                        </span>
                      </div>
                    </div>
                  </Popover>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </DefModal>
  );
};

export default AverageModal;
