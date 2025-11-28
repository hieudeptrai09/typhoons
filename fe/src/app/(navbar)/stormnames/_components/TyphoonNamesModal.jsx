import { Modal } from "../../../../components/Modal";

const TyphoonNameModal = ({ selectedName, onClose }) => {
  if (!selectedName) return null;

  return (
    <Modal
      isOpen={!!selectedName}
      onClose={onClose}
      title={selectedName.name}
      wrapperClassName="max-w-lg"
      specialStyles={{
        titleClassName: "!text-3xl !text-blue-600",
      }}
    >
      <div className="flex gap-6 items-center">
        <div className="flex-1 space-y-3">
          <div>
            <span className="font-semibold text-gray-700">Meaning:</span>
            <span className="text-gray-600 ml-2">{selectedName.meaning}</span>
          </div>

          <div>
            <span className="font-semibold text-gray-700">Country:</span>
            <span className="text-gray-600 ml-2">{selectedName.country}</span>
          </div>

          <div>
            <span className="font-semibold text-gray-700">Language:</span>
            <span className="text-gray-600 ml-2">{selectedName.language}</span>
          </div>
        </div>

        <div className="shrink-0">
          <img
            src={selectedName.image}
            alt={selectedName.name}
            title={selectedName.description}
            className={`w-36 h-28 object-cover rounded-lg shadow-md ${
              selectedName.image ? "block" : "hidden"
            }`}
          />
        </div>
      </div>
    </Modal>
  );
};

export default TyphoonNameModal;
