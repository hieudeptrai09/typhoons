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
      className={`relative border-2 border-stone-200 p-2 ${
        isClickable ? "cursor-pointer hover:bg-stone-200" : "cursor-default"
      } ${className}`}
      onClick={handleClick}
    >
      {viewType !== "highlights" && stormNames.length > 0 && (
        <div className="absolute top-0 text-[7px] text-stone-100">{stormNames.join(", ")}</div>
      )}
      <div className="relative z-2 flex h-16 w-full items-center justify-center">{content}</div>
    </td>
  );
};

export default GridCell;
