import CountryFlag from "@/lib/components/CountryFlag";
import DefModal from "@/lib/components/DefModal";
import ImageWithLoader from "@/lib/components/ImageWithLoader";
import { INTENSITY_LABEL } from "@/lib/constants";
import type { BaseModalProps, Storm } from "@/lib/types";
import { BACKGROUND_BADGE, TEXT_COLOR_WHITE_BACKGROUND } from "@/lib/utils/colors";
import { formatStormDateRange } from "@/lib/utils/fns";
import { Switch } from "antd";
import { useState } from "react";
import type { CSSProperties } from "react";
import { getIntensityFromNumber } from "../../_utils/fns";

// It's used to a part of modal @modal/(.)info/[name], but the owner forced to divorce and go back to here.
export interface NameListModalProps extends BaseModalProps {
  name: string;
  storms: Storm[];
  avgIntensity?: number;
}

const NameListModal = ({ isOpen, onClose, name, storms, avgIntensity = 0 }: NameListModalProps) => {
  const [showMap, setShowMap] = useState(false);
  const titleStyle: CSSProperties = {
    color: TEXT_COLOR_WHITE_BACKGROUND[getIntensityFromNumber(avgIntensity)],
  };

  if (!storms || storms.length === 0) return null;

  return (
    <DefModal
      open={isOpen}
      onClose={onClose}
      width={512}
      title={
        <span className="text-2xl font-bold" style={titleStyle}>
          {name}
        </span>
      }
    >
      <div className="pt-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span id="namelist-country-label" className="font-semibold text-muted">
                  Contributed by:
                </span>
                <CountryFlag country={storms[0].country} className="h-5 w-8" />
              </div>
              <div>
                <span id="namelist-position-label" className="font-semibold text-muted">
                  Position:
                </span>
                <span className="ml-2 text-muted" aria-describedby="namelist-position-label">
                  {storms[0].position}
                </span>
              </div>
              {storms[0].correctSpelling && (
                <div>
                  <span className="font-semibold text-muted">Correct spelling:</span>
                  <span className="ml-2 text-muted">{storms[0].correctSpelling}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-muted">Show Map</span>
              <Switch checked={showMap} onChange={setShowMap} aria-label="Show storm track map" />
            </div>
          </div>

          <div>
            <h3 id="storm-list-heading" className="mb-3 font-semibold text-muted">
              All {name} Storms ({storms.length})
            </h3>
            <div className="space-y-1" aria-describedby="storm-list-heading">
              {storms.map((storm) => {
                const borderColor = BACKGROUND_BADGE[storm.intensity];
                const textColor = TEXT_COLOR_WHITE_BACKGROUND[storm.intensity];
                const label = INTENSITY_LABEL[storm.intensity];
                const stormTitle = `${label} ${storm.name}`;
                const hasMap = storm.map && storm.map.trim() !== "";
                const dateRange = formatStormDateRange(
                  storm.year,
                  storm.monthStart,
                  storm.dateStart,
                  storm.monthEnd,
                  storm.dateEnd,
                  storm.isFromPrevYear,
                );

                return (
                  <div
                    key={`${storm.year}-${storm.name}`}
                    className="rounded-md px-3 py-2 transition-colors hover:bg-gray-50"
                    style={{ borderLeft: `4px solid ${borderColor}` }}
                  >
                    {showMap && hasMap && (
                      <div className="relative mb-2 h-48 w-full">
                        <ImageWithLoader
                          src={storm.map}
                          alt={`${storm.name} ${storm.year} track`}
                          fill
                          className="rounded border border-gray-200 object-contain"
                          unoptimized
                        />
                      </div>
                    )}
                    <div className="text-sm font-bold" style={{ color: textColor }}>
                      {stormTitle}
                    </div>
                    {dateRange && <div className="text-xs text-muted">{dateRange}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </DefModal>
  );
};

export default NameListModal;
