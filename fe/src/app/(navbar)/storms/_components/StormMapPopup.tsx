import { useEffect } from "react";
import type { RefObject } from "react";
import { createPortal } from "react-dom";
import ImageWithLoader from "../../../../components/components/ImageWithLoader";
import type { Storm } from "../../../../types";

interface StormMapPopupProps {
  popupRef: RefObject<HTMLDivElement | null>;
  selectedStorm: Storm | null;
  stormRefs: RefObject<Record<number, HTMLDivElement | null>>;
  selectedStormIndex: number | null;
  modalContainer: HTMLDivElement | null;
  borderColor: string;
  onClose: () => void;
}

const StormMapPopup = ({
  popupRef,
  selectedStorm,
  stormRefs,
  selectedStormIndex,
  modalContainer,
  borderColor,
  onClose,
}: StormMapPopupProps) => {
  useEffect(() => {
    const updatePosition = () => {
      const stormElementRef =
        selectedStormIndex !== null ? stormRefs?.current?.[selectedStormIndex] : null;

      if (selectedStorm && stormElementRef && popupRef.current && modalContainer) {
        const stormRect = stormElementRef.getBoundingClientRect();
        const containerRect = modalContainer.getBoundingClientRect();

        const popupHeight = 230;
        const popupWidth = stormRect.width - 16;

        const scrollTop = modalContainer.scrollTop;
        const top = stormRect.bottom - containerRect.top + scrollTop;
        const left = stormRect.left - containerRect.left + 8;

        popupRef.current.style.top = `${top}px`;
        popupRef.current.style.left = `${left}px`;
        popupRef.current.style.width = `${popupWidth}px`;
        popupRef.current.style.height = `${popupHeight}px`;
      }
    };

    updatePosition();

    if (selectedStorm && modalContainer) {
      modalContainer.addEventListener("scroll", updatePosition);
      window.addEventListener("resize", updatePosition);
      return () => {
        modalContainer.removeEventListener("scroll", updatePosition);
        window.removeEventListener("resize", updatePosition);
      };
    }
  }, [selectedStorm, popupRef, stormRefs, selectedStormIndex, modalContainer]);

  useEffect(() => {
    const stormElementRef =
      selectedStormIndex !== null ? stormRefs?.current?.[selectedStormIndex] : null;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectedStorm &&
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        !stormElementRef?.contains(event.target as Node)
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

  if (!selectedStorm || !selectedStorm.map || selectedStorm.map.trim() === "" || !modalContainer) {
    return null;
  }

  return createPortal(
    <div
      ref={popupRef}
      className="absolute z-50 flex flex-col overflow-hidden rounded-b-md border-2 border-t-0 bg-white shadow-xl"
      style={{ borderColor }}
    >
      <div className="relative flex-1 overflow-hidden p-2">
        <ImageWithLoader
          src={selectedStorm.map}
          alt={`${selectedStorm.name} ${selectedStorm.year} track`}
          fill
          className="object-contain"
          unoptimized
        />
      </div>
    </div>,
    modalContainer,
  );
};

export default StormMapPopup;
