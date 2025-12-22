import IntensityBadge from "../../../../components/IntensityBadge";
import { TEXT_COLOR_WHITE_BACKGROUND } from "../../../../constants";
import { Popup } from "../../../../components/Popup";

export const StormNamePopup = ({
  popupRef,
  selectedName,
  selectedNameData,
  nameElementRef,
  onClose,
}) => {
  if (!selectedName || !selectedNameData) {
    return null;
  }

  const getHeight = (length) => {
    if (length === 1) return 56;
    else if (length === 2) return 102;
    else if (length === 3) return 148;
    else return 150;
  };

  const popupMaxHeight = 41 + getHeight(selectedNameData.storms.length);

  return (
    <Popup
      popupRef={popupRef}
      isOpen={true}
      triggerElementRef={nameElementRef}
      onClose={onClose}
      className="border-blue-500"
      positioning={{
        maxHeight: popupMaxHeight,
      }}
    >
      <div className="font-semibold text-blue-700 px-4 py-2 border-b-2 shrink-0">
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
    </Popup>
  );
};
