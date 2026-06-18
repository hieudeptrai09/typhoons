import { Modal } from "antd";
import IntensityBadge from "../../../../../components/components/IntensityBadge";
import { TEXT_COLOR_WHITE_BACKGROUND } from "../../../../../constants";
import type { BaseModalProps, Storm } from "../../../../../types";

export interface StormDetailModalProps extends BaseModalProps {
  title: string;
  storms: Storm[];
}

const StormDetailModal = ({ isOpen, onClose, title, storms }: StormDetailModalProps) => {
  const groupedByName = storms.reduce<Record<string, Storm[]>>((acc, storm) => {
    if (!acc[storm.name]) acc[storm.name] = [];
    acc[storm.name].push(storm);
    return acc;
  }, {});

  const nameGroups = Object.entries(groupedByName);
  const hasMultipleNames = nameGroups.length > 1;

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      width={448}
      footer={null}
      centered
      destroyOnHidden
      styles={{
        header: { borderBottom: "1px solid #9ca3af", paddingBottom: "12px" },
        body: { maxHeight: "70vh", overflowY: "auto" },
      }}
      title={<span className="text-2xl font-bold text-gray-700">{title}</span>}
    >
      <div className="flex flex-col pt-4 pb-px">
        {nameGroups.map(([name, stormGroup], groupIndex) => (
          <div key={name} className="flex flex-col gap-1.5">
            {stormGroup.map((storm, index) => (
              <div key={index} className="flex items-center">
                <IntensityBadge intensity={storm.intensity} />
                <span
                  className="ml-1.5"
                  style={{ color: TEXT_COLOR_WHITE_BACKGROUND[storm.intensity] }}
                >
                  {storm.name} {storm.year}
                </span>
              </div>
            ))}

            {hasMultipleNames && groupIndex < nameGroups.length - 1 && (
              <div className="my-3 border-b border-gray-300" />
            )}
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default StormDetailModal;
