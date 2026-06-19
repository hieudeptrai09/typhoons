import { useState } from "react";
import { Modal, Popover } from "antd";
import IntensityBadge from "../../../../../components/components/IntensityBadge";
import {
  BACKGROUND_BADGE,
  TEXT_COLOR_BADGE,
  TEXT_COLOR_WHITE_BACKGROUND,
  BACKGROUND_HOVER_BADGE,
} from "../../../../../components/colors";
import { INTENSITY_RANK } from "../../../../../constants";
import { getIntensityFromNumber, calculateAverage, getGroupedStorms } from "../../_utils/fns";
import type { BaseModalProps, Storm } from "../../../../../types";

interface AverageModalProps extends BaseModalProps {
  title: string;
  average: number;
  storms: Storm[];
}

interface NameAverageData {
  name: string;
  average: number;
  count: number;
  storms: Storm[];
}

const AverageModalInner = ({
  average,
  nameData,
}: {
  average: number;
  nameData: NameAverageData[];
}) => {
  const [hoveredName, setHoveredName] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <div title={JSON.stringify(INTENSITY_RANK)}>
        <span className="text-blue-700">Overall Average Intensity: </span>
        <span
          className="text-lg font-bold"
          style={{ color: TEXT_COLOR_WHITE_BACKGROUND[getIntensityFromNumber(average)] }}
        >
          {average.toFixed(2)}
        </span>
      </div>
      <div>
        <div className="mb-2 text-blue-700">Storm names at this position:</div>
        <div className="space-y-2">
          {nameData.map((data, idx) => {
            const intensityLabel = getIntensityFromNumber(data.average);
            const bgColor = BACKGROUND_BADGE[intensityLabel];
            const hoverColor = BACKGROUND_HOVER_BADGE[intensityLabel];
            const textColor = TEXT_COLOR_BADGE[intensityLabel];
            const isHovered = hoveredName === data.name;

            return (
              <Popover
                key={idx}
                content={
                  <div className="flex flex-col gap-1.5">
                    {data.storms.map((storm, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <IntensityBadge intensity={storm.intensity} />
                        <span
                          className="text-sm"
                          style={{ color: TEXT_COLOR_WHITE_BACKGROUND[storm.intensity] }}
                        >
                          {storm.year}
                        </span>
                      </div>
                    ))}
                  </div>
                }
                trigger={["hover", "click"]}
                placement="bottom"
              >
                <div
                  className="cursor-pointer rounded-lg bg-white px-2 transition-colors hover:bg-gray-100"
                  onMouseEnter={() => setHoveredName(data.name)}
                  onMouseLeave={() => setHoveredName(null)}
                >
                  <div
                    className="flex items-center justify-between rounded-md px-3 py-2 transition-colors"
                    style={{ backgroundColor: isHovered ? hoverColor : bgColor }}
                  >
                    <span className="font-semibold" style={{ color: textColor }}>
                      {data.name}
                    </span>
                    <div className="flex gap-3 text-sm">
                      <span style={{ color: textColor }}>
                        Count: <span className="font-semibold">{data.count}</span>
                      </span>
                      <span style={{ color: textColor }}>
                        Avg: <span className="font-semibold">{data.average.toFixed(2)}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </Popover>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const AverageModal = ({ isOpen, onClose, title, average, storms }: AverageModalProps) => {
  const nameAverages = getGroupedStorms(storms, "name");
  const nameData: NameAverageData[] = Object.entries(nameAverages).map(([name, nameStorms]) => {
    const avg = calculateAverage(nameStorms);
    return { name, average: avg, count: nameStorms.length, storms: nameStorms };
  });

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      width={448}
      footer={null}
      centered
      destroyOnHidden
      styles={{
        header: { borderBottom: "1px solid #9ca3af", paddingBottom: "12px" },
        body: { maxHeight: "70vh", overflowY: "auto" },
      }}
      title={<span className="text-2xl font-bold text-gray-700">{title}</span>}
    >
      <div className="pt-4">
        <AverageModalInner average={average} nameData={nameData} />
      </div>
    </Modal>
  );
};

export default AverageModal;
