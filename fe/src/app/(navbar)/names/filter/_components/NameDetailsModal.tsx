import Image from "next/image";
import { FileText, Globe, Languages } from "lucide-react";
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
      <div className="space-y-3">
        <div className="mb-3 font-semibold text-indigo-700">{selectedName.meaning}</div>
        <div className="flex items-start gap-3">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-emerald-700" />
              <span className="text-gray-700">{selectedName.country}</span>
            </div>

            <div className="flex items-center gap-2">
              <Languages className="h-4 w-4 text-emerald-700" />
              <span className="text-gray-700">{selectedName.language}</span>
            </div>

            {!hasImage && hasDescription && (
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-emerald-700" />
                <p className="text-gray-700">{selectedName.description}</p>
              </div>
            )}
          </div>

          {selectedName.image && (
            <div className="flex flex-1 flex-col gap-2">
              <div
                className="relative flex max-h-3/4 w-full items-start justify-center rounded-lg bg-gray-50"
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
                <p className="text-center text-xs text-gray-700 italic">
                  {selectedName.description}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default NameDetailsModal;
