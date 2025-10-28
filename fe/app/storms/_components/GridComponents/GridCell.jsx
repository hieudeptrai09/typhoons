const GridCell = ({ position, onClick, mode = "normal", highlightInfo }) => {
  const getBackgroundColor = () => {
    if (!highlightInfo) return "";

    if (mode === "strongest") {
      return "bg-red-300";
    } else if (mode === "first") {
      return "bg-blue-300";
    }
    return "";
  };

  const getCellContent = () => {
    if (mode === "normal") {
      return `#${position}`;
    }

    // For strongest and first modes, only show content if highlighted
    if (highlightInfo) {
      return (
        <div className="flex flex-col items-center justify-center">
          <div className="font-bold text-xs">{highlightInfo.name}</div>
          <div className="text-[10px]">({highlightInfo.year})</div>
        </div>
      );
    }

    return null;
  };

  const baseClasses = "relative w-24 h-24 border-2 border-sky-200";
  const interactionClasses =
    mode === "normal" ? "cursor-pointer hover:bg-sky-200" : "";
  const bgClasses = getBackgroundColor();

  const handleClick = () => {
    // Only allow clicks in normal mode
    if (mode === "normal") {
      onClick();
    }
  };

  return (
    <td
      className={`${baseClasses} ${interactionClasses} ${bgClasses}`}
      onClick={handleClick}
    >
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center text-xs font-semibold text-gray-600">
          {getCellContent()}
        </div>
      </div>
    </td>
  );
};

export default GridCell;
