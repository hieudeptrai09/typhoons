import { useState, useRef, useEffect } from "react";
import type { RefObject } from "react";
import { Modal } from "antd";
import {
  BACKGROUND_BADGE,
  TEXT_COLOR_BADGE,
  TEXT_COLOR_WHITE_BACKGROUND,
  INTENSITY_RANK,
  BACKGROUND_HOVER_BADGE,
} from "../../../../../constants";
import { getIntensityFromNumber, calculateAverage, getGroupedStorms } from "../../_utils/fns";
import StormNamePopup from "../_popups/StormNamePopup";
import type { BaseModalProps, Storm } from "../../../../../types";

interface AverageModalProps extends BaseModalProps {
  title: string;
  average: number;
  storms: Storm[];
}

interface NameAverageData {
  name: string;
  average: number;
  count: number;
  storms: Storm[];
}

interface InnerProps {
  average: number;
  nameData: NameAverageData[];
  modalContainerRef: RefObject<HTMLDivElement | null>;
}

const AverageModalInner = ({ average, nameData, modalContainerRef }: InnerProps) => {
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [hoveredName, setHoveredName] = useState<string | null>(null);
  const [modalContainer, setModalContainer] = useState<HTMLDivElement | null>(null);
  const nameRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const popupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setModalContainer(modalContainerRef.current);
  }, [modalContainerRef]);

  const handleNameClick = (name: string) => {
    setSelectedName((prev) => (prev === name ? null : name));
  };

  const selectedNameData = nameData.find((d) => d.name === selectedName);
  const selectedBorderColor = selectedNameData
    ? BACKGROUND_BADGE[getIntensityFromNumber(selectedNameData.average)]
    : "";

  return (
    <div className="space-y-3">
      <div title={JSON.stringify(INTENSITY_RANK)}>
        <span className="text-blue-700">Overall Average Intensity: </span>
        <span
          className="text-lg font-bold"
          style={{ color: TEXT_COLOR_WHITE_BACKGROUND[getIntensityFromNumber(average)] }}
        >
          {average.toFixed(2)}
        </span>
      </div>
      <div>
        <div className="mb-2 text-blue-700">Storm names at this position:</div>
        <div className="relative space-y-2">
          {nameData.map((data, idx) => {
            const intensityLabel = getIntensityFromNumber(data.average);
            const bgColor = BACKGROUND_BADGE[intensityLabel];
            const hoverColor = BACKGROUND_HOVER_BADGE[intensityLabel];
            const textColor = TEXT_COLOR_BADGE[intensityLabel];
            const isHovered = hoveredName === data.name;

            return (
              <div
                key={idx}
                ref={(el) => {
                  nameRefs.current[data.name] = el;
                }}
                onClick={() => handleNameClick(data.name)}
                className="cursor-pointer rounded-lg bg-white px-2 transition-colors hover:bg-gray-100"
                onMouseEnter={() => setHoveredName(data.name)}
                onMouseLeave={() => setHoveredName(null)}
              >
                <div
                  className={`flex items-center justify-between px-3 py-2 transition-colors ${
                    selectedName === data.name ? "rounded-t-md" : "rounded-md"
                  }`}
                  style={{ backgroundColor: isHovered ? hoverColor : bgColor }}
                >
                  <span className="font-semibold" style={{ color: textColor }}>
                    {data.name}
                  </span>
                  <div className="flex gap-3 text-sm">
                    <span style={{ color: textColor }}>
                      Count: <span className="font-semibold">{data.count}</span>
                    </span>
                    <span style={{ color: textColor }}>
                      Avg: <span className="font-semibold">{data.average.toFixed(2)}</span>
                    </span>
                  </div>
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
        nameRefs={nameRefs}
        modalContainer={modalContainer}
        borderColor={selectedBorderColor}
        onClose={() => setSelectedName(null)}
      />
    </div>
  );
};

const AverageModal = ({ isOpen, onClose, title, average, storms }: AverageModalProps) => {
  // StormNamePopup portals into this div, which sits inside antd's modal body.
  const modalContainerRef = useRef<HTMLDivElement>(null);

  const nameAverages = getGroupedStorms(storms, "name");
  const nameData: NameAverageData[] = Object.entries(nameAverages).map(([name, nameStorms]) => {
    const avg = calculateAverage(nameStorms);
    return { name, average: avg, count: nameStorms.length, storms: nameStorms };
  });

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      width={448}
      footer={null}
      centered
      destroyOnHidden
      styles={{ header: { borderBottom: "1px solid #9ca3af", paddingBottom: "12px" } }}
      title={<span className="text-2xl font-bold text-gray-700">{title}</span>}
    >
      <div ref={modalContainerRef} className="relative max-h-[90%] overflow-y-auto pt-4">
        <AverageModalInner
          average={average}
          nameData={nameData}
          modalContainerRef={modalContainerRef}
        />
      </div>
    </Modal>
  );
};

export default AverageModal;
