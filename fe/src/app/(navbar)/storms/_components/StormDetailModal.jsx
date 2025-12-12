import { Modal } from "../../../../components/Modal";
import IntensityBadge from "../../../../components/IntensityBadge";
import { TEXT_COLOR_WHITE_BACKGROUND } from "../../../../constants";

export const StormDetailModal = ({ isOpen, onClose, title, storms }) => {
  // Group storms by name
  const groupedByName = storms.reduce((acc, storm) => {
    if (!acc[storm.name]) {
      acc[storm.name] = [];
    }
    acc[storm.name].push(storm);
    return acc;
  }, {});

  const nameGroups = Object.entries(groupedByName);
  const hasMultipleNames = nameGroups.length > 1;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      wrapperClassName="max-w-md"
    >
      <div className="flex flex-col max-h-96 overflow-y-auto">
        {nameGroups.map(([name, stormGroup], groupIndex) => (
          <div key={name} className="flex gap-1.5 flex-col">
            {stormGroup.map((storm, index) => (
              <div key={index} className="flex items-center">
                <IntensityBadge intensity={storm.intensity} />
                <span
                  className="ml-1.5"
                  style={{
                    color: TEXT_COLOR_WHITE_BACKGROUND[storm.intensity],
                  }}
                >
                  {storm.name} {storm.year}
                </span>
              </div>
            ))}

            {hasMultipleNames && groupIndex < nameGroups.length - 1 && (
              <div className="border-b border-gray-300 my-3"></div>
            )}
          </div>
        ))}
      </div>
    </Modal>
  );
};
