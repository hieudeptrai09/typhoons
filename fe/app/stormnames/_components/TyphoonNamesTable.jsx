const TyphoonNamesTable = ({ names, onNameClick }) => {
  const rows = 10;
  const cols = 14;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <tbody>
          {[...Array(rows)].map((_, row) => (
            <tr key={row}>
              {[...Array(cols)].map((_, col) => {
                const position = row * cols + col + 1;
                const dataNow = names.find((n) => n.position === position);

                return (
                  <td
                    key={col}
                    className="border border-sky-200 hover:bg-sky-200 p-0"
                  >
                    <button
                      onClick={() => dataNow && onNameClick(dataNow)}
                      className="w-full h-16 flex items-center justify-center transition-all"
                    >
                      <div className="text-sm font-semibold text-gray-700">
                        {dataNow?.name || ""}
                      </div>
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TyphoonNamesTable;
