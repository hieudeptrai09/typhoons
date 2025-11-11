import { X } from "lucide-react";

export const AverageModal = ({
  isOpen,
  onClose,
  position,
  average,
  storms,
}) => {
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
          <h2 className="text-2xl font-bold text-gray-800">
            Position #{position}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <div className="space-y-3">
          <div className="text-lg">
            <span className="font-semibold">Average Intensity: </span>
            <span className="text-blue-600">{average.toFixed(2)}</span>
          </div>
          <div>
            <div className="font-semibold mb-2">Storms at this position:</div>
            <div className="text-sm text-gray-600 space-y-1">
              {storms.map((storm, idx) => (
                <div key={idx}>
                  {storm.name} ({storm.year}) - {storm.intensity}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
