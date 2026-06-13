import { COUNTRY_FLAG_COMPONENTS, TEXT_COLOR_WHITE_BACKGROUND } from "../../../../../constants";
import { getIntensityFromNumber, calculateAverage } from "../../_utils/fns";
import type { Storm } from "../../../../../types";

interface StormNameGridProps {
  stormsData: Storm[];
  onCellClick: (data: number | string, key: string) => void;
  /** When provided, colors each name by its average intensity */
  averageValues?: Record<string, number>;
}

const StormNameGrid = ({ stormsData, onCellClick, averageValues }: StormNameGridProps) => {
  const rows = 10;
  const cols = 14;
  const columnWidth = `${100 / cols}%`;

  const stormsByPosition = stormsData.reduce<Record<number, Storm[]>>((acc, storm) => {
    if (!acc[storm.position]) acc[storm.position] = [];
    acc[storm.position].push(storm);
    return acc;
  }, {});

  const getPositionNames = (position: number): { name: string; color: string }[] => {
    const storms = stormsByPosition[position] || [];
    if (storms.length === 0) return [];

    const nameMap = storms.reduce<Record<string, Storm[]>>((acc, s) => {
      if (!acc[s.name]) acc[s.name] = [];
      acc[s.name].push(s);
      return acc;
    }, {});

    return Object.entries(nameMap)
      .sort(([, aStorms], [, bStorms]) => {
        const aFirst = Math.min(...aStorms.map((s) => s.year));
        const bFirst = Math.min(...bStorms.map((s) => s.year));
        return aFirst - bFirst;
      })
      .map(([name, nameStorms]) => {
        let color = "#374151"; // gray-700 default (storms mode)
        if (averageValues) {
          const avg = averageValues[name] ?? calculateAverage(nameStorms);
          color = TEXT_COLOR_WHITE_BACKGROUND[getIntensityFromNumber(avg)];
        }
        return { name, color };
      });
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <colgroup>
          {[...Array(cols)].map((_, idx) => (
            <col key={idx} style={{ width: columnWidth }} />
          ))}
        </colgroup>
        <tbody>
          {[...Array(rows)].map((_, row) => (
            <tr key={row}>
              {[...Array(cols)].map((_, col) => {
                const position = row * cols + col + 1;
                const names = getPositionNames(position);

                return (
                  <td key={col} className="border border-stone-300 p-0">
                    <div className="flex min-h-16 w-full flex-col items-center justify-center gap-0.5 px-1 py-1">
                      {names.length === 0 ? (
                        <span className="text-xs text-gray-300">—</span>
                      ) : (
                        names.map(({ name, color }, idx) => (
                          <button
                            key={idx}
                            onClick={() => onCellClick(name, "name")}
                            className="cursor-pointer text-center text-xs leading-tight font-semibold hover:underline"
                            style={{ color, background: "none", border: "none", padding: 0 }}
                          >
                            {name}
                          </button>
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

export default StormNameGrid;
