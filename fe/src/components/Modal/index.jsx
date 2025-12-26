import { useEffect } from "react";
import { X } from "lucide-react";

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  wrapperClassName = "",
  titleClassName = "",
  titleStyle = {},
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className={`flex max-h-[90vh] w-full flex-col rounded-lg bg-white ${wrapperClassName}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between border-b border-gray-300 p-6 pb-4">
          <h2 className={`text-2xl font-bold text-gray-800 ${titleClassName}`} style={titleStyle}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className="-mt-2 -mr-2 flex h-11 w-11 items-center justify-center text-gray-500 hover:rounded-full hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <div className="overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
};
