import { BACKGROUND_BADGE, TEXT_COLOR_BADGE } from "../../constants";

const IntensityBadge = ({ intensity }) => {
  return (
    <span
      className="font-semibold w-10 h-10 flex items-center justify-center"
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
