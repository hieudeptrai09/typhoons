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
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      aria-label={stormNames.length > 0 ? `View storms: ${stormNames.join(", ")}` : undefined}
      title={viewType !== "highlights" && stormNames.length > 0 ? stormNames.join(", ") : ""}
    >
      {viewType !== "highlights" && stormNames.length > 0 && (
        // Per owner review (audit_ui/findings/02_storms_dashboard.md, "Hidden
        // Ctrl+F text"): this near-zero-contrast text (stone-100 on white
        // ~1.09:1, matched to stone-200 on hover so it stays invisible) is
        // INTENTIONAL — it makes storm names findable via the browser's
        // Ctrl+F/find-in-page over an otherwise all-graphical grid. Not a
        // WCAG bug to fix. Owner-endorsed robustness tweak (not yet applied):
        // swap to `text-transparent` + `aria-hidden="true"` + `select-none
        // pointer-events-none`, which stays invisible on any background/theme
        // without needing the text/hover colors kept in sync with the cell bg.
        <div className="absolute top-0 text-[7px] text-stone-100 group-hover:text-stone-200">
          {stormNames.join(", ")}
        </div>
      )}
      <div className="relative z-2 flex h-16 w-full items-center justify-center">{content}</div>
    </td>
  );
};

export default GridCell;
