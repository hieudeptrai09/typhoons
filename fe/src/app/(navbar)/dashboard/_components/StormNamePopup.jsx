import { createPortal } from "react-dom";
import { useEffect } from "react";
import IntensityBadge from "../../../../components/IntensityBadge";
import { TEXT_COLOR_WHITE_BACKGROUND } from "../../../../constants";

export const StormNamePopup = ({
  popupRef,
  selectedName,
  selectedNameData,
  nameElement,
  onClose,
}) => {
  // Position the popup
  useEffect(() => {
    const updatePosition = () => {
      if (selectedName && nameElement && popupRef.current) {
        const nameRect = nameElement.getBoundingClientRect();

        const popupMaxHeight = 41 + getHeight(selectedNameData.storms.length);
        const popupWidth = nameRect.width;
        const gap = 4;

        // Use fixed positioning relative to viewport
        let top = nameRect.bottom + gap;
        const left = nameRect.left;

        // Adjust top if popup would go below viewport
        if (top + popupMaxHeight > window.innerHeight) {
          top = window.innerHeight - popupMaxHeight - gap;
          // If there's still not enough space, position it at the top of viewport
          if (top < gap) {
            top = gap;
          }
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

  const getHeight = (length) => {
    if (length === 1) return 56;
    else if (length === 2) return 102;
    else if (length === 3) return 148;
    else return 150;
  };

  return createPortal(
    <div
      ref={popupRef}
      className="bg-white border-2 border-purple-500 rounded-lg shadow-xl fixed flex flex-col z-50"
    >
      <div className="font-semibold text-purple-700 px-4 py-2 border-b shrink-0">
        All <span className="text-red-700">{selectedName}</span> storms:
      </div>
      <div
        className="flex flex-col gap-1.5 px-4 py-2 overflow-y-auto"
        style={{
          flex: "1 1 0",
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
