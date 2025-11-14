import { X } from "lucide-react";

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  wrapperClassName = "", // Now explicit for each modal
  specialStyles = null, // For special cases like TyphoonNameModal
}) => {
  if (!isOpen) return null;

  // Default styles that can be overridden
  const styles = {
    titleClassName: "",
    ...specialStyles,
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-lg shadow-2xl w-full ${wrapperClassName}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start p-6 pb-4 border-b border-gray-300">
          <h2
            className={`text-2xl font-bold text-gray-800 ${styles.titleClassName}`}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};
