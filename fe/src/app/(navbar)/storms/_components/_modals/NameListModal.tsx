import { useState } from "react";
import type { CSSProperties } from "react";
import { Modal, Switch, Popover } from "antd";
import CountryFlag from "../../../../../components/components/CountryFlag";
import ImageWithLoader from "../../../../../components/components/ImageWithLoader";
import {
  BACKGROUND_BADGE,
  TEXT_COLOR_BADGE,
  BACKGROUND_HOVER_BADGE,
  TEXT_COLOR_WHITE_BACKGROUND,
  INTENSITY_LABEL,
} from "../../../../../constants";
import { getIntensityFromNumber } from "../../_utils/fns";
import type { BaseModalProps, Storm } from "../../../../../types";

export interface NameListModalProps extends BaseModalProps {
  name: string;
  storms: Storm[];
  avgIntensity?: number;
}

const NameListModalInner = ({ name, storms }: { name: string; storms: Storm[] }) => {
  const [showMap, setShowMap] = useState(false);
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">Country:</span>
            <CountryFlag country={storms[0].country} className="h-5 w-8" />
          </div>
          <div>
            <span className="font-semibold text-gray-700">Position:</span>
            <span className="ml-2 text-gray-700">{storms[0].position}</span>
          </div>
          {storms[0].correctSpelling && (
            <div>
              <span className="font-semibold text-gray-700">Correct spelling:</span>
              <span className="ml-2 text-gray-700">{storms[0].correctSpelling}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-700">Show Map</span>
          <Switch checked={showMap} onChange={setShowMap} />
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-semibold text-gray-700">
          All {name} Storms ({storms.length})
        </h3>
        <div className="space-y-2">
          {storms.map((storm, idx) => {
            const bgColor = BACKGROUND_BADGE[storm.intensity];
            const textColor = TEXT_COLOR_BADGE[storm.intensity];
            const hoverColor = BACKGROUND_HOVER_BADGE[storm.intensity];
            const isHovered = hoveredYear === storm.year;
            const label = INTENSITY_LABEL[storm.intensity];
            const stormTitle = `${label} ${storm.name} ${storm.year}`;
            const hasMap = storm.map && storm.map.trim() !== "";

            const row = (
              <div
                className="cursor-pointer rounded-lg bg-white px-2 transition-colors hover:bg-gray-100"
                onMouseEnter={() => setHoveredYear(storm.year)}
                onMouseLeave={() => setHoveredYear(null)}
              >
                <div
                  className="flex items-center gap-4 rounded-md p-2 transition-colors"
                  style={{ backgroundColor: isHovered ? hoverColor : bgColor }}
                >
                  <div className="flex-1">
                    <div className="text-sm font-bold" style={{ color: textColor }}>
                      {stormTitle}
                    </div>
                  </div>
                  {showMap && hasMap && (
                    <div className="relative h-32 w-48 shrink-0">
                      <ImageWithLoader
                        src={storm.map}
                        alt={`${storm.name} ${storm.year} track`}
                        fill
                        className="rounded border-2 border-white/30 object-cover"
                        unoptimized
                      />
                    </div>
                  )}
                </div>
              </div>
            );

            if (hasMap) {
              return (
                <Popover
                  key={idx}
                  content={
                    <div className="relative h-[200px] w-[300px]">
                      <ImageWithLoader
                        src={storm.map}
                        alt={`${storm.name} ${storm.year} track`}
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  }
                  trigger={["hover", "click"]}
                  placement="top"
                >
                  {row}
                </Popover>
              );
            }

            return <div key={idx}>{row}</div>;
          })}
        </div>
      </div>
    </div>
  );
};

const NameListModal = ({ isOpen, onClose, name, storms, avgIntensity = 0 }: NameListModalProps) => {
  const titleStyle: CSSProperties = {
    color: TEXT_COLOR_WHITE_BACKGROUND[getIntensityFromNumber(avgIntensity)],
  };

  if (!storms || storms.length === 0) return null;

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      width={512}
      footer={null}
      centered
      destroyOnHidden
      styles={{
        header: { borderBottom: "1px solid #9ca3af", paddingBottom: "12px" },
        body: { maxHeight: "70vh", overflowY: "auto" },
      }}
      title={
        <span className="text-2xl font-bold" style={titleStyle}>
          {name}
        </span>
      }
    >
      <div className="pt-4">
        <NameListModalInner name={name} storms={storms} />
      </div>
    </Modal>
  );
};

export { NameListModalInner };
export default NameListModal;
