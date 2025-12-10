const TyphoonNamesTable = ({ names, onNameClick }) => {
  const rows = 10;
  const cols = 14;

  // Country names for each column (based on WMO typhoon naming convention)
  const countries = [
    "Cambodia",
    "China",
    "North Korea",
    "Hong Kong",
    "Japan",
    "Laos",
    "Macao",
    "Malaysia",
    "Micronesia",
    "Philippines",
    "South Korea",
    "Thailand",
    "USA",
    "Vietnam",
  ];

  // Calculate equal width for each column (100% / 14 columns)
  const columnWidth = `${100 / cols}%`;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <colgroup>
          {[...Array(cols)].map((_, idx) => (
            <col key={idx} style={{ width: columnWidth }} />
          ))}
        </colgroup>
        <thead>
          <tr>
            {countries.map((country, index) => (
              <th
                key={index}
                className="border border-sky-300 bg-sky-600 text-white font-semibold p-2 text-sm"
              >
                {country}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(rows)].map((_, row) => (
            <tr key={row}>
              {[...Array(cols)].map((_, col) => {
                const position = row * cols + col + 1;
                const dataNow = names.find(
                  (n) => n.position === String(position)
                );

                return (
                  <td
                    key={col}
                    className="border border-stone-300 hover:bg-stone-200 p-2"
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
