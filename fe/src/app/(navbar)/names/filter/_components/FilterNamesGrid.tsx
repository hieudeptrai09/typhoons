import { COUNTRY_FLAG_COMPONENTS } from "../../../../../constants";
import type { TyphoonName } from "../../../../../types";

interface FilterNamesGridProps {
  allNames: TyphoonName[];
  filteredNames: TyphoonName[];
  onNameClick: (name: TyphoonName) => void;
}

const FilterNamesGrid = ({ allNames, filteredNames, onNameClick }: FilterNamesGridProps) => {
  const rows = 10;
  const cols = 14;

  const countryEntries = Object.entries(COUNTRY_FLAG_COMPONENTS);
  const columnWidth = `${100 / cols}%`;

  const filteredIds = new Set(filteredNames.map((n) => n.id));

  // Group all names by position
  const namesByPosition = allNames.reduce<Record<number, TyphoonName[]>>((acc, name) => {
    if (!acc[name.position]) acc[name.position] = [];
    acc[name.position].push(name);
    return acc;
  }, {});

  const getNameColor = (name: TyphoonName): string => {
    if (name.isLanguageProblem === 2) return "text-amber-600";
    if (Boolean(name.isRetired)) return "text-red-700";
    return "text-green-800";
  };

  const getCellBg = (name: TyphoonName): string => {
    if (name.isLanguageProblem === 2) return "bg-amber-100";
    if (Boolean(name.isRetired)) return "bg-red-100";
    return "bg-emerald-100";
  };

  // green (0) > red (1) > amber (2)
  const getColorPriority = (name: TyphoonName): number => {
    if (!Boolean(name.isRetired)) return 0;
    if (name.isLanguageProblem === 2) return 2;
    return 1;
  };

  const getHighestPriorityName = (names: TyphoonName[]): TyphoonName =>
    names.reduce((best, current) =>
      getColorPriority(current) < getColorPriority(best) ? current : best,
    );

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
                const matchedNames = positionNames.filter((n) => filteredIds.has(n.id));
                const hasMatch = matchedNames.length > 0;

                // Cell color driven by highest priority match: green > red > amber
                const cellBg = hasMatch ? getCellBg(getHighestPriorityName(matchedNames)) : "";

                return (
                  <td key={col} className={`border border-stone-300 p-0 ${cellBg}`}>
                    <div className="flex min-h-16 w-full flex-col items-center justify-center gap-0.5 px-1 py-1">
                      {matchedNames.map((name) => (
                        <button
                          key={name.id}
                          onClick={() => onNameClick(name)}
                          className={`w-full text-center text-xs leading-tight font-semibold transition-colors hover:underline ${getNameColor(name)}`}
                        >
                          {name.name}
                        </button>
                      ))}
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

export default FilterNamesGrid;
