import { getIntensityFromNumber } from "../_utils/fns";
import { TEXT_COLOR_WHITE_BACKGROUND } from "../../../../constants";

export const SpecialButtons = ({
  onCellClick,
  isAverageView = false,
  averageValues = null,
}) => {
  const buttons = [
    { id: 141, label: "CPHC" },
    { id: 142, label: "NHC" },
    { id: 143, label: "IMD" },
  ];

  const getButtonStyle = (buttonId) => {
    if (isAverageView && averageValues && averageValues[buttonId]) {
      const avgNumber = averageValues[buttonId];
      const intensityLabel = getIntensityFromNumber(avgNumber);
      const textColor = TEXT_COLOR_WHITE_BACKGROUND[intensityLabel];
      return textColor;
    }
    return "#6A6E7D";
  };

  return (
    <div className="mt-6 flex justify-center gap-4">
      {buttons.map((button) => (
        <button
          key={button.id}
          onClick={() => onCellClick(button.id, "position")}
          className="px-8 py-4 bg-sky-100 font-semibold rounded-lg hover:bg-sky-200 transition-colors border border-sky-300"
          style={{ color: getButtonStyle(button.id) }}
        >
          {button.label}
        </button>
      ))}
    </div>
  );
};
