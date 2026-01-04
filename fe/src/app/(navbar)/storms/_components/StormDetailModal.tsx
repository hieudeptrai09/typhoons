import IntensityBadge from "../../../../components/IntensityBadge";
import Modal from "../../../../components/Modal";
import { TEXT_COLOR_WHITE_BACKGROUND } from "../../../../constants";
import type { BaseModalProps, Storm } from "../../../../types";

export interface StormDetailModalProps extends BaseModalProps {
  title: string;
  storms: Storm[];
}

const StormDetailModal = ({ isOpen, onClose, title, storms }: StormDetailModalProps) => {
  // Group storms by name
  const groupedByName = storms.reduce<Record<string, Storm[]>>((acc, storm) => {
    if (!acc[storm.name]) {
      acc[storm.name] = [];
    }
    acc[storm.name].push(storm);
    return acc;
  }, {});

  const nameGroups = Object.entries(groupedByName);
  const hasMultipleNames = nameGroups.length > 1;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} wrapperClassName="max-w-md">
      <div className="flex max-h-96 flex-col overflow-y-auto">
        {nameGroups.map(([name, stormGroup], groupIndex) => (
          <div key={name} className="flex flex-col gap-1.5">
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
              <div className="my-3 border-b border-gray-300"></div>
            )}
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default StormDetailModal;
