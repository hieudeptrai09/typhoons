import { Modal } from "../../../../components/Modal";
import { useState, useRef, useEffect } from "react";
import {
  getBackground,
  getBadgeTextcolor,
  getWhiteTextcolor,
  intensityRank,
} from "../../../../containers/utils/intensity";
import { getIntensityFromNumber, calculateAverage } from "../_utils/fns";
import { StormNamePopup } from "./StormNamePopup";

export const AverageModal = ({ isOpen, onClose, title, average, storms }) => {
  const [selectedName, setSelectedName] = useState(null);
  const nameRefs = useRef({});
  const popupRef = useRef(null);
  const containerRef = useRef(null);

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
    return { name, average: avg, count: nameStorms.length, storms: nameStorms };
  });

  // Close popup when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedName(null);
    }
  }, [isOpen]);

  const handleNameClick = (name) => {
    if (selectedName === name) {
      setSelectedName(null);
    } else {
      setSelectedName(name);
    }
  };

  const selectedNameData = nameData.find((d) => d.name === selectedName);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      wrapperClassName="max-w-md"
    >
      <div className="space-y-3" ref={containerRef}>
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
          <div className="space-y-2 relative">
            {nameData.map((data, idx) => {
              const intensityLabel = getIntensityFromNumber(data.average);
              const bgColor = getBackground(intensityLabel);
              const textColor = getBadgeTextcolor(intensityLabel);

              return (
                <div
                  key={idx}
                  ref={(el) => (nameRefs.current[data.name] = el)}
                  onClick={() => handleNameClick(data.name)}
                  className="flex justify-between items-center px-3 py-2 rounded border cursor-pointer hover:opacity-80 transition-opacity"
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

        <StormNamePopup
          popupRef={popupRef}
          selectedName={selectedName}
          selectedNameData={selectedNameData}
          nameElement={nameRefs.current[selectedName]}
          onClose={() => setSelectedName(null)}
        />
      </div>
    </Modal>
  );
};
