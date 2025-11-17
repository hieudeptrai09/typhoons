import { getIntensityFromNumber } from "../utils/fns";
import {
  getWhiteTextcolor,
  getRank,
} from "../../../containers/utils/intensity";

const calculateAverage = (storms) => {
  const sum = storms.reduce((acc, s) => acc + getRank(s.intensity), 0);
  return sum / storms.length;
};

export const SpecialButtons = ({
  onCellClick,
  isAverageView = false,
  averageByPosition = null,
}) => {
  const buttons = [
    { id: 141, label: "CPHC" },
    { id: 142, label: "NHC" },
  ];

  const getButtonStyle = (buttonId) => {
    if (isAverageView && averageByPosition && averageByPosition[buttonId]) {
      const avgNumber = calculateAverage(averageByPosition[buttonId]);
      const intensityLabel = getIntensityFromNumber(avgNumber);
      const textColor = getWhiteTextcolor(intensityLabel);
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
