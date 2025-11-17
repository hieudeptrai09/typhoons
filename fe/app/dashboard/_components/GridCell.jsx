import { getWhiteTextcolor } from "../../../containers/utils/intensity";
import { getIntensityFromNumber } from "../utils/fns";

export const GridCell = ({
  onClick,
  content,
  highlight = "",
  isClickable = true,
  isAverageView = false,
  avgNumber = null,
}) => {
  const getHighlightColor = () => {
    if (!highlight) return "";
    if (highlight === "strongest") return "bg-red-300";
    if (highlight === "first") return "bg-blue-300";
    return "bg-sky-200";
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
    return "#6A6E7D";
  };

  return (
    <td
      className={`relative border-2 border-sky-200 p-2 ${
        isClickable ? "cursor-pointer hover:bg-sky-200" : "cursor-default"
      } ${getHighlightColor()}`}
      onClick={handleClick}
    >
      <div className="w-full h-16 flex items-center justify-center">
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
