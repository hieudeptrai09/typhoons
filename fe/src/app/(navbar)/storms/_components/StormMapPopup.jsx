import { BACKGROUND_BADGE } from "../../../../constants";
import { Popup } from "../../../../components/Popup";

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
