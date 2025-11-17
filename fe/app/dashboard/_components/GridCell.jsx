export const GridCell = ({
  onClick,
  content,
  highlighted,
  highlightType,
  isClickable = true,
}) => {
  const getHighlightColor = () => {
    if (!highlighted) return "";
    if (highlightType === "strongest") return "bg-red-300";
    if (highlightType === "first") return "bg-blue-300";
    return "bg-yellow-200";
  };

  const handleClick = () => {
    if (isClickable) {
      onClick();
    }
  };

  return (
    <td
      className={`relative w-full h-16 border-2 border-sky-200 p-2 ${
        isClickable ? "cursor-pointer hover:bg-sky-200" : "cursor-default"
      } ${getHighlightColor()}`}
      onClick={handleClick}
    >
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center text-xs font-semibold text-gray-600">
          {content}
        </div>
      </div>
    </td>
  );
};
