export const getIntensityColor = (intensity) => {
  switch (intensity) {
    case "TD":
      return "#00CCFF";
    case "TS":
      return "#00FF00";
    case "STS":
      return "#C0FFC0";
    case "1":
      return "#FFFF00";
    case "2":
      return "#FFCC00";
    case "3":
      return "#FF6600";
    case "4":
      return "#FF0000";
    case "5":
      return "#CC00CC";
    default:
      return "#333333";
  }
};

export const getIntensityTextColor = (intensity) => {
  switch (intensity) {
    case "TD":
    case "3":
    case "4":
    case "5":
      return "white"; // White for dark backgrounds
    case "TS":
    case "STS":
    case "1":
    case "2":
      return "gray"; // Black for light backgrounds
    default:
      return "white";
  }
};

const IntensityBadge = ({ intensity }) => {
  return (
    <span
      className="font-semibold w-10 h-10 flex items-center justify-center mr-1.5"
      style={{
        backgroundColor: getIntensityColor(intensity),
        color: getIntensityTextColor(intensity),
      }}
    >
      {intensity}
    </span>
  );
};

export default IntensityBadge;
