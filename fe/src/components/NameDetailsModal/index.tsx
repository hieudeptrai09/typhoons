import Image from "next/image";
import Modal from "../Modal";
import type { TyphoonName, RetiredName, BaseModalProps } from "../../types";

interface NameDetailsModalProps extends BaseModalProps {
  name: TyphoonName | RetiredName;
}

const NameDetailsModal = ({ isOpen, onClose, name }: NameDetailsModalProps) => {
  const hasImage = !!name.image;
  const hasDescription = !!name.description;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={name.name}
      maxWidth={hasImage ? 640 : 560}
      titleClassName={`${
        Boolean(name.isRetired)
          ? name.isLanguageProblem === 2
            ? "!text-amber-500"
            : "!text-red-600"
          : "!text-blue-600"
      }`}
    >
      <div>
        <div className={`flex gap-6 ${hasImage ? "flex-row" : "flex-col"}`}>
          <div className="flex-1 space-y-4">
            <p className="mt-1 leading-relaxed font-semibold text-teal-600">{name.meaning}</p>

            <div className="space-y-2 border-l-2 border-slate-200 pl-4">
              <div className="text-sm">
                <span className="font-medium text-slate-600">From:</span>
                <span className="ml-2 text-slate-700">{name.country}</span>
              </div>
              <div className="text-sm">
                <span className="font-medium text-slate-600">Language:</span>
                <span className="ml-2 text-slate-700">{name.language}</span>
              </div>
            </div>

            {!hasImage && hasDescription && (
              <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                <div className="mb-2 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                  Note
                </div>
                <p className="text-sm leading-relaxed text-slate-700">{name.description}</p>
              </div>
            )}
          </div>

          {name.image && (
            <div className="min-w-0 flex-1">
              <div className="sticky top-0">
                <div
                  className="relative overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
                  style={{ aspectRatio: "4/3" }}
                >
                  <Image
                    src={name.image}
                    alt={name.name}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
                {hasDescription && (
                  <p className="mt-3 text-center text-xs leading-relaxed text-slate-600 italic">
                    {name.description}
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

export default NameDetailsModal;
