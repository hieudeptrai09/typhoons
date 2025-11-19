import { Modal } from "../../../../components/Modal";
import IntensityBadge from "../../../../components/IntensityBadge";
import { getWhiteTextcolor } from "../../../../containers/utils/intensity";

export const StormDetailModal = ({ isOpen, onClose, title, storms }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      wrapperClassName="max-w-md"
    >
      <div className="flex gap-1.5 flex-col max-h-96 overflow-y-auto">
        {storms.map((storm, index) => (
          <div key={index} className="flex items-center">
            <IntensityBadge intensity={storm.intensity} />
            <span
              className="ml-1.5"
              style={{
                color: getWhiteTextcolor(storm.intensity),
              }}
            >
              {`${storm.name} (${storm.year})`}
            </span>
          </div>
        ))}
      </div>
    </Modal>
  );
};
