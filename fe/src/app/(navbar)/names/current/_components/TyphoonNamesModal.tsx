import Image from "next/image";
import Modal from "../../../../../components/Modal";
import type { TyphoonName, BaseModalProps } from "../../../../../types";

interface TyphoonNameModalProps extends BaseModalProps {
  selectedName: TyphoonName;
}

const TyphoonNameModal = ({ isOpen, onClose, selectedName }: NameDetailsModalProps) => {
  const hasImage = !!selectedName.image;
  const hasDescription = !!selectedName.description;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={selectedName.name}
      maxWidth={hasImage ? 640 : 560}
      titleClassName="!text-3xl !text-blue-600"
    >
      <div>
        <div className={`flex gap-6 ${hasImage ? "flex-row" : "flex-col"}`}>
          <div className="flex-1 space-y-4">
            <p className="mt-1 leading-relaxed font-semibold text-indigo-700">
              {selectedName.meaning}
            </p>

            <div className="space-y-2 border-l-2 border-slate-200 pl-4">
              <div className="text-sm">
                <span className="font-medium text-slate-600">From:</span>
                <span className="ml-2 text-slate-700">{selectedName.country}</span>
              </div>
              <div className="text-sm">
                <span className="font-medium text-slate-600">Language:</span>
                <span className="ml-2 text-slate-700">{selectedName.language}</span>
              </div>
            </div>

            {!hasImage && hasDescription && (
              <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                <div className="mb-2 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                  Note
                </div>
                <p className="text-sm leading-relaxed text-slate-700">{selectedName.description}</p>
              </div>
            )}
          </div>

          {selectedName.image && (
            <div className="min-w-0 flex-1">
              <div className="sticky top-0">
                <div
                  className="relative overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
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
                {hasDescription && (
                  <p className="mt-3 text-center text-xs leading-relaxed text-slate-600 italic">
                    {selectedName.description}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default TyphoonNameModal;
