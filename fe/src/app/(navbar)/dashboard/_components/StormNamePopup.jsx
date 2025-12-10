import { createPortal } from "react-dom";
import { useEffect } from "react";
import IntensityBadge from "../../../../components/IntensityBadge";
import { TEXT_COLOR_WHITE_BACKGROUND } from "../../../../constants";

export const StormNamePopup = ({
  popupRef,
  selectedName,
  selectedNameData,
  nameElementRef,
  onClose,
}) => {
  // Update popup position relative to the selected name element
  useEffect(() => {
    const updatePosition = () => {
      if (selectedName && nameElementRef && popupRef.current) {
        const nameRect = nameElementRef.getBoundingClientRect();

        const popupMaxHeight = 41 + getHeight(selectedNameData.storms.length);
        const popupWidth = nameRect.width;
        const gap = 4;

        // Use fixed positioning relative to viewport
        let top = nameRect.bottom + gap;
        const left = nameRect.left;

        // Adjust top if popup would go below viewport
        if (top + popupMaxHeight > window.innerHeight) {
          top = window.innerHeight - popupMaxHeight - gap;
        }
        // If top would be negative or above container top, set it to 0
        if (top < 0) {
          top = 0;
        }

        popupRef.current.style.top = `${top}px`;
        popupRef.current.style.left = `${left}px`;
        popupRef.current.style.width = `${popupWidth - 5}px`;
        popupRef.current.style.maxHeight = `${popupMaxHeight}px`;
      }
    };

    // Initial position
    updatePosition();

    // Update position on scroll
    if (selectedName) {
      window.addEventListener("scroll", updatePosition, true);
    }

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [selectedName, nameElementRef, popupRef, selectedNameData]);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        selectedName &&
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        !nameElementRef?.contains(event.target)
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
  }, [selectedName, popupRef, nameElementRef, onClose]);

  if (!selectedName || !selectedNameData) {
    return null;
  }

  const getHeight = (length) => {
    if (length === 1) return 56;
    else if (length === 2) return 102;
    else if (length === 3) return 148;
    else return 150;
  };

  return createPortal(
    <div
      ref={popupRef}
      className="bg-white border-2 border-blue-500 rounded-lg shadow-xl fixed flex flex-col z-50"
    >
      <div className="font-semibold text-blue-700 px-4 py-2 border-b shrink-0">
        All <span className="text-purple-600 font-bold">{selectedName}</span>{" "}
        storms:
      </div>
      <div
        className="flex flex-col gap-1.5 px-4 py-2 overflow-y-auto flex-1"
        style={{
          minHeight: `${getHeight(selectedNameData.storms.length)}px`,
        }}
      >
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
    document.body
  );
};
