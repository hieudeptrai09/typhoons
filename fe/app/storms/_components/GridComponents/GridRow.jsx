import GridCell from "./GridCell";

const GridRow = ({ rowIndex, cols, onCellClick }) => {
  return (
    <tr>
      {[...Array(cols)].map((_, col) => {
        const position = rowIndex * cols + col + 1;
        const key = `${position}`;

        return (
          <GridCell
            key={col}
            position={position}
            onClick={() => onCellClick(key)}
          />
        );
      })}
    </tr>
  );
};

export default GridRow;
