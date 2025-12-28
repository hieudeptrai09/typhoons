import Image from "next/image";
import Modal from "../../../../../components/Modal";

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
        Boolean(selectedName.isRetired)
          ? selectedName.isLanguageProblem === 2
            ? "!text-amber-500"
            : "!text-red-600"
          : "!text-blue-600"
      }`}
    >
      <div className="flex items-center gap-6">
        <div className="flex-1 space-y-3">
          <div>
            <span className="font-semibold text-gray-700">Meaning:</span>
            <span className="ml-2 text-gray-600">{selectedName.meaning}</span>
          </div>

          <div>
            <span className="font-semibold text-gray-700">Country:</span>
            <span className="ml-2 text-gray-600">{selectedName.country}</span>
          </div>

          <div>
            <span className="font-semibold text-gray-700">Language:</span>
            <span className="ml-2 text-gray-600">{selectedName.language}</span>
          </div>
        </div>

        <div
          className={`flex flex-col gap-2 ${
            hasDescription || hasImage ? "flex-1" : "w-0"
          } ${!hasDescription && "self-end"}`}
        >
          <div className={`relative flex max-h-72 justify-center ${getImageVisibility()}`}>
            {hasImage && (
              <Image
                src={selectedName.image}
                alt={selectedName.name}
                width={400}
                height={288}
                className="rounded-lg object-cover shadow-md"
                unoptimized
              />
            )}
          </div>
          <p className="text-center text-xs text-gray-700 italic">
            {selectedName.description || ""}
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default NameDetailsModal;
