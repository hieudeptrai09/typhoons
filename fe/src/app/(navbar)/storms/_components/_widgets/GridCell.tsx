import { onEnterKeyDown } from "@/lib/utils/a11y";
import type { ReactNode } from "react";

interface GridCellProps {
  onClick: () => void;
  content: ReactNode;
  className?: string;
  isClickable?: boolean;
  stormNames?: string[];
  viewType: "storms" | "average" | "highlights";
}

const GridCell = ({
  onClick,
  content,
  className = "",
  isClickable = true,
  stormNames = [],
  viewType,
}: GridCellProps) => {
  const handleClick = () => {
    if (isClickable) {
      onClick();
    }
  };

  return (
    <td
      className={`group relative border-2 border-stone-200 p-2 ${
        isClickable ? "cursor-pointer hover:bg-stone-200" : "cursor-default"
      } ${className}`}
      onClick={handleClick}
      onKeyDown={isClickable ? onEnterKeyDown(handleClick) : undefined}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      aria-label={stormNames.length > 0 ? `View storms: ${stormNames.join(", ")}` : undefined}
      title={viewType !== "highlights" && stormNames.length > 0 ? stormNames.join(", ") : ""}
    >
      {viewType !== "highlights" && stormNames.length > 0 && (
        <div
          className="absolute top-0 text-[7px] text-transparent select-none pointer-events-none"
          aria-hidden="true"
        >
          {stormNames.join(", ")}
        </div>
      )}
      <div className="relative z-2 flex min-h-16 w-full items-center justify-center">{content}</div>
    </td>
  );
};

export default GridCell;
