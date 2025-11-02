import { X } from "lucide-react";

const TyphoonModal = ({ selectedCell, history, onClose }) => {
  if (!selectedCell) return null;

  const getIntensityColor = (intensity) => {
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

  const getIntensityTextColor = (intensity) => {
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
          <h2 className="text-2xl font-bold text-gray-800">#{selectedCell}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <div className="flex gap-1.5 flex-col">
          {history.map((storm, index) => (
            <div key={index} className="flex items-center">
              <span
                className="font-semibold w-10 h-10 flex items-center justify-center mr-1.5"
                style={{
                  backgroundColor: getIntensityColor(storm.intensity),
                  color: getIntensityTextColor(storm.intensity),
                }}
              >
                {storm.intensity}
              </span>
              <span
                style={{
                  color:
                    storm.intensity === "1" || storm.intensity === "STS"
                      ? "gray"
                      : getIntensityColor(storm.intensity),
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

export default TyphoonModal;
