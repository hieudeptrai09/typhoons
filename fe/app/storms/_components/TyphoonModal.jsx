import { Modal } from "../../../components/Modal";
import IntensityBadge from "../../../components/IntensityBadge";

const getIntensityTextColorForWhiteBg = (intensity) => {
  switch (intensity) {
    case "TD":
      return "#0099CC";
    case "TS":
      return "#00AA00";
    case "STS":
      return "#009900";
    case "1":
      return "#CC9900";
    case "2":
      return "#CC8800";
    case "3":
      return "#CC4400";
    case "4":
      return "#CC0000";
    case "5":
      return "#990099";
    default:
      return "#333333";
  }
};

const TyphoonModal = ({ selectedCell, history, onClose }) => {
  return (
    <Modal
      isOpen={!!selectedCell}
      onClose={onClose}
      title={`#${selectedCell}`}
      wrapperClassName="max-w-md"
    >
      <div className="flex gap-1.5 flex-col">
        {history.map((storm, index) => (
          <div key={index} className="flex items-center">
            <IntensityBadge intensity={storm.intensity} />
            <span
              style={{
                color: getIntensityTextColorForWhiteBg(storm.intensity),
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

export default TyphoonModal;
