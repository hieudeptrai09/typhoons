import type { CSSProperties } from "react";
import Image from "next/image";
import Modal from "../Modal";
import type { TyphoonName, RetiredName, BaseModalProps } from "../../types";

interface NameDetailModalProps extends BaseModalProps {
  name: TyphoonName | RetiredName;
  titleColor?: string;
  titleClassName?: string;
}

const NameDetailModal = ({
  isOpen,
  onClose,
  name,
  titleColor,
  titleClassName = "!text-3xl !text-blue-600",
}: NameDetailModalProps) => {
  const hasImage = !!name.image;
  const hasDescription = !!name.description;
  const maxWidth = hasImage ? 576 : 512;

  const titleStyle: CSSProperties | undefined = titleColor ? { color: titleColor } : undefined;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={name.name}
      maxWidth={maxWidth}
      titleClassName={titleClassName}
      titleStyle={titleStyle}
    >
      <div className="flex items-center gap-3">
        <div className="flex-1 space-y-3">
          <div>
            <span className="font-semibold text-gray-700">Meaning:</span>
            <span className="ml-2 text-gray-700">{name.meaning}</span>
          </div>

          <div>
            <span className="font-semibold text-gray-700">Country:</span>
            <span className="ml-2 text-gray-700">{name.country}</span>
          </div>

          <div>
            <span className="font-semibold text-gray-700">Language:</span>
            <span className="ml-2 text-gray-700">{name.language}</span>
          </div>

          {!name.image && name.description && (
            <div>
              <span className="font-semibold text-gray-700">Description:</span>
              <span className="ml-2 text-gray-700">{name.description}</span>
            </div>
          )}
        </div>

        {name.image && (
          <div className={`flex flex-1 flex-col gap-2 ${!hasDescription && "self-end"}`}>
            <div
              className="relative flex max-h-3/4 justify-center rounded-lg bg-gray-50"
              style={{ aspectRatio: "4/3" }}
            >
              <Image src={name.image} alt={name.name} fill className="object-contain" unoptimized />
            </div>
            {name.description && (
              <p className="text-center text-xs text-gray-700 italic">{name.description}</p>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default NameDetailModal;
