import { getDistanceColor, TEXT_COLOR_WHITE_BACKGROUND } from "@/lib/utils/colors";
import { Button } from "antd";
import { getIntensityFromNumber, SPECIAL_POSITIONS } from "../../_utils/fns";

interface SpecialButtonsProps {
  onCellClick: (data: number, key: string) => void;
  isAverageView?: boolean;
  averageValues?: Record<number, number> | null;
  distanceValues?: Record<number, number> | null;
}

const SpecialButtons = ({
  onCellClick,
  isAverageView = false,
  averageValues = null,
  distanceValues = null,
}: SpecialButtonsProps) => {
  const getButtonContent = (buttonId: number): { color: string; suffix: string } => {
    if (distanceValues && distanceValues[buttonId] !== undefined) {
      const dist = distanceValues[buttonId];
      return {
        color: getDistanceColor(dist),
        suffix: dist < 0 ? "" : ` · ${dist.toFixed(2)}y`,
      };
    }
    if (isAverageView && averageValues && averageValues[buttonId]) {
      const avgNumber = averageValues[buttonId];
      const intensityLabel = getIntensityFromNumber(avgNumber);
      return {
        color: TEXT_COLOR_WHITE_BACKGROUND[intensityLabel],
        suffix: "",
      };
    }
    return { color: "#374151", suffix: "" };
  };

  return (
    <div className="mb-6 flex justify-center gap-4">
      <div className="mr-2 self-center text-sm font-semibold text-foreground">Other Regions:</div>
      {SPECIAL_POSITIONS.map((button) => {
        const { color, suffix } = getButtonContent(button.id);
        return (
          <Button
            key={button.id}
            onClick={() => onCellClick(button.id, "position")}
            aria-label={`View storms from ${button.label} region`}
            style={{ color }}
            className="!font-semibold"
          >
            {button.label}
            {suffix}
          </Button>
        );
      })}
    </div>
  );
};

export default SpecialButtons;
