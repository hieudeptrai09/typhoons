import GridCell from "./GridCell";

const StormGrid = ({
  cellData,
  onCellClick,
  highlightType = "",
  isClickable = true,
  isAverageView = false,
  stormsData = [],
}) => {
  const rows = 10;
  const cols = 14;

  // Helper function to get storm names for a position
  const getStormNamesForPosition = (position) => {
    if (!stormsData || stormsData.length === 0) return [];

    const storms = stormsData.filter((storm) => storm.position === position);

    // Get unique storm names
    const uniqueNames = [...new Set(storms.map((storm) => storm.name))];
    return uniqueNames;
  };

  // Calculate equal width for each column (100% / 14 columns)
  const columnWidth = `${100 / cols}%`;

  return (
    <div className="overflow-x-auto">
      <table className="mx-auto min-w-full border-collapse">
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
                const data = cellData[position];
                const stormNames = getStormNamesForPosition(position);

                return (
                  <GridCell
                    key={col}
                    onClick={() => onCellClick(position, "position")}
                    content={data?.content || ""}
                    highlight={data?.highlighted ? highlightType : ""}
                    isClickable={isClickable}
                    isAverageView={isAverageView}
                    avgNumber={data?.avgNumber}
                    stormNames={stormNames}
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

export default StormGrid;
