export const GridCell = ({ position, onClick, content, highlighted }) => {
  return (
    <td
      className={`relative w-24 h-24 border-2 border-sky-200 cursor-pointer hover:bg-sky-200 ${
        highlighted ? "bg-yellow-200" : ""
      }`}
      onClick={onClick}
    >
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center text-xs font-semibold text-gray-600">
          {content}
        </div>
      </div>
    </td>
  );
};
