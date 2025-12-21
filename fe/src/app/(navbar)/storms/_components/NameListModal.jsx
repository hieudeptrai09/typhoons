import { Modal } from "../../../../components/Modal";
import { useState } from "react";
import {
  BACKGROUND_BADGE,
  TEXT_COLOR_BADGE,
  BACKGROUND_HOVER_BADGE,
  TEXT_COLOR_WHITE_BACKGROUND,
} from "../../../../constants";
import { getIntensityFromNumber } from "../_utils/fns";

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

export const NameListModal = ({
  isOpen,
  onClose,
  name,
  storms,
  avgIntensity = 0,
}) => {
  const [showMap, setShowMap] = useState(false);
  const [hoveredName, setHoveredName] = useState(null);

  if (!storms || storms.length === 0) return null;

  // Calculate title color based on average intensity
  const intensityLabel = getIntensityFromNumber(avgIntensity);
  const titleColor = TEXT_COLOR_WHITE_BACKGROUND[intensityLabel];

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
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <div className="flex items-center gap-6">
            <div>
              <span className="font-semibold text-gray-700">Country:</span>
              <span className="text-gray-600 ml-2">{storms[0].country}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Position:</span>
              <span className="text-gray-600 ml-2">{storms[0].position}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm font-semibold text-gray-700">
              Show Map
            </label>
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
          <h3 className="font-semibold text-gray-700 mb-3">
            All {name} Storms ({storms.length})
          </h3>
          <div className="space-y-2">
            {storms.map((storm, idx) => {
              const bgColor = BACKGROUND_BADGE[storm.intensity];
              const textColor = TEXT_COLOR_BADGE[storm.intensity];
              const hoverColor = BACKGROUND_HOVER_BADGE[storm.intensity];
              const isHovered = hoveredName === storm.name;
              const hasMap = storm.map && storm.map.trim() !== "";
              const intensityLabel = getIntensityLabel(storm.intensity);
              const stormTitle = `${intensityLabel} ${storm.name} ${storm.year}`;

              return (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-2 rounded-lg transition-opacity"
                  style={{ backgroundColor: isHovered ? hoverColor : bgColor }}
                  onMouseEnter={() => setHoveredName(storm.name)}
                  onMouseLeave={() => setHoveredName(null)}
                >
                  <div className="flex-1">
                    <div className="font-bold" style={{ color: textColor }}>
                      {stormTitle}
                    </div>
                  </div>
                  {showMap && hasMap && (
                    <div className="shrink-0">
                      <img
                        src={storm.map}
                        alt={`${storm.name} ${storm.year} track`}
                        className="h-32 w-48 object-cover rounded border-2 border-white/30"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
};
