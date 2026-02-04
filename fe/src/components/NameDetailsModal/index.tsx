import Image from "next/image";
import Modal from "../Modal";
import { COUNTRY_FLAG_COMPONENTS } from "../../constants";
import type { TyphoonName, RetiredName, BaseModalProps } from "../../types";

interface NameDetailsModalProps extends BaseModalProps {
  name: TyphoonName | RetiredName;
}

const NameDetailsModal = ({ isOpen, onClose, name }: NameDetailsModalProps) => {
  const hasImage = !!name.image;
  const hasDescription = !!name.description;
  const FlagComponent = COUNTRY_FLAG_COMPONENTS[name.country];

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
      {() => (
        <div>
          <div className={`flex gap-6 ${hasImage ? "flex-row" : "flex-col"}`}>
            <div className="flex-1 space-y-4">
              <div>
                <div className="text-sm font-medium text-slate-500">Meaning</div>
                <p className="mt-1 text-base leading-relaxed font-semibold text-teal-600 italic">
                  {name.meaning}
                </p>
              </div>

              <div className="border-t border-slate-200 pt-3">
                <div className="mb-2 text-sm font-medium text-slate-500">Origin</div>
                <div className="flex items-center gap-3">
                  {FlagComponent && (
                    <div className="h-8 w-12 overflow-hidden rounded border border-slate-300 shadow-sm">
                      <FlagComponent className="h-full w-full object-cover" />
                    </div>
                  )}
                  <div className="text-base font-semibold text-slate-800">{name.country}</div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-3">
                <div className="text-sm font-medium text-slate-500">Language</div>
                <div className="mt-1 text-base text-slate-700">{name.language}</div>
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
      )}
    </Modal>
  );
};

export default NameDetailsModal;
