import { Tag } from "antd";
import { BACKGROUND_BADGE, TEXT_COLOR_BADGE } from "../../colors";
import type { IntensityType } from "../../../types";

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
      className="!m-0 !h-10 !w-10 !rounded-none !border !p-0 !text-center !text-base !leading-10 !font-semibold"
    >
      {intensity}
    </Tag>
  );
};

export default IntensityBadge;
