import ImageWithLoader from "@/lib/components/ImageWithLoader";
import TyphoonSpinner from "@/lib/components/TyphoonSpinner";
import { useFetchData } from "@/lib/hooks/useFetchData";
import type { BaseModalProps, StormHistoryEntry, TyphoonName } from "@/lib/types";
import { getNameStatusColor } from "@/lib/utils/colors";
import { getPositionTitle } from "@/lib/utils/fns";
import { Button, Modal } from "antd";
import { useState } from "react";

// It's used to a part of modal PositionModal (the "names" lens), but the owner
// forced to divorce and go back to here.
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
  } = useFetchData<StormHistoryEntry[]>(
    isOpen && position ? `/typhoon-names?position=${position}` : "",
  );

  if (!isOpen) return null;

  const expandedNameId = expandedState?.position === position ? expandedState.nameId : null;

  const isStormsReady =
    !loading &&
    (stormsRaw == null ||
      stormsRaw.length === 0 ||
      stormsRaw.every((s) => s.position === position));

  const storms = isStormsReady ? (stormsRaw ?? []) : [];

  const stormsByName: Record<string, StormHistoryEntry[]> = {};
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
      styles={{
        header: { borderBottom: "1px solid #9ca3af", paddingBottom: "12px" },
        body: { maxHeight: "70vh", overflowY: "auto" },
      }}
      title={<span className="text-2xl font-bold text-muted">{positionTitle}</span>}
    >
      <div className="pt-4">
        {loading || !isStormsReady ? (
          <div className="flex justify-center py-8">
            <TyphoonSpinner size="medium" />
          </div>
        ) : error ? (
          <div className="py-4 text-center text-muted">Failed to load storm data.</div>
        ) : positionNames.length === 0 ? (
          <div className="py-4 text-center text-muted">No names at this position.</div>
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
                    aria-describedby={name.meaning ? `history-meaning-${name.id}` : undefined}
                    aria-expanded={hasExpandable ? isExpanded : undefined}
                    className={`!h-auto !w-full !rounded-lg !px-3 !py-2 !text-left ${
                      isExpanded ? "!rounded-b-none !bg-sky-50" : ""
                    } ${!hasExpandable ? "!cursor-default" : ""}`}
                  >
                    <div className="flex w-full items-baseline gap-2">
                      <span className="min-w-8 shrink-0 text-sm font-bold text-muted">
                        {count > 0 ? `x${count}` : "x0"}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="whitespace-pre-line">
                          <span
                            className="font-semibold"
                            style={{ color: getNameStatusColor(name) }}
                          >
                            {name.name}
                          </span>
                          {count > 0 && (
                            <span className="ml-1 text-sm text-muted">({years})</span>
                          )}
                          {name.language && (
                            <span className="ml-1 text-xs text-muted">· {name.language}</span>
                          )}
                        </div>
                        {name.meaning && (
                          <p
                            id={`history-meaning-${name.id}`}
                            className="mt-0.5 text-xs leading-relaxed whitespace-pre-line text-teal-700 italic"
                          >
                            {name.meaning}
                          </p>
                        )}
                        {name.description && (
                          <p className="mt-0.5 text-xs leading-relaxed whitespace-pre-line text-muted">
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
