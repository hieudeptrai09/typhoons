import Image from "next/image";
import Modal from "../../../../../components/Modal";
import type { TyphoonName, BaseModalProps } from "../../../../../types";

interface NameDetailsModalProps extends BaseModalProps {
  selectedName: TyphoonName;
}

const NameDetailsModal = ({ isOpen, onClose, selectedName }: NameDetailsModalProps) => {
  const hasImage = !!selectedName.image;
  const hasDescription = !!selectedName.description;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={selectedName.name}
      maxWidth={hasImage ? 576 : 512}
      titleClassName={`!text-3xl ${
        Boolean(selectedName.isRetired)
          ? selectedName.isLanguageProblem === 2
            ? "!text-amber-500"
            : "!text-red-600"
          : "!text-blue-600"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="flex-1 space-y-3">
          <div>
            <span className="font-semibold text-gray-700">Meaning:</span>
            <span className="ml-2 text-gray-700">{selectedName.meaning}</span>
          </div>

          <div>
            <span className="font-semibold text-gray-700">Country:</span>
            <span className="ml-2 text-gray-700">{selectedName.country}</span>
          </div>

          <div>
            <span className="font-semibold text-gray-700">Language:</span>
            <span className="ml-2 text-gray-700">{selectedName.language}</span>
          </div>

          {!selectedName.image && selectedName.description && (
            <div>
              <span className="font-semibold text-gray-700">Description:</span>
              <span className="ml-2 text-gray-700">{selectedName.description}</span>
            </div>
          )}
        </div>

        {selectedName.image && (
          <div className={`flex flex-1 flex-col gap-2 ${!hasDescription && "self-end"}`}>
            <div
              className="relative flex max-h-3/4 justify-center rounded-lg bg-gray-50"
              style={{ aspectRatio: "4/3" }}
            >
              <Image
                src={selectedName.image}
                alt={selectedName.name}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
            {selectedName.description && (
              <p className="text-center text-xs text-gray-700 italic">{selectedName.description}</p>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default NameDetailsModal;
