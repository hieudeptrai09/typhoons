import { GridCell } from "./GridCell";

export const StormGrid = ({
  cellData,
  onCellClick,
  highlightType,
  showPosition = true,
  isClickable = true,
}) => {
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
                const data = cellData[position];
                return (
                  <GridCell
                    key={col}
                    position={position}
                    onClick={() => onCellClick(position)}
                    content={data?.content}
                    highlighted={data?.highlighted}
                    highlightType={highlightType}
                    showPosition={showPosition}
                    isClickable={isClickable}
                  />
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
