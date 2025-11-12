import { X } from "lucide-react";
import IntensityBadge from "../../../components/IntensityBadge";

const getIntensityTextColorForWhiteBg = (intensity) => {
  switch (intensity) {
    case "TD":
      return "#0099CC"; // Darker cyan
    case "TS":
      return "#00AA00"; // Darker green
    case "STS":
      return "#009900"; // Dark green (was very light)
    case "1":
      return "#CC9900"; // Dark yellow/gold
    case "2":
      return "#CC8800"; // Darker orange
    case "3":
      return "#CC4400"; // Darker orange-red
    case "4":
      return "#CC0000"; // Darker red
    case "5":
      return "#990099"; // Darker magenta
    default:
      return "#333333";
  }
};

export const StormDetailModal = ({ isOpen, onClose, title, storms }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 shadow-2xl max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <div className="flex gap-1.5 flex-col max-h-96 overflow-y-auto">
          {storms.map((storm, index) => (
            <div key={index} className="flex items-center">
              <IntensityBadge intensity={storm.intensity} />
              <span
                style={{
                  color: getIntensityTextColorForWhiteBg(storm.intensity),
                }}
              >
                {`${storm.name} (${storm.year})`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
