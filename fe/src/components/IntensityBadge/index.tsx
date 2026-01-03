import { BACKGROUND_BADGE, TEXT_COLOR_BADGE } from "../../constants";
import type { IntensityType } from "../../types";

interface IntensityBadgeProps {
  intensity: IntensityType;
}

const IntensityBadge = ({ intensity }: IntensityBadgeProps) => {
  return (
    <span
      className="flex h-10 w-10 items-center justify-center font-semibold"
      style={{
        backgroundColor: BACKGROUND_BADGE[intensity],
        color: TEXT_COLOR_BADGE[intensity],
      }}
    >
      {intensity}
    </span>
  );
};

export default IntensityBadge;
