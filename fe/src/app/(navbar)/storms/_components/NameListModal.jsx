import { useState, useRef, useEffect } from "react";
import { Modal } from "../../../../components/Modal";
import {
  BACKGROUND_BADGE,
  TEXT_COLOR_BADGE,
  BACKGROUND_HOVER_BADGE,
  TEXT_COLOR_WHITE_BACKGROUND,
} from "../../../../constants";
import { getIntensityFromNumber } from "../_utils/fns";
import { StormMapPopup } from "./StormMapPopup";

const getIntensityLabel = (intensity) => {
  const labels = {
    5: "Category 5 Super Typhoon",
    4: "Category 4 Super Typhoon",
    3: "Category 3 Typhoon",
    2: "Category 2 Typhoon",
    1: "Category 1 Typhoon",
    STS: "Severe Tropical Storm",
    TS: "Tropical Storm",
    TD: "Tropical Depression",
  };
  return labels[intensity] || intensity;
};

export const NameListModal = ({ isOpen, onClose, name, storms, avgIntensity = 0 }) => {
  const [showMap, setShowMap] = useState(false);
  const [hoveredYear, sethoveredYear] = useState(null);
  const [selectedStorm, setSelectedStorm] = useState(null);
  const stormRefs = useRef({});
  const popupRef = useRef(null);

  // Calculate title color based on average intensity
  const intensityLabel = getIntensityFromNumber(avgIntensity);
  const titleColor = TEXT_COLOR_WHITE_BACKGROUND[intensityLabel];

  // Close popup when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedStorm(null);
    }
  }, [isOpen]);

  if (!storms || storms.length === 0) return null;

  const handleBadgeClick = (index) => {
    if (selectedStorm === index) {
      setSelectedStorm(null);
    } else {
      setSelectedStorm(index);
    }
  };

  const selectedStormData = selectedStorm !== null ? storms[selectedStorm] : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={name}
      wrapperClassName="max-w-lg"
      titleClassName="!text-3xl"
      titleStyle={{ color: titleColor }}
    >
      <div className="space-y-4">
        {/* Storm Information and Toggle - all in one line */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <div className="flex flex-col gap-1">
            <div>
              <span className="font-semibold text-gray-700">Country:</span>
              <span className="ml-2 text-gray-600">{storms[0].country}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Position:</span>
              <span className="ml-2 text-gray-600">{storms[0].position}</span>
            </div>
            {storms[0].correctSpelling && (
              <div>
                <span className="font-semibold text-gray-700">Correct spelling:</span>
                <span className="ml-2 text-gray-600">{storms[0].correctSpelling}</span>
              </div>
            )}
          </div>
          <div className="flex flex-col items-end md:flex-row md:gap-1">
            <label className="text-sm font-semibold text-gray-700">Show Map</label>
            <button
              onClick={() => setShowMap(!showMap)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                showMap ? "bg-blue-600" : "bg-gray-400"
              }`}
              role="switch"
              aria-checked={showMap}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  showMap ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Storms List */}
        <div>
          <h3 className="mb-3 font-semibold text-gray-700">
            All {name} Storms ({storms.length})
          </h3>
          <div className="space-y-2">
            {storms.map((storm, idx) => {
              const bgColor = BACKGROUND_BADGE[storm.intensity];
              const textColor = TEXT_COLOR_BADGE[storm.intensity];
              const hoverColor = BACKGROUND_HOVER_BADGE[storm.intensity];
              const isHovered = hoveredYear === storm.year;
              const hasMap = storm.map && storm.map.trim() !== "";
              const intensityLabel = getIntensityLabel(storm.intensity);
              const stormTitle = `${intensityLabel} ${storm.name} ${storm.year}`;

              return (
                <div
                  key={idx}
                  ref={(el) => (stormRefs.current[idx] = el)}
                  className="flex cursor-pointer items-center gap-4 rounded-lg p-2 transition-opacity"
                  style={{ backgroundColor: isHovered ? hoverColor : bgColor }}
                  onMouseEnter={() => sethoveredYear(storm.year)}
                  onMouseLeave={() => sethoveredYear(null)}
                  onClick={() => handleBadgeClick(idx)}
                >
                  <div className="flex-1">
                    <div className="text-sm font-bold" style={{ color: textColor }}>
                      {stormTitle}
                    </div>
                  </div>
                  {showMap && hasMap && (
                    <div className="shrink-0">
                      <img
                        src={storm.map}
                        alt={`${storm.name} ${storm.year} track`}
                        className="h-32 w-48 rounded border-2 border-white/30 object-cover"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <StormMapPopup
          popupRef={popupRef}
          selectedStorm={selectedStormData}
          stormElementRef={stormRefs.current[selectedStorm]}
          onClose={() => setSelectedStorm(null)}
        />
      </div>
    </Modal>
  );
};
