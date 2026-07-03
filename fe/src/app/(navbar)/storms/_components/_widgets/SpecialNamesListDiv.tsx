import type { Storm } from "@/common/types";
import { TEXT_COLOR_WHITE_BACKGROUND } from "@/common/utils/colors";
import { Button } from "antd";
import {
  calculateAverage,
  getIntensityFromNumber,
  sortNamesByFirstYear,
  SPECIAL_POSITIONS,
} from "../../_utils/fns";

interface SpecialNamesListDivProps {
  stormsData: Storm[];
  onNameClick: (name: string, storms: Storm[]) => void;
  nameAverageValues?: Record<string, number>;
}

const SpecialNamesListDiv = ({
  stormsData,
  onNameClick,
  nameAverageValues,
}: SpecialNamesListDivProps) => {
  const stormsByPosition = SPECIAL_POSITIONS.map(({ id, label }) => {
    const positionStorms = stormsData.filter((s) => s.position === id);

    const nameMap = positionStorms.reduce<Record<string, Storm[]>>((acc, s) => {
      if (!acc[s.name]) acc[s.name] = [];
      acc[s.name].push(s);
      return acc;
    }, {});

    const names = sortNamesByFirstYear(Object.entries(nameMap)).map(([name, nameStorms]) => {
      const color = nameAverageValues
        ? TEXT_COLOR_WHITE_BACKGROUND[
            getIntensityFromNumber(nameAverageValues[name] ?? calculateAverage(nameStorms))
          ]
        : "#374151";
      return { name, color, storms: nameStorms };
    });

    return { id, label, names };
  });

  if (stormsByPosition.every((p) => p.names.length === 0)) return null;

  return (
    <div className="mb-6 flex flex-wrap justify-center gap-4">
      <div className="mr-2 self-start pt-2 text-sm font-semibold text-gray-700">Other Regions:</div>
      {stormsByPosition.map(({ id, label, names }) => (
        <div key={id} className="flex flex-col items-center gap-1">
          <span className="mb-1 text-xs font-semibold tracking-wide text-gray-500 uppercase">
            {label}
          </span>
          <div className="flex min-w-16 flex-col items-center gap-0.5 rounded border border-stone-300 px-2 py-2">
            {names.length === 0 ? (
              <span className="text-xs text-gray-300">—</span>
            ) : (
              names.map(({ name, color, storms }) => (
                <Button
                  key={name}
                  type="text"
                  onClick={() => onNameClick(name, storms)}
                  className="!h-auto !w-full !p-0 !text-xs !leading-tight !font-semibold hover:!bg-transparent hover:!underline"
                  style={{ color }}
                >
                  {name}
                </Button>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SpecialNamesListDiv;
