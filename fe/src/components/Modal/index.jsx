import { X } from "lucide-react";

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  wrapperClassName = "",
  titleClassName = "",
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-lg w-full max-h-[90vh] flex flex-col ${wrapperClassName}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start p-6 pb-4 shrink-0 border-b border-gray-300">
          <h2 className={`text-2xl font-bold text-gray-800 ${titleClassName}`}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};
