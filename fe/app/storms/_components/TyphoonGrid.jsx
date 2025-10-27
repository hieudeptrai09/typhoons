import GridTable from "./GridComponents/GridTable";
import SpecialButtons from "./GridComponents/SpecialButtons";

const TyphoonGrid = ({ onCellClick }) => {
  const rows = 10;
  const cols = 14;

  return (
    <div>
      <GridTable rows={rows} cols={cols} onCellClick={onCellClick} />
      <SpecialButtons onCellClick={onCellClick} />
    </div>
  );
};

export default TyphoonGrid;
