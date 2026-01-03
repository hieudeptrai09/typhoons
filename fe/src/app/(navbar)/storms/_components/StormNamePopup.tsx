import { useEffect } from "react";
import type { MutableRefObject } from "react";
import { createPortal } from "react-dom";
import IntensityBadge from "../../../../components/IntensityBadge";
import { TEXT_COLOR_WHITE_BACKGROUND } from "../../../../constants";
import type { NameData } from "../../../../types";

interface StormNamePopupProps {
  popupRef: MutableRefObject<HTMLDivElement | null>;
  selectedName: string | null;
  selectedNameData: NameData | undefined;
  nameRefs: MutableRefObject<Record<string, HTMLDivElement | null>>;
  onClose: () => void;
}

const StormNamePopup = ({
  popupRef,
  selectedName,
  selectedNameData,
  nameRefs,
  onClose,
}: StormNamePopupProps) => {
  const getHeight = (length: number): number => {
    if (length === 1) return 56;
    else if (length === 2) return 102;
    else if (length === 3) return 148;
    else return 150;
  };

  // Update popup position relative to the selected name element
  useEffect(() => {
    const updatePosition = () => {
      const nameElementRef = selectedName ? nameRefs.current[selectedName] : null;

      if (selectedName && nameElementRef && popupRef.current && selectedNameData) {
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
  }, [selectedName, nameRefs, popupRef, selectedNameData]);

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

  if (!selectedName || !selectedNameData) {
    return null;
  }

  return createPortal(
    <div
      ref={popupRef}
      className="fixed z-50 flex flex-col rounded-lg border-2 border-blue-500 bg-white shadow-xl"
    >
      <div className="shrink-0 border-b-2 px-4 py-2 font-semibold text-blue-700">
        All <span className="font-bold text-purple-600">{selectedName}</span> storms:
      </div>
      <div
        className="flex flex-1 flex-col gap-1.5 overflow-y-auto px-4 py-2"
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
    document.body,
  );
};

export default StormNamePopup;
