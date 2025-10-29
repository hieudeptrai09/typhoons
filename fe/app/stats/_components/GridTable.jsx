import GridRow from "./GridRow";

const GridTable = ({ rows, cols, mode, highlightData = {} }) => {
  return (
    <div className="overflow-x-auto">
      <table className="border-collapse mx-auto">
        <tbody>
          {[...Array(rows)].map((_, row) => (
            <GridRow
              key={row}
              rowIndex={row}
              cols={cols}
              mode={mode}
              highlightData={highlightData}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GridTable;
