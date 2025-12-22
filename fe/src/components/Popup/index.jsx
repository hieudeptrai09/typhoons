import { createPortal } from "react-dom";
import { useEffect } from "react";

export const Popup = ({
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

        // Use fixed positioning relative to viewport
        let top = triggerRect.bottom + gap;
        let left = triggerRect.left;

        // Adjust if popup would go below viewport
        if (top + popupHeight > window.innerHeight) {
          if (preferredPosition === "below") {
            top = triggerRect.top - popupHeight - gap;
          } else {
            top = window.innerHeight - popupHeight - gap;
          }
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
