import { X } from "lucide-react";
import { getIntensityColor } from "../../../components/IntensityBadge";
import IntensityBadge from "../../../components/IntensityBadge";

const TyphoonModal = ({ selectedCell, history, onClose }) => {
  if (!selectedCell) return null;

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
              <IntensityBadge intensity={storm.intensity} />
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
