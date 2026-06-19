import CountryFlag from "../../../../../components/components/CountryFlag";
import { COUNTRY_FLAG_COMPONENTS } from "../../../../../components/components/CountryFlag";
import type { TyphoonName } from "../../../../../types";

interface HistoryNamesTableProps {
  names: TyphoonName[];
  onCellClick: (position: number, positionNames: TyphoonName[]) => void;
}

const getCellTextColor = (count: number): string => {
  switch (count) {
    case 1:
      return "text-green-600";
    case 2:
      return "text-blue-600";
    case 3:
      return "text-amber-600";
    case 4:
      return "text-red-600";
    default:
      return "text-purple-600";
  }
};

const HistoryNamesTable = ({ names, onCellClick }: HistoryNamesTableProps) => {
  const rows = 10;
  const cols = 14;

  const countryEntries = Object.entries(COUNTRY_FLAG_COMPONENTS);
  const columnWidth = `${100 / cols}%`;

  const namesByPosition: Record<number, TyphoonName[]> = {};
  names.forEach((name) => {
    if (name.isLanguageProblem === 2) return;
    if (!namesByPosition[name.position]) {
      namesByPosition[name.position] = [];
    }
    namesByPosition[name.position].push(name);
  });

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
            {countryEntries.map(([countryName], index) => (
              <th key={index} className="border border-sky-300 bg-sky-600 p-2" title={countryName}>
                <div className="flex items-center justify-center">
                  <CountryFlag country={countryName} className="h-7 w-10 border-white/30" />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(rows)].map((_, row) => (
            <tr key={row}>
              {[...Array(cols)].map((_, col) => {
                const position = row * cols + col + 1;
                const positionNames = namesByPosition[position] || [];
                const count = positionNames.length;
                const textColorClass = getCellTextColor(count);

                return (
                  <td
                    key={col}
                    className="cursor-pointer border border-stone-300 p-0 hover:bg-stone-200"
                    onClick={() =>
                      onCellClick(
                        position,
                        names.filter((n) => n.position === position),
                      )
                    }
                  >
                    <div className="flex min-h-16 w-full flex-col items-center justify-center gap-0.5 px-1 py-1">
                      {count === 0 ? (
                        <span className="text-xs text-gray-300">—</span>
                      ) : (
                        positionNames.map((name, idx) => (
                          <div
                            key={idx}
                            className={`text-center text-xs leading-tight font-semibold ${textColorClass}`}
                          >
                            {name.name}
                          </div>
                        ))
                      )}
                    </div>
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

export default HistoryNamesTable;
