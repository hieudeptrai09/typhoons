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
            <div key={index} className="flex">
              <span
                className="text-white font-semibold w-7 h-7 flex items-center justify-center mr-1.5"
                style={{
                  backgroundColor: getIntensityColor(storm.intensity),
                }}
              >
                {storm.intensity}
              </span>
              <span style={{ color: getIntensityColor(storm.intensity) }}>
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
