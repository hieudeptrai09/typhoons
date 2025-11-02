const GridCell = ({ position, onClick }) => {
  return (
    <td
      className="relative w-24 h-24 p-2 border-2 border-sky-200 hover:bg-sky-200 cursor-pointer"
      onClick={onClick}
    >
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center text-xs font-semibold text-gray-600">
          #{position}
        </div>
      </div>
    </td>
  );
};

export default GridCell;
