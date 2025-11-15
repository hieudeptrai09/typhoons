import {
  getBackground,
  getBadgeTextcolor,
} from "../../containers/utils/intensity";

const IntensityBadge = ({ intensity }) => {
  return (
    <span
      className="font-semibold w-10 h-10 flex items-center justify-center"
      style={{
        backgroundColor: getBackground(intensity),
        color: getBadgeTextcolor(intensity),
      }}
    >
      {intensity}
    </span>
  );
};

export default IntensityBadge;
