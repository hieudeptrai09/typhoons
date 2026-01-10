import { useEffect } from "react";
import type { ReactNode, CSSProperties } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: number;
  height?: number;
  titleClassName?: string;
  titleStyle?: CSSProperties;
}

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 672, // default: 42rem (max-w-2xl equivalent)
  height,
  titleClassName = "",
  titleStyle = {},
}: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      const isDesktop = window.innerWidth >= 768; // md breakpoint
      const hasScrollbar = window.innerWidth > document.documentElement.clientWidth;

      document.body.style.overflow = "hidden";

      if (isDesktop && hasScrollbar) {
        document.body.style.paddingRight = "15px";
      }
    }

    return () => {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const modalStyle: CSSProperties = {
    maxWidth: `${maxWidth}px`,
    ...(height && { height: `${height}px` }),
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full flex-col rounded-lg bg-white"
        style={modalStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between border-b border-gray-300 p-6 pb-4">
          <h2 className={`text-2xl font-bold text-gray-700 ${titleClassName}`} style={titleStyle}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className="-mt-2 -mr-2 flex h-11 w-11 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <div className="flex flex-1 flex-col overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
