import { Tag } from "antd";
import type { IntensityType } from "@/common/types";
import { BACKGROUND_BADGE, TEXT_COLOR_BADGE } from "@/common/utils/colors";

interface IntensityBadgeProps {
  intensity: IntensityType;
}

const IntensityBadge = ({ intensity }: IntensityBadgeProps) => {
  return (
    <Tag
      style={{
        backgroundColor: BACKGROUND_BADGE[intensity],
        color: TEXT_COLOR_BADGE[intensity],
        borderColor: BACKGROUND_BADGE[intensity],
      }}
      aria-label={`Intensity ${intensity}`}
      className="!m-0 !h-10 !w-10 !rounded-none !border !p-0 !text-center !text-base !leading-10 !font-semibold"
    >
      {intensity}
    </Tag>
  );
};

export default IntensityBadge;
