import { X } from "lucide-react";

const getIntensityColor = (intensity) => {
  const colors = {
    TD: "#00CCFF",
    TS: "#00FF00",
    STS: "#C0FFC0",
    1: "#FFFF00",
    2: "#FFCC00",
    3: "#FF6600",
    4: "#FF0000",
    5: "#CC00CC",
  };
  return colors[intensity] || "#333333";
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
            <div key={index} className="flex">
              <span
                className="text-white font-semibold w-7 h-7 flex items-center justify-center mr-1.5"
                style={{ backgroundColor: getIntensityColor(storm.intensity) }}
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
