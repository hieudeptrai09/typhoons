import { TEXT_COLOR_WHITE_BACKGROUND } from "../../../../constants";
import { getIntensityFromNumber } from "../_utils/fns";

interface SpecialButtonsProps {
  onCellClick: (data: number, key: string) => void;
  isAverageView?: boolean;
  averageValues?: Record<number, number> | null;
}

const SpecialButtons = ({
  onCellClick,
  isAverageView = false,
  averageValues = null,
}: SpecialButtonsProps) => {
  const buttons = [
    { id: 141, label: "CPHC" },
    { id: 142, label: "NHC" },
    { id: 143, label: "IMD" },
  ];

  const getButtonStyle = (buttonId: number): string => {
    if (isAverageView && averageValues && averageValues[buttonId]) {
      const avgNumber = averageValues[buttonId];
      const intensityLabel = getIntensityFromNumber(avgNumber);
      const textColor = TEXT_COLOR_WHITE_BACKGROUND[intensityLabel];
      return textColor;
    }
    return "#6A6E7D";
  };

  return (
    <div className="mb-6 flex justify-center gap-4">
      <div className="mr-2 self-center text-sm font-semibold text-gray-600">Other Regions:</div>
      {buttons.map((button) => (
        <button
          key={button.id}
          onClick={() => onCellClick(button.id, "position")}
          className="rounded-lg border border-stone-300 bg-stone-100 px-6 py-3 font-semibold shadow-sm transition-colors hover:bg-stone-200"
          style={{ color: getButtonStyle(button.id) }}
        >
          {button.label}
        </button>
      ))}
    </div>
  );
};

export default SpecialButtons;
