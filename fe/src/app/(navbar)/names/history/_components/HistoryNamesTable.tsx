import PositionGrid from "../../../../../components/components/PositionGrid";
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
  const namesByPosition: Record<number, TyphoonName[]> = {};
  names.forEach((name) => {
    if (name.isLanguageProblem === 2) return;
    if (!namesByPosition[name.position]) {
      namesByPosition[name.position] = [];
    }
    namesByPosition[name.position].push(name);
  });

  return (
    <PositionGrid
      renderCell={(position, _row, col) => {
        const positionNames = namesByPosition[position] || [];
        const count = positionNames.length;
        const textColorClass = getCellTextColor(count);

        return (
          <td
            key={col}
            className="cursor-pointer border border-stone-300 p-0 hover:bg-stone-200"
            role="button"
            tabIndex={0}
            aria-label={`Position ${position}, ${count} name${count !== 1 ? "s" : ""}`}
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
      }}
    />
  );
};

export default HistoryNamesTable;
