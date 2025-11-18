// AverageModal.jsx
import { Modal } from "../../../components/Modal";
import { useState, useRef, useEffect } from "react";
import {
  getBackground,
  getBadgeTextcolor,
  getWhiteTextcolor,
  intensityRank,
} from "../../../containers/utils/intensity";
import { getIntensityFromNumber, calculateAverage } from "../utils/fns";
import IntensityBadge from "../../../components/IntensityBadge";

export const AverageModal = ({ isOpen, onClose, title, average, storms }) => {
  const [selectedName, setSelectedName] = useState(null);
  const [popupStyle, setPopupStyle] = useState({});
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

  // Update popup position when selected name changes
  useEffect(() => {
    if (
      selectedName &&
      nameRefs.current[selectedName] &&
      containerRef.current
    ) {
      const nameElement = nameRefs.current[selectedName];
      const containerElement = containerRef.current;

      const nameRect = nameElement.getBoundingClientRect();
      const containerRect = containerElement.getBoundingClientRect();

      setPopupStyle({
        position: "absolute",
        top: `${nameRect.bottom - containerRect.top}px`,
        left: `${nameRect.left - containerRect.left}px`,
        width: `${nameRect.width}px`,
      });
    }
  }, [selectedName]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        selectedName &&
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        !nameRefs.current[selectedName]?.contains(event.target)
      ) {
        setSelectedName(null);
      }
    };

    if (selectedName) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedName]);

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

        {/* Popup rendered as sibling, positioned via refs */}
        {selectedName && selectedNameData && (
          <div
            ref={popupRef}
            className="bg-white border-2 border-purple-500 rounded-lg shadow-xl z-50 mt-1"
            style={{
              ...popupStyle,
              display: "flex",
              flexDirection: "column",
              maxHeight: "320px",
            }}
          >
            <div className="font-semibold text-purple-700 p-4 pb-2 border-b flex-shrink-0">
              All {selectedName} storms:
            </div>
            <div
              className="flex flex-col gap-1.5 p-4 pt-2 overflow-y-auto"
              style={{ flex: "1 1 auto" }}
            >
              {selectedNameData.storms
                .sort((a, b) => a.year - b.year)
                .map((storm, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <IntensityBadge intensity={storm.intensity} />
                    <span
                      className="text-sm"
                      style={{
                        color: getWhiteTextcolor(storm.intensity),
                      }}
                    >
                      {storm.year}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
