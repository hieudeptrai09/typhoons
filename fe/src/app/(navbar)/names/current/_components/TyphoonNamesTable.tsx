import type { TyphoonName } from "../../../../../types";

interface TyphoonNamesTableProps {
  names: TyphoonName[];
  onNameClick: (name: TyphoonName) => void;
}

const TyphoonNamesTable = ({ names, onNameClick }: TyphoonNamesTableProps) => {
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

  // Sort names by position to ensure correct ordering
  const sortedNames = names.sort((a, b) => a.position - b.position);

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
                className="border border-sky-300 bg-sky-600 p-2 text-sm font-semibold text-white"
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
                const position = row * cols + col;
                const typhoon = sortedNames[position];

                return (
                  <td key={col} className="border border-stone-300 p-2 hover:bg-stone-200">
                    <button
                      onClick={() => onNameClick(typhoon)}
                      className="flex h-16 w-full items-center justify-center transition-all"
                    >
                      <div className="text-sm font-semibold text-gray-700">{typhoon.name}</div>
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
