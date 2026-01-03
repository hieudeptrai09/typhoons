import { useState, useRef } from "react";
import Modal from "../../../../components/Modal";
import {
  BACKGROUND_BADGE,
  TEXT_COLOR_BADGE,
  TEXT_COLOR_WHITE_BACKGROUND,
  INTENSITY_RANK,
  BACKGROUND_HOVER_BADGE,
  IntensityType,
} from "../../../../constants";
import { getIntensityFromNumber, calculateAverage, getGroupedStorms } from "../_utils/fns";
import StormNamePopup from "./StormNamePopup";
import { AverageModalProps, NameData } from "../../../../types";

const AverageModal = ({ isOpen, onClose, title, average, storms }: AverageModalProps) => {
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [hoveredName, setHoveredName] = useState<string | null>(null);
  const nameRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const popupRef = useRef<HTMLDivElement>(null);

  // Group storms by name and calculate average intensity for each name
  const nameAverages = getGroupedStorms(storms, "name");

  const nameData: NameData[] = Object.entries(nameAverages).map(([name, nameStorms]) => {
    const avg = calculateAverage(nameStorms);
    return { name, average: avg, count: nameStorms.length, storms: nameStorms };
  });

  const handleClose = () => {
    setSelectedName(null);
    onClose();
  };

  const handleNameClick = (name: string) => {
    if (selectedName === name) {
      setSelectedName(null);
    } else {
      setSelectedName(name);
    }
  };

  const selectedNameData = nameData.find((d) => d.name === selectedName);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title} wrapperClassName="max-w-md">
      <div className="space-y-3">
        <div title={JSON.stringify(INTENSITY_RANK)}>
          <span className="text-blue-700">Overall Average Intensity: </span>
          <span
            className="text-lg font-bold"
            style={{
              color: TEXT_COLOR_WHITE_BACKGROUND[getIntensityFromNumber(average)],
            }}
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
                  className="flex cursor-pointer items-center justify-between rounded border px-3 py-2 transition-colors"
                  style={{
                    backgroundColor: isHovered ? hoverColor : bgColor,
                    borderColor: bgColor,
                  }}
                  onMouseEnter={() => setHoveredName(data.name)}
                  onMouseLeave={() => setHoveredName(null)}
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
              );
            })}
          </div>
        </div>

        <StormNamePopup
          popupRef={popupRef}
          selectedName={selectedName}
          selectedNameData={selectedNameData}
          nameRefs={nameRefs}
          onClose={() => setSelectedName(null)}
        />
      </div>
    </Modal>
  );
};

export default AverageModal;
