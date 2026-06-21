import { Button } from "antd";
import PositionGrid from "../../../../../components/components/PositionGrid";
import type { TyphoonName } from "../../../../../types";

interface TyphoonNamesTableProps {
  names: TyphoonName[];
  onNameClick: (name: TyphoonName) => void;
}

const TyphoonNamesTable = ({ names, onNameClick }: TyphoonNamesTableProps) => {
  const sortedNames = names.sort((a, b) => a.position - b.position);

  return (
    <PositionGrid
      positionOffset={0}
      renderCell={(position, _row, col) => {
        const typhoon = sortedNames[position];
        return (
          <td key={col} className="border border-stone-300 p-0 hover:bg-stone-200">
            <Button
              type="text"
              onClick={() => onNameClick(typhoon)}
              aria-label={typhoon?.name ? `View details for ${typhoon.name}` : undefined}
              className="!h-16 !w-full !rounded-none !p-2"
            >
              <span className="text-sm font-semibold text-gray-700">{typhoon?.name}</span>
            </Button>
          </td>
        );
      }}
    />
  );
};

export default TyphoonNamesTable;
