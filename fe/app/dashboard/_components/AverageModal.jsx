import { Modal } from "../../../components/Modal";

export const AverageModal = ({
  isOpen,
  onClose,
  position,
  average,
  storms,
}) => {
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`#${position}`}
      wrapperClassName="max-w-md"
    >
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
    </Modal>
  );
};
