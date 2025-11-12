export const GridCell = ({
  position,
  onClick,
  content,
  highlighted,
  highlightType,
  showPosition = true,
  isClickable = true,
}) => {
  const getHighlightColor = () => {
    if (!highlighted) return "";
    if (highlightType === "strongest") return "bg-red-300";
    if (highlightType === "first") return "bg-blue-300";
    return "bg-yellow-200";
  };

  const displayContent = () => {
    if (content) return content;
    if (showPosition) return `#${position}`;
    return null;
  };

  const handleClick = () => {
    if (isClickable) {
      onClick();
    }
  };

  return (
    <td
      className={`relative w-24 h-24 border-2 border-sky-200 ${
        isClickable ? "cursor-pointer hover:bg-sky-200" : "cursor-default"
      } ${getHighlightColor()}`}
      onClick={handleClick}
    >
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center text-xs font-semibold text-gray-600">
          {displayContent()}
        </div>
      </div>
    </td>
  );
};
