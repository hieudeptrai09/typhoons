import { Modal, Popover } from "antd";
import { BACKGROUND_BADGE, TEXT_COLOR_WHITE_BACKGROUND } from "../../../../../components/colors";
import { INTENSITY_LABEL } from "../../../../../constants";
import { calculateAverage, getGroupedStorms, getIntensityFromNumber } from "../../_utils/fns";
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
  return (
    <div className="space-y-3">
      <div>
        <span id="avg-intensity-label" className="text-gray-500">
          Overall Average Intensity:{" "}
        </span>
        <span
          className="text-lg font-bold"
          aria-describedby="avg-intensity-label"
          style={{ color: TEXT_COLOR_WHITE_BACKGROUND[getIntensityFromNumber(average)] }}
        >
          {average.toFixed(2)}
        </span>
      </div>
      <div>
        <div className="mb-2 text-gray-500">Storm names at this position:</div>
        {nameData.length === 0 && (
          <div className="text-sm text-gray-400">No storms at this position.</div>
        )}
        <div className="space-y-2">
          {nameData.map((data, idx) => {
            const intensityLabel = getIntensityFromNumber(data.average);
            const bgColor = BACKGROUND_BADGE[intensityLabel];

            return (
              <Popover
                key={data.name}
                styles={{ container: { backgroundColor: "#f3f4f6" } }}
                content={
                  <div className="flex flex-col gap-1.5">
                    {data.storms.map((storm) => (
                      <div key={storm.year} className="text-sm text-gray-600">
                        {INTENSITY_LABEL[storm.intensity]}{" "}
                        <span
                          className="font-semibold"
                          style={{ color: TEXT_COLOR_WHITE_BACKGROUND[storm.intensity] }}
                        >
                          {data.name}
                        </span>{" "}
                        {storm.year}
                      </div>
                    ))}
                  </div>
                }
                trigger={["hover", "click"]}
                placement="bottom"
              >
                <div
                  className="flex cursor-pointer items-center justify-between rounded-md bg-white px-3 py-2 transition-colors hover:bg-gray-200"
                  style={{ borderLeft: `4px solid ${bgColor}` }}
                >
                  <span
                    className="font-semibold text-gray-700"
                    aria-describedby={`avg-stats-${idx}`}
                  >
                    {data.name}
                  </span>
                  <div id={`avg-stats-${idx}`} className="flex gap-3 text-sm text-gray-500">
                    <span>
                      Count: <span className="font-semibold text-gray-700">{data.count}</span>
                    </span>
                    <span>
                      Avg:{" "}
                      <span
                        className="font-semibold"
                        style={{ color: TEXT_COLOR_WHITE_BACKGROUND[intensityLabel] }}
                      >
                        {data.average.toFixed(2)}
                      </span>
                    </span>
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
    const sortedStorms = [...nameStorms].sort((a, b) => a.year - b.year);
    const avg = calculateAverage(sortedStorms);
    return { name, average: avg, count: sortedStorms.length, storms: sortedStorms };
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
