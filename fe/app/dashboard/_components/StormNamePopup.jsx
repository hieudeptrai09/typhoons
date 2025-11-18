import { createPortal } from "react-dom";
import { useEffect } from "react";
import IntensityBadge from "../../../components/IntensityBadge";
import { getWhiteTextcolor } from "../../../containers/utils/intensity";

export const StormNamePopup = ({
  popupRef,
  selectedName,
  selectedNameData,
  nameElement,
  onClose,
}) => {
  // Position the popup
  useEffect(() => {
    if (selectedName && nameElement && popupRef.current) {
      const nameRect = nameElement.getBoundingClientRect();

      const popupMaxHeight = 320;
      const popupWidth = nameRect.width;
      const gap = 4;

      const top = nameRect.bottom + window.scrollY + gap;
      const left = nameRect.left + window.scrollX;

      popupRef.current.style.top = `${top}px`;
      popupRef.current.style.left = `${left}px`;
      popupRef.current.style.width = `${popupWidth}px`;
      popupRef.current.style.maxHeight = `${popupMaxHeight}px`;
    }
  }, [selectedName, nameElement, popupRef]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        selectedName &&
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        !nameElement?.contains(event.target)
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
  }, [selectedName, popupRef, nameElement, onClose]);

  if (!selectedName || !selectedNameData) {
    return null;
  }

  return createPortal(
    <div
      ref={popupRef}
      className="bg-white border-2 border-purple-500 rounded-lg shadow-xl overflow-y-auto"
      style={{
        position: "absolute",
        display: "flex",
        flexDirection: "column",
        zIndex: 9999,
      }}
    >
      <div className="font-semibold text-purple-700 p-4 pb-2 border-b shrink-0">
        All {selectedName} storms:
      </div>
      <div
        className="flex flex-col gap-1.5 p-4 pt-2 overflow-y-auto"
        style={{ flex: "1 1 auto" }}
      >
        {selectedNameData.storms.map((storm, index) => (
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
    </div>,
    document.body
  );
};
