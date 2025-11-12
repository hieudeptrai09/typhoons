import { X } from "lucide-react";

export const AverageModal = ({
  isOpen,
  onClose,
  position,
  average,
  storms,
}) => {
  if (!isOpen) return null;

  // Group storms by name and calculate average intensity for each name
  const nameAverages = {};
  storms.forEach((storm) => {
    if (!nameAverages[storm.name]) {
      nameAverages[storm.name] = [];
    }
    nameAverages[storm.name].push(storm);
  });

  const intensityRank = {
    5: 5,
    4: 4,
    3: 3,
    2: 2,
    1: 1,
    STS: 0.5,
    TS: 0.3,
    TD: 0.1,
  };

  const nameData = Object.entries(nameAverages).map(([name, nameStorms]) => {
    const avg =
      nameStorms.reduce(
        (sum, s) => sum + (intensityRank[s.intensity] || 0),
        0
      ) / nameStorms.length;
    return { name, average: avg, count: nameStorms.length };
  });

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
            <span className="font-semibold">Overall Average Intensity: </span>
            <span className="text-blue-600">{average.toFixed(2)}</span>
          </div>
          <div>
            <div className="font-semibold mb-2">
              Storm names at this position:
            </div>
            <div className="space-y-2">
              {nameData.map((data, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded"
                >
                  <span className="font-medium text-gray-700">{data.name}</span>
                  <div className="flex gap-3 text-sm">
                    <span className="text-gray-600">Count: {data.count}</span>
                    <span className="text-blue-600 font-semibold">
                      Avg: {data.average.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
