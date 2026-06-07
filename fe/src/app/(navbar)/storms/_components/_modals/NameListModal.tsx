import { useState, useRef, useEffect } from "react";
import type { CSSProperties, RefObject } from "react";
import { Modal } from "antd";
import ImageWithLoader from "../../../../../components/components/ImageWithLoader";
import Toggle from "../../../../../components/components/Toggle";
import {
  BACKGROUND_BADGE,
  TEXT_COLOR_BADGE,
  BACKGROUND_HOVER_BADGE,
  TEXT_COLOR_WHITE_BACKGROUND,
  INTENSITY_LABEL,
  COUNTRY_FLAG_COMPONENTS,
} from "../../../../../constants";
import { getIntensityFromNumber } from "../../_utils/fns";
import StormMapPopup from "../_popups/StormMapPopup";
import type { BaseModalProps, Storm } from "../../../../../types";

export interface NameListModalProps extends BaseModalProps {
  name: string;
  storms: Storm[];
  avgIntensity?: number;
}

interface InnerProps {
  name: string;
  storms: Storm[];
  modalContainerRef: RefObject<HTMLDivElement | null>;
}

const NameListModalInner = ({ name, storms, modalContainerRef }: InnerProps) => {
  const [showMap, setShowMap] = useState(false);
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);
  const [selectedStorm, setSelectedStorm] = useState<number | null>(null);
  const [modalContainer, setModalContainer] = useState<HTMLDivElement | null>(null);
  const stormRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setModalContainer(modalContainerRef.current);
  }, [modalContainerRef]);

  const handleBadgeClick = (index: number) => {
    setSelectedStorm((prev) => (prev === index ? null : index));
  };

  const selectedStormData = selectedStorm !== null ? storms[selectedStorm] : null;
  const selectedBorderColor = selectedStormData
    ? BACKGROUND_BADGE[selectedStormData.intensity]
    : "";

  const FlagComponent = COUNTRY_FLAG_COMPONENTS[storms[0].country];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">Country:</span>
            {FlagComponent ? (
              <div className="h-5 w-8 overflow-hidden rounded border border-gray-300 shadow-sm">
                <FlagComponent className="h-full w-full object-cover" />
              </div>
            ) : (
              <span className="text-gray-700">{storms[0].country}</span>
            )}
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
            const label = INTENSITY_LABEL[storm.intensity];
            const stormTitle = `${label} ${storm.name} ${storm.year}`;

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
                      <ImageWithLoader
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
        modalContainer={modalContainer}
        borderColor={selectedBorderColor}
        onClose={() => setSelectedStorm(null)}
      />
    </div>
  );
};

const NameListModal = ({ isOpen, onClose, name, storms, avgIntensity = 0 }: NameListModalProps) => {
  // StormMapPopup portals into this div, which sits inside antd's modal body.
  const modalContainerRef = useRef<HTMLDivElement>(null);

  const titleStyle: CSSProperties = {
    color: TEXT_COLOR_WHITE_BACKGROUND[getIntensityFromNumber(avgIntensity)],
  };

  if (!storms || storms.length === 0) return null;

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      width={512}
      footer={null}
      centered
      destroyOnHidden
      title={
        <span className="text-2xl font-bold" style={titleStyle}>
          {name}
        </span>
      }
    >
      <div ref={modalContainerRef} className="relative overflow-y-auto pt-4">
        <NameListModalInner name={name} storms={storms} modalContainerRef={modalContainerRef} />
      </div>
    </Modal>
  );
};

export default NameListModal;
