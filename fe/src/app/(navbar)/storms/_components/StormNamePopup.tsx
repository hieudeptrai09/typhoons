import { useEffect } from "react";
import type { MutableRefObject } from "react";
import { createPortal } from "react-dom";
import IntensityBadge from "../../../../components/IntensityBadge";
import { TEXT_COLOR_WHITE_BACKGROUND } from "../../../../constants";
import type { Storm } from "../../../../types";

interface NameAverageData {
  name: string;
  average: number;
  count: number;
  storms: Storm[];
}

interface StormNamePopupProps {
  popupRef: MutableRefObject<HTMLDivElement | null>;
  selectedName: string | null;
  selectedNameData: NameAverageData | undefined;
  nameRefs: MutableRefObject<Record<string, HTMLDivElement | null>>;
  modalContainerRef: MutableRefObject<HTMLDivElement | null>;
  borderColor: string;
  onClose: () => void;
}

const StormNamePopup = ({
  popupRef,
  selectedName,
  selectedNameData,
  nameRefs,
  modalContainerRef,
  borderColor,
  onClose,
}: StormNamePopupProps) => {
  // Update popup position relative to the selected name element
  useEffect(() => {
    const updatePosition = () => {
      const nameElementRef = selectedName ? nameRefs.current[selectedName] : null;
      const modalContainer = modalContainerRef.current;

      if (
        selectedName &&
        nameElementRef &&
        popupRef.current &&
        selectedNameData &&
        modalContainer
      ) {
        const nameRect = nameElementRef.getBoundingClientRect();
        const containerRect = modalContainer.getBoundingClientRect();

        // const popupMaxHeight = getHeight(selectedNameData.storms.length);
        const popupWidth = nameRect.width - 16;

        const scrollTop = modalContainer.scrollTop;
        const top = nameRect.bottom - containerRect.top + scrollTop;
        const left = nameRect.left - containerRect.left + 8;

        popupRef.current.style.top = `${top}px`;
        popupRef.current.style.left = `${left}px`;
        popupRef.current.style.width = `${popupWidth}px`;
      }
    };

    // Initial position
    updatePosition();

    // Update position on scroll within the modal
    if (selectedName && modalContainerRef.current) {
      const modalContainer = modalContainerRef.current;

      modalContainer.addEventListener("scroll", updatePosition);
      window.addEventListener("resize", updatePosition);

      return () => {
        modalContainer.removeEventListener("scroll", updatePosition);
        window.removeEventListener("resize", updatePosition);
      };
    }
  }, [selectedName, nameRefs, popupRef, selectedNameData, modalContainerRef]);

  // Close popup when clicking outside
  useEffect(() => {
    const nameElementRef = selectedName ? nameRefs?.current[selectedName] : null;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectedName &&
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        !nameElementRef?.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (selectedName) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedName, popupRef, nameRefs, onClose]);

  if (!selectedName || !selectedNameData || !modalContainerRef.current) {
    return null;
  }

  return createPortal(
    <div
      ref={popupRef}
      className="absolute z-50 flex flex-col rounded-b-lg border-2 border-t-0 bg-white shadow-xl"
      style={{ borderColor }}
    >
      <div className="flex flex-1 flex-col gap-1.5 overflow-y-auto px-4 py-2">
        {selectedNameData.storms.map((storm, index) => (
          <div key={index} className="flex items-center gap-2">
            <IntensityBadge intensity={storm.intensity} />
            <span
              className="text-sm"
              style={{
                color: TEXT_COLOR_WHITE_BACKGROUND[storm.intensity],
              }}
            >
              {storm.year}
            </span>
          </div>
        ))}
      </div>
    </div>,
    modalContainerRef.current,
  );
};

export default StormNamePopup;
