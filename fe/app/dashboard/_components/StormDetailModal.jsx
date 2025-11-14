import { Modal } from "../../../components/Modal";
import IntensityBadge from "../../../components/IntensityBadge";

const getIntensityColor = (intensity) => {
  const colors = {
    TD: "#0099CC",
    TS: "#00AA00",
    STS: "#009900",
    1: "#CC9900",
    2: "#CC8800",
    3: "#CC4400",
    4: "#CC0000",
    5: "#990099",
  };
  return colors[intensity] || "#333333";
};

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
              style={{
                color: getIntensityColor(storm.intensity),
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
