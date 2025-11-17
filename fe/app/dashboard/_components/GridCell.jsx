import { getWhiteTextcolor } from "../../../containers/utils/intensity";
import { getIntensityFromNumber } from "../utils/fns";

export const GridCell = ({
  onClick,
  content,
  highlighted,
  highlightType,
  isClickable = true,
  isAverageView = false,
  avgNumber = null,
}) => {
  const getHighlightColor = () => {
    if (!highlighted) return "";
    if (highlightType === "strongest") return "bg-red-300";
    if (highlightType === "first") return "bg-blue-300";
    return "bg-yellow-200";
  };

  const handleClick = () => {
    if (isClickable) {
      onClick();
    }
  };

  const getTextColor = () => {
    if (isAverageView && avgNumber !== null) {
      const intensityLabel = getIntensityFromNumber(avgNumber);
      return getWhiteTextcolor(intensityLabel);
    }
    return "";
  };

  return (
    <td
      className={`relative w-24 h-24 border-2 border-sky-200 p-2 ${
        isClickable ? "cursor-pointer hover:bg-sky-200" : "cursor-default"
      } ${getHighlightColor()}`}
      onClick={handleClick}
    >
      <div className="w-full h-full flex items-center justify-center">
        <div
          className="text-center text-xs font-semibold"
          style={{ color: isAverageView ? getTextColor() : "#6A6E7D" }}
        >
          {content}
        </div>
      </div>
    </td>
  );
};
