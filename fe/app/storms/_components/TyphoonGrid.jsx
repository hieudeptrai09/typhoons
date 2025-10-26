const TyphoonGrid = ({ onCellClick }) => {
  const rows = 10;
  const cols = 14;

  return (
    <div className="overflow-x-auto">
      <table className="border-collapse mx-auto">
        <tbody>
          {[...Array(rows)].map((_, row) => (
            <tr key={row}>
              {[...Array(cols)].map((_, col) => {
                const position = row * cols + col + 1;
                const key = `${position}`;

                return (
                  <td
                    key={col}
                    className="relative w-24 h-24 border-2 border-sky-200 hover:bg-sky-200 cursor-pointer"
                    onClick={() => onCellClick(key)}
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center text-xs font-semibold text-gray-600">
                        #{position}
                      </div>
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-evenly">
        <button
          onClick={() => onCellClick("141")}
          className="relative w-24 h-24 border-2 border-sky-200 hover:bg-sky-200 cursor-pointer text-center text-xs font-semibold text-gray-600"
        >
          CPHC
        </button>
        <button
          onClick={() => onCellClick("142")}
          className="relative w-24 h-24 border-2 border-sky-200 hover:bg-sky-200 cursor-pointer text-center text-xs font-semibold text-gray-600"
        >
          NHC
        </button>
      </div>
    </div>
  );
};

export default TyphoonGrid;
