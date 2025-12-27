import { useEffect } from "react";
import { createPortal } from "react-dom";
import { BACKGROUND_BADGE } from "../../../../constants";

const StormMapPopup = ({ popupRef, selectedStorm, stormRefs, selectedStormIndex, onClose }) => {
  // Update popup position relative to the selected storm element
  useEffect(() => {
    const updatePosition = () => {
      const stormElementRef = stormRefs?.current[selectedStormIndex];

      if (selectedStorm && stormElementRef && popupRef.current) {
        const stormRect = stormElementRef.getBoundingClientRect();

        const popupHeight = 262; // Fixed height for map popup
        const popupWidth = stormRect.width - 5; // Fixed width for map popup
        const gap = 4;

        // Use fixed positioning relative to viewport
        let top = stormRect.bottom + gap;
        let left = stormRect.left;

        // Adjust if popup would go below viewport
        if (top + popupHeight > window.innerHeight) {
          top = stormRect.top - popupHeight - gap;
        }

        // Adjust if popup would go off right edge
        if (left + popupWidth > window.innerWidth) {
          left = window.innerWidth - popupWidth - gap;
        }

        // Adjust if popup would go off left edge
        if (left < gap) {
          left = gap;
        }

        // If top would be negative, set it to gap
        if (top < gap) {
          top = gap;
        }

        popupRef.current.style.top = `${top}px`;
        popupRef.current.style.left = `${left}px`;
        popupRef.current.style.width = `${popupWidth}px`;
        popupRef.current.style.height = `${popupHeight}px`;
      }
    };

    // Initial position
    updatePosition();

    // Update position on scroll
    if (selectedStorm) {
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
    }

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [selectedStorm, popupRef, stormRefs, selectedStormIndex]);

  // Close popup when clicking outside
  useEffect(() => {
    const stormElementRef = stormRefs?.current[selectedStormIndex];
    const handleClickOutside = (event) => {
      if (
        selectedStorm &&
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        !stormElementRef?.contains(event.target)
      ) {
        onClose();
      }
    };

    if (selectedStorm) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedStorm, popupRef, stormRefs, onClose, selectedStormIndex]);

  if (!selectedStorm || !selectedStorm.map || selectedStorm.map.trim() === "") {
    return null;
  }

  const stormTitle = `${selectedStorm.name} ${selectedStorm.year}`;
  const borderColor = BACKGROUND_BADGE[selectedStorm.intensity];

  return createPortal(
    <div
      ref={popupRef}
      className="fixed z-50 flex flex-col overflow-hidden rounded-lg border-2 bg-white shadow-xl"
      style={{ borderColor: borderColor }}
    >
      <div
        className="shrink-0 border-b-2 px-4 py-2 font-semibold"
        style={{ borderBottomColor: borderColor }}
      >
        <span className="text-blue-700">{stormTitle}</span>
      </div>
      <div className="flex-1 overflow-hidden p-2">
        <img
          src={selectedStorm.map}
          alt={`${selectedStorm.name} ${selectedStorm.year} track`}
          className="h-full w-full object-contain"
        />
      </div>
    </div>,
    document.body,
  );
};

export default StormMapPopup;
