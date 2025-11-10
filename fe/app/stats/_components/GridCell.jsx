const GridCell = ({ mode, highlightInfo }) => {
  const getBackgroundColor = () => {
    if (!highlightInfo || highlightInfo.length === 0) return "";

    if (mode === "strongest") {
      return "bg-red-300";
    } else if (mode === "first") {
      return "bg-blue-300";
    }
    return "";
  };

  const getCellContent = () => {
    if (highlightInfo && highlightInfo.length > 0) {
      return (
        <div className="flex flex-col items-center justify-center gap-1">
          {highlightInfo.map((storm, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="font-bold text-xs text-gray-800">
                {storm.name}
              </div>
              <div className="text-[10px] text-gray-600">({storm.year})</div>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  const baseClasses = "relative w-24 h-24 p-2 border-2 border-sky-200";
  const bgClasses = getBackgroundColor();

  return (
    <td className={`${baseClasses} ${bgClasses}`}>
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center text-xs font-semibold text-gray-600">
          {getCellContent()}
        </div>
      </div>
    </td>
  );
};

export default GridCell;
