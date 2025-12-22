import { BACKGROUND_BADGE } from "../../../../constants";
import { createPortal } from "react-dom";
import { useEffect } from "react";

const Popup = ({
  popupRef,
  isOpen,
  triggerElementRef,
  onClose,
  children,
  className = "",
  style = {},
  positioning = {},
}) => {
  const {
    width,
    height,
    maxHeight,
    gap = 4,
    preferredPosition = "below", // 'below' or 'above'
  } = positioning;

  // Update popup position relative to the trigger element
  useEffect(() => {
    const updatePosition = () => {
      if (isOpen && triggerElementRef && popupRef.current) {
        const triggerRect = triggerElementRef.getBoundingClientRect();
        const popupHeight =
          height || maxHeight || popupRef.current.offsetHeight;
        const popupWidth = width || triggerRect.width;

        let top;
        let left = triggerRect.left;

        // Determine vertical position: bottom first, then top, then top=0
        const spaceBelow = window.innerHeight - triggerRect.bottom - gap;
        const spaceAbove = triggerRect.top - gap;

        if (spaceBelow >= popupHeight) {
          // Enough space below - position below trigger
          top = triggerRect.bottom + gap;
        } else if (spaceAbove >= popupHeight) {
          // Not enough space below but enough above - position above trigger
          top = triggerRect.top - popupHeight - gap;
        } else {
          // Not enough space in either direction - position at top of viewport
          top = gap;
        }

        // Adjust if popup would go off right edge
        if (left + popupWidth > window.innerWidth) {
          left = window.innerWidth - popupWidth - gap;
        }

        // Adjust if popup would go off left edge
        if (left < gap) {
          left = gap;
        }

        popupRef.current.style.top = `${top}px`;
        popupRef.current.style.left = `${left}px`;
        popupRef.current.style.width = `${popupWidth - 5}px`;

        if (height) {
          popupRef.current.style.height = `${height}px`;
        }
        if (maxHeight) {
          popupRef.current.style.maxHeight = `${maxHeight}px`;
        }
      }
    };

    // Initial position
    updatePosition();

    // Update position on scroll and resize
    if (isOpen) {
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
    }

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [
    isOpen,
    triggerElementRef,
    popupRef,
    width,
    height,
    maxHeight,
    gap,
    preferredPosition,
  ]);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        !triggerElementRef?.contains(event.target)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, popupRef, triggerElementRef, onClose]);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div
      ref={popupRef}
      className={`bg-white rounded-lg shadow-xl fixed flex flex-col z-50 border-2 ${className}`}
      style={style}
    >
      {children}
    </div>,
    document.body
  );
};

export const StormMapPopup = ({
  popupRef,
  selectedStorm,
  stormElementRef,
  onClose,
}) => {
  if (!selectedStorm || !selectedStorm.map || selectedStorm.map.trim() === "") {
    return null;
  }

  const stormTitle = `${selectedStorm.name} ${selectedStorm.year}`;
  const borderColor = BACKGROUND_BADGE[selectedStorm.intensity];

  return (
    <Popup
      popupRef={popupRef}
      isOpen={true}
      triggerElementRef={stormElementRef}
      onClose={onClose}
      style={{ borderColor }}
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
    </Popup>
  );
};
