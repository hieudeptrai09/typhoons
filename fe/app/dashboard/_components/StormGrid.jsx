import { GridCell } from "./GridCell";

export const StormGrid = ({
  cellData,
  onCellClick,
  highlightType,
  isClickable = true,
  isAverageView = false,
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
                const content =
                  data !== undefined ? data.content : `#${position}`;

                return (
                  <GridCell
                    key={col}
                    onClick={() => onCellClick(position, "position")}
                    content={content}
                    highlighted={data?.highlighted}
                    highlightType={highlightType}
                    isClickable={isClickable}
                    isAverageView={isAverageView}
                    avgNumber={data?.avgNumber}
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
