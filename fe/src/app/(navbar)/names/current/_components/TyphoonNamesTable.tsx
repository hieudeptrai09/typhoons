import { Button } from "antd";
import CountryFlag from "../../../../../components/components/CountryFlag";
import { COUNTRY_FLAG_COMPONENTS } from "../../../../../constants";
import type { TyphoonName } from "../../../../../types";

interface TyphoonNamesTableProps {
  names: TyphoonName[];
  onNameClick: (name: TyphoonName) => void;
}

const TyphoonNamesTable = ({ names, onNameClick }: TyphoonNamesTableProps) => {
  const rows = 10;
  const cols = 14;

  const countryEntries = Object.entries(COUNTRY_FLAG_COMPONENTS);

  const sortedNames = names.sort((a, b) => a.position - b.position);

  const columnWidth = `${100 / cols}%`;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <colgroup>
          {[...Array(cols)].map((_, idx) => (
            <col key={idx} style={{ width: columnWidth }} />
          ))}
        </colgroup>
        <thead>
          <tr>
            {countryEntries.map(([countryName], index) => (
              <th key={index} className="border border-sky-300 bg-sky-600 p-2" title={countryName}>
                <div className="flex items-center justify-center">
                  <CountryFlag country={countryName} className="h-7 w-10 border-white/30" />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(rows)].map((_, row) => (
            <tr key={row}>
              {[...Array(cols)].map((_, col) => {
                const position = row * cols + col;
                const typhoon = sortedNames[position];

                return (
                  <td key={col} className="border border-stone-300 p-0 hover:bg-stone-200">
                    <Button
                      type="text"
                      onClick={() => onNameClick(typhoon)}
                      className="!h-16 !w-full !rounded-none"
                    >
                      <span className="text-sm font-semibold text-gray-700">{typhoon?.name}</span>
                    </Button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TyphoonNamesTable;
