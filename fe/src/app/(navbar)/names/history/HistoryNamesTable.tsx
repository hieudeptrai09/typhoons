import { COUNTRY_FLAG_COMPONENTS } from "../../../../constants";
import type { TyphoonName } from "../../../../types";

interface HistoryNamesTableProps {
  names: TyphoonName[];
  onCellClick: (position: number, positionNames: TyphoonName[]) => void;
}

const HistoryNamesTable = ({ names, onCellClick }: HistoryNamesTableProps) => {
  const rows = 10;
  const cols = 14;

  const countryEntries = Object.entries(COUNTRY_FLAG_COMPONENTS);
  const columnWidth = `${100 / cols}%`;

  // Group names by position, excluding misspelling retirements (isLanguageProblem === 2)
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
            {countryEntries.map(([countryName, FlagComponent], index) => (
              <th key={index} className="border border-sky-300 bg-sky-600 p-2" title={countryName}>
                <div className="flex items-center justify-center">
                  <div className="h-7 w-10 overflow-hidden rounded border border-white/30 shadow-sm">
                    <FlagComponent className="h-full w-full object-cover" />
                  </div>
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
                      {positionNames.length === 0 ? (
                        <span className="text-xs text-gray-300">—</span>
                      ) : (
                        positionNames.map((name, idx) => {
                          const colorClass = name.isRetired ? "text-red-500" : "text-green-700";
                          return (
                            <div
                              key={idx}
                              className={`text-center text-xs leading-tight font-semibold ${colorClass}`}
                            >
                              {name.name}
                            </div>
                          );
                        })
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
