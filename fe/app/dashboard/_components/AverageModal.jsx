import { Modal } from "../../../components/Modal";
import {
  getBackground,
  getBadgeTextcolor,
  getWhiteTextcolor,
  intensityRank,
} from "../../../containers/utils/intensity";
import { getIntensityFromNumber, calculateAverage } from "../utils/fns";

export const AverageModal = ({ isOpen, onClose, title, average, storms }) => {
  // Group storms by name and calculate average intensity for each name
  const nameAverages = {};
  storms.forEach((storm) => {
    if (!nameAverages[storm.name]) {
      nameAverages[storm.name] = [];
    }
    nameAverages[storm.name].push(storm);
  });

  const nameData = Object.entries(nameAverages).map(([name, nameStorms]) => {
    const avg = calculateAverage(nameStorms);
    return { name, average: avg, count: nameStorms.length };
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      wrapperClassName="max-w-md"
    >
      <div className="space-y-3">
        <div className="text-lg" title={JSON.stringify(intensityRank)}>
          <span className="font-semibold text-purple-700">
            Overall Average Intensity:{" "}
          </span>
          <span
            className="font-bold"
            style={{
              color: getWhiteTextcolor(getIntensityFromNumber(average)),
            }}
          >
            {average.toFixed(2)}
          </span>
        </div>
        <div>
          <div className="font-semibold mb-2 text-purple-700">
            Storm names at this position:
          </div>
          <div className="space-y-2">
            {nameData.map((data, idx) => {
              const intensityLabel = getIntensityFromNumber(data.average);
              const bgColor = getBackground(intensityLabel);
              const textColor = getBadgeTextcolor(intensityLabel);

              return (
                <div
                  key={idx}
                  className="flex justify-between items-center px-3 py-2 rounded border"
                  style={{ backgroundColor: bgColor, borderColor: bgColor }}
                >
                  <span className="font-semibold" style={{ color: textColor }}>
                    {data.name}
                  </span>
                  <div className="flex gap-3 text-sm">
                    <span style={{ color: textColor }}>
                      Count: <span className="font-semibold">{data.count}</span>
                    </span>
                    <span style={{ color: textColor }}>
                      Avg:{" "}
                      <span className="font-semibold">
                        {data.average.toFixed(2)}
                      </span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
};
