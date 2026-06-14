import { useState } from "react";
import { Button, Modal, Spin } from "antd";
import ImageWithLoader from "../../components/ImageWithLoader";
import { useFetchData } from "../../../containers/hooks/useFetchData";
import { getPositionTitle } from "../../../containers/utils/fns";
import type { BaseModalProps, TyphoonName, Storm } from "../../../types";

interface HistoryModalProps extends BaseModalProps {
  position: number;
  positionNames: TyphoonName[];
}

const HistoryModal = ({ isOpen, onClose, position, positionNames }: HistoryModalProps) => {
  const [expandedState, setExpandedState] = useState<{ position: number; nameId: number } | null>(
    null,
  );

  const {
    data: stormsRaw,
    loading,
    error,
  } = useFetchData<Storm[]>(isOpen && position ? `/storms?position=${position}` : "");

  if (!isOpen) return null;

  const expandedNameId = expandedState?.position === position ? expandedState.nameId : null;

  const isStormsReady =
    !loading &&
    (stormsRaw == null ||
      stormsRaw.length === 0 ||
      stormsRaw.every((s) => s.position === position));

  const storms = isStormsReady ? (stormsRaw ?? []) : [];

  const stormsByName: Record<string, Storm[]> = {};
  storms.forEach((storm) => {
    if (!stormsByName[storm.name]) stormsByName[storm.name] = [];
    stormsByName[storm.name].push(storm);
  });

  const positionTitle = getPositionTitle(position);

  const sortedNames = [...positionNames].sort((a, b) => {
    const aStorms = stormsByName[a.name] || [];
    const bStorms = stormsByName[b.name] || [];
    const aFirst = aStorms.length > 0 ? Math.min(...aStorms.map((s) => s.year)) : Infinity;
    const bFirst = bStorms.length > 0 ? Math.min(...bStorms.map((s) => s.year)) : Infinity;
    return aFirst - bFirst;
  });

  const getNameColor = (name: TyphoonName): string => {
    if (name.isLanguageProblem === 2) return "#f59e0b"; // amber-500
    if (name.isRetired) return "#ef4444"; // red-500
    return "#15803d"; // green-700
  };

  const handleNameClick = (nameId: number) => {
    setExpandedState((prev) =>
      prev?.position === position && prev.nameId === nameId ? null : { position, nameId },
    );
  };

  return (
    <Modal
      open={isOpen}
      onCancel={() => {
        setExpandedState(null);
        onClose();
      }}
      width={480}
      footer={null}
      centered
      destroyOnHidden
      styles={{ header: { borderBottom: "1px solid #9ca3af", paddingBottom: "12px" } }}
      title={<span className="text-2xl font-bold text-gray-700">{positionTitle}</span>}
    >
      <div className="max-h-[90%] overflow-y-auto pt-4">
        {loading || !isStormsReady ? (
          <div className="flex justify-center py-8">
            <Spin size="medium" />
          </div>
        ) : error ? (
          <div className="py-4 text-center text-gray-500">Failed to load storm data.</div>
        ) : positionNames.length === 0 ? (
          <div className="py-4 text-center text-gray-500">No names at this position.</div>
        ) : (
          <div className="space-y-1">
            {sortedNames.map((name) => {
              const nameStorms = stormsByName[name.name] || [];
              const count = nameStorms.length;
              const years = nameStorms.map((s) => s.year).join(", ");
              const isExpanded = expandedNameId === name.id;
              const hasExpandable = !!name.image;

              return (
                <div key={name.id} className="overflow-hidden rounded-lg">
                  <Button
                    type="text"
                    disabled={!hasExpandable}
                    onClick={() => hasExpandable && handleNameClick(name.id)}
                    className={`!h-auto !w-full !rounded-lg !px-3 !py-2 !text-left ${
                      isExpanded ? "!rounded-b-none !bg-sky-50" : ""
                    } ${!hasExpandable ? "!cursor-default" : ""}`}
                  >
                    <div className="flex w-full items-baseline gap-2">
                      <span className="min-w-8 shrink-0 text-sm font-bold text-gray-400">
                        {count > 0 ? `x${count}` : "x0"}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="whitespace-pre-line">
                          <span className="font-semibold" style={{ color: getNameColor(name) }}>
                            {name.name}
                          </span>
                          {count > 0 && (
                            <span className="ml-1 text-sm text-gray-500">({years})</span>
                          )}
                        </div>
                        {name.meaning && (
                          <p className="mt-0.5 text-xs leading-relaxed whitespace-pre-line text-teal-700 italic">
                            {name.meaning}
                          </p>
                        )}
                        {name.description && (
                          <p className="mt-0.5 text-xs leading-relaxed whitespace-pre-line text-gray-600">
                            {name.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </Button>

                  {isExpanded && name.image && (
                    <div className="rounded-b-lg border-t border-sky-100 bg-sky-50 px-4 py-3">
                      <div
                        className="relative mx-auto overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
                        style={{ width: 160, aspectRatio: "4/3" }}
                      >
                        <ImageWithLoader
                          src={name.image}
                          alt={name.name}
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default HistoryModal;
