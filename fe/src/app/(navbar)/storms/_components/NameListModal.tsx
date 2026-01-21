import { useState, useRef } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import Modal from "../../../../components/Modal";
import Toggle from "../../../../components/Toggle";
import {
  BACKGROUND_BADGE,
  TEXT_COLOR_BADGE,
  BACKGROUND_HOVER_BADGE,
  TEXT_COLOR_WHITE_BACKGROUND,
  INTENSITY_LABEL,
} from "../../../../constants";
import { getIntensityFromNumber } from "../_utils/fns";
import StormMapPopup from "./StormMapPopup";
import type { BaseModalProps, Storm } from "../../../../types";

export interface NameListModalProps extends BaseModalProps {
  name: string;
  storms: Storm[];
  avgIntensity?: number;
}

const NameListModal = ({ isOpen, onClose, name, storms, avgIntensity = 0 }: NameListModalProps) => {
  const [showMap, setShowMap] = useState(false);
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);
  const [selectedStorm, setSelectedStorm] = useState<number | null>(null);
  const stormRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const popupRef = useRef<HTMLDivElement>(null);

  // Calculate title color based on average intensity
  const intensityLabel = getIntensityFromNumber(avgIntensity);
  const titleColor = TEXT_COLOR_WHITE_BACKGROUND[intensityLabel];

  const handleClose = () => {
    setSelectedStorm(null);
    onClose();
  };

  if (!storms || storms.length === 0) return null;

  const handleBadgeClick = (index: number) => {
    if (selectedStorm === index) {
      setSelectedStorm(null);
    } else {
      setSelectedStorm(index);
    }
  };

  const selectedStormData = selectedStorm !== null ? storms[selectedStorm] : null;
  const selectedBorderColor = selectedStormData
    ? BACKGROUND_BADGE[selectedStormData.intensity]
    : "";

  const titleStyle: CSSProperties = { color: titleColor };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={name}
      maxWidth={512}
      titleStyle={titleStyle}
    >
      {(modalContainerRef) => (
        <div className="space-y-4">
          {/* Storm Information and Toggle - all in one line */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <div className="flex flex-col gap-1">
              <div>
                <span className="font-semibold text-gray-700">Country:</span>
                <span className="ml-2 text-gray-700">{storms[0].country}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Position:</span>
                <span className="ml-2 text-gray-700">{storms[0].position}</span>
              </div>
              {storms[0].correctSpelling && (
                <div>
                  <span className="font-semibold text-gray-700">Correct spelling:</span>
                  <span className="ml-2 text-gray-700">{storms[0].correctSpelling}</span>
                </div>
              )}
            </div>
            <div className="flex flex-col items-end md:flex-row">
              <Toggle value={showMap} onChange={setShowMap} label="Show Map" />
            </div>
          </div>

          {/* Storms List */}
          <div>
            <h3 className="mb-3 font-semibold text-gray-700">
              All {name} Storms ({storms.length})
            </h3>
            <div className="relative space-y-2">
              {storms.map((storm, idx) => {
                const bgColor = BACKGROUND_BADGE[storm.intensity];
                const textColor = TEXT_COLOR_BADGE[storm.intensity];
                const hoverColor = BACKGROUND_HOVER_BADGE[storm.intensity];
                const isHovered = hoveredYear === storm.year;
                const intensityLabel = INTENSITY_LABEL[storm.intensity];
                const stormTitle = `${intensityLabel} ${storm.name} ${storm.year}`;

                return (
                  <div
                    key={idx}
                    ref={(el) => {
                      stormRefs.current[idx] = el;
                    }}
                    className="cursor-pointer rounded-lg bg-white px-2 transition-colors hover:bg-gray-100"
                    onMouseEnter={() => setHoveredYear(storm.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                    onClick={() => handleBadgeClick(idx)}
                  >
                    <div
                      className={`flex items-center gap-4 rounded-md p-2 transition-colors ${
                        selectedStorm === idx ? "rounded-t-md" : "rounded-md"
                      }`}
                      style={{ backgroundColor: isHovered ? hoverColor : bgColor }}
                    >
                      <div className="flex-1">
                        <div className="text-sm font-bold" style={{ color: textColor }}>
                          {stormTitle}
                        </div>
                      </div>
                      {showMap && (
                        <div className="relative h-32 w-48 shrink-0">
                          <Image
                            src={storm.map}
                            alt={`${storm.name} ${storm.year} track`}
                            fill
                            className="rounded border-2 border-white/30 object-cover"
                            unoptimized
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <StormMapPopup
            popupRef={popupRef}
            selectedStorm={selectedStormData}
            stormRefs={stormRefs}
            selectedStormIndex={selectedStorm}
            modalContainerRef={modalContainerRef as React.MutableRefObject<HTMLDivElement | null>}
            borderColor={selectedBorderColor}
            onClose={() => setSelectedStorm(null)}
          />
        </div>
      )}
    </Modal>
  );
};

export default NameListModal;
