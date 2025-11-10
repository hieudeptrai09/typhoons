import GridCell from "./GridCell";

const GridRow = ({ rowIndex, cols, mode, highlightData = {} }) => {
  return (
    <tr>
      {[...Array(cols)].map((_, col) => {
        const position = rowIndex * cols + col + 1;
        const key = `${position}`;
        const highlightInfo = highlightData[key];

        return <GridCell key={col} mode={mode} highlightInfo={highlightInfo} />;
      })}
    </tr>
  );
};

export default GridRow;
