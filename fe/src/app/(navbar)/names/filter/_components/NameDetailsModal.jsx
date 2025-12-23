import { Modal } from "../../../../../components/Modal";

const NameDetailsModal = ({ selectedName, onClose }) => {
  if (!selectedName) return null;

  const hasImage = selectedName.image;
  const hasDescription = selectedName.description;

  // Determine image visibility: hidden if no src and no description, invisible if no src but has description
  const getImageVisibility = () => {
    if (!hasImage && !hasDescription) return "hidden";
    if (!hasImage && hasDescription) return "invisible";
    return "";
  };

  return (
    <Modal
      isOpen={!!selectedName}
      onClose={onClose}
      title={selectedName.name}
      wrapperClassName={hasImage ? "max-w-xl" : "max-w-lg"}
      titleClassName={`!text-3xl ${
        Boolean(Number(selectedName.isRetired))
        ? (Number(selectedName.isLanguageProblem) === 2 
           ? "!text-amber-500" 
           : "!text-red-600") 
        : "!text-blue-600"
      }`}
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

        <div
          className={`flex flex-col gap-2 ${
            hasDescription || hasImage ? "flex-1" : "w-0"
          } ${!hasDescription && "self-end"}`}
        >
          <div className="flex justify-center">
            <img
              src={selectedName.image || ""}
              alt={selectedName.name}
              className={`object-cover rounded-lg shadow-md max-h-72 ${getImageVisibility()}`}
            />
          </div>
          <p className="text-xs text-gray-700 italic text-center">
            {selectedName.description || ""}
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default NameDetailsModal;
