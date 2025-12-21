import { createPortal } from "react-dom";
import { useEffect } from "react";
import { BACKGROUND_BADGE } from "../../../../constants";

export const StormMapPopup = ({
  popupRef,
  selectedStorm,
  stormElementRef,
  onClose,
}) => {
  // Update popup position relative to the selected storm element
  useEffect(() => {
    const updatePosition = () => {
      if (selectedStorm && stormElementRef && popupRef.current) {
        const stormRect = stormElementRef.getBoundingClientRect();

        const popupHeight = 300; // Fixed height for map popup
        const popupWidth = 400; // Fixed width for map popup
        const gap = 8;

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
  }, [selectedStorm, stormElementRef, popupRef]);

  // Close popup when clicking outside
  useEffect(() => {
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
  }, [selectedStorm, popupRef, stormElementRef, onClose]);

  if (!selectedStorm || !selectedStorm.map || selectedStorm.map.trim() === "") {
    return null;
  }

  const stormTitle = `${selectedStorm.name} ${selectedStorm.year}`;
  const borderColor = BACKGROUND_BADGE[selectedStorm.intensity];

  return createPortal(
    <div
      ref={popupRef}
      className="bg-white rounded-lg shadow-xl fixed flex flex-col z-50 border-2 overflow-hidden"
      style={{ borderColor: borderColor }}
    >
      <div
        className="font-semibold px-4 py-2 border-b-2 shrink-0"
        style={{ borderBottomColor: borderColor }}
      >
        <span className="text-blue-700">{stormTitle}</span>
      </div>
      <div className="flex-1 p-2 overflow-hidden">
        <img
          src={selectedStorm.map}
          alt={`${selectedStorm.name} ${selectedStorm.year} track`}
          className="w-full h-full object-contain"
        />
      </div>
    </div>,
    document.body
  );
};
