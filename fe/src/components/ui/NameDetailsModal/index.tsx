import { Modal } from "antd";
import CountryFlag from "../../../components/components/CountryFlag";
import { getNameStatusColorClass } from "../../colors";
import ImageWithLoader from "../../components/ImageWithLoader";
import type { TyphoonName, RetiredName, BaseModalProps } from "../../../types";

interface NameDetailsModalProps extends BaseModalProps {
  name: TyphoonName | RetiredName;
}

const NameDetailsContent = ({ name }: { name: TyphoonName | RetiredName }) => {
  const hasImage = !!name.image;
  const hasDescription = !!name.description;

  return (
    <div className={`flex gap-6 ${hasImage ? "flex-row" : "flex-col"}`}>
      <div className="flex-1 space-y-4">
        <div>
          <div id="name-meaning-label" className="text-sm font-medium text-slate-500">
            Meaning
          </div>
          <p
            className="mt-1 text-base leading-relaxed font-semibold text-teal-600 italic"
            aria-describedby="name-meaning-label"
          >
            {name.meaning}
          </p>
        </div>

        <div className="border-t border-slate-200 pt-3">
          <div id="name-origin-label" className="mb-2 text-sm font-medium text-slate-500">
            Origin
          </div>
          <div className="flex items-center gap-3" aria-describedby="name-origin-label">
            <CountryFlag country={name.country} className="h-8 w-12" />
            <div className="text-base font-semibold text-slate-800">{name.country}</div>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-3">
          <div id="name-language-label" className="text-sm font-medium text-slate-500">
            Language
          </div>
          <div className="mt-1 text-base text-slate-700" aria-describedby="name-language-label">
            {name.language}
          </div>
        </div>

        {"replacementName" in name && name.replacementName && (
          <div className="border-t border-slate-200 pt-3">
            <div className="text-sm font-medium text-slate-500">Replaced by</div>
            <div className="mt-1 text-base font-semibold text-teal-600">{name.replacementName}</div>
          </div>
        )}

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
              <ImageWithLoader
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
  );
};

const NameDetailsModal = ({ isOpen, onClose, name }: NameDetailsModalProps) => {
  const titleColorClass = getNameStatusColorClass(name);

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      width={560}
      footer={null}
      centered
      destroyOnHidden
      aria-label={`Details for ${name.name}`}
      styles={{
        header: { borderBottom: "1px solid #9ca3af", paddingBottom: "12px" },
        body: { maxHeight: "70vh", overflowY: "auto" },
      }}
      title={<span className={`text-2xl font-bold ${titleColorClass}`}>{name.name}</span>}
    >
      <div className="pt-4">
        <NameDetailsContent name={name} />
      </div>
    </Modal>
  );
};

export { NameDetailsContent };
export default NameDetailsModal;
