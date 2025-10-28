import GridTable from "./GridComponents/GridTable";
import SpecialButtons from "./GridComponents/SpecialButtons";

const TyphoonGrid = ({ onCellClick, mode = "normal", highlightData = {} }) => {
  const rows = 10;
  const cols = 14;

  return (
    <div>
      <GridTable
        rows={rows}
        cols={cols}
        onCellClick={onCellClick}
        mode={mode}
        highlightData={highlightData}
      />
      {mode === "normal" && <SpecialButtons onCellClick={onCellClick} />}
    </div>
  );
};

export default TyphoonGrid;
