import GridCell from "./GridCell";

const GridRow = ({
  rowIndex,
  cols,
  onCellClick,
  mode = "normal",
  highlightData = {},
}) => {
  return (
    <tr>
      {[...Array(cols)].map((_, col) => {
        const position = rowIndex * cols + col + 1;
        const key = `${position}`;
        const highlightInfo = highlightData[key];

        return (
          <GridCell
            key={col}
            position={position}
            onClick={() => onCellClick(key)}
            mode={mode}
            highlightInfo={highlightInfo}
          />
        );
      })}
    </tr>
  );
};

export default GridRow;
