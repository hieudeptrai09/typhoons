import { TEXT_COLOR_WHITE_BACKGROUND } from "../../../../constants";
import { getIntensityFromNumber } from "../_utils/fns";

export const GridCell = ({
  onClick,
  content,
  highlight = "",
  isClickable = true,
  isAverageView = false,
  avgNumber = null,
  stormNames = [],
}) => {
  const getHighlightColor = () => {
    if (!highlight) return "";
    if (highlight === "strongest") return "bg-red-300";
    if (highlight === "first") return "bg-blue-300";
    if (highlight === "last") return "bg-orange-300";
    return "bg-green-300";
  };

  const handleClick = () => {
    if (isClickable) {
      onClick();
    }
  };

  const getTextColor = () => {
    if (isAverageView && avgNumber !== null) {
      const intensityLabel = getIntensityFromNumber(avgNumber);
      return TEXT_COLOR_WHITE_BACKGROUND[intensityLabel];
    }
    return "#6A6E7D";
  };

  return (
    <td
      className={`relative border-2 border-stone-200 p-2 ${
        isClickable ? "cursor-pointer hover:bg-stone-200" : "cursor-default"
      } ${getHighlightColor()}`}
      onClick={handleClick}
    >
      {stormNames.length > 0 && (
        <div className="text-stone-100 text-[7px] absolute top-0">
          {stormNames.join(", ")}
        </div>
      )}
      <div className="w-full h-16 flex items-center justify-center relative z-2">
        <div
          className="text-center text-base font-semibold"
          style={{ color: getTextColor() }}
        >
          {content}
        </div>
      </div>
    </td>
  );
};
