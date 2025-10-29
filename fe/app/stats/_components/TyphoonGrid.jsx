import GridTable from "./GridTable";

const TyphoonGrid = ({ mode, highlightData = {} }) => {
  const rows = 10;
  const cols = 14;

  return (
    <div>
      <GridTable
        rows={rows}
        cols={cols}
        mode={mode}
        highlightData={highlightData}
      />
    </div>
  );
};

export default TyphoonGrid;
