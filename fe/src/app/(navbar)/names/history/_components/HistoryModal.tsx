import Modal from "../../../../../components/Modal";
import { useFetchData } from "../../../../../containers/hooks/useFetchData";
import { getPositionTitle } from "../../../../../containers/utils/fns";
import type { BaseModalProps, TyphoonName, Storm } from "../../../../../types";

interface HistoryModalProps extends BaseModalProps {
  position: number;
  positionNames: TyphoonName[];
}

const HistoryModal = ({ isOpen, onClose, position, positionNames }: HistoryModalProps) => {
  if (!isOpen) return null;

  const { data: storms, loading } = useFetchData<Storm[]>(
    position ? `/storms?position=${position}` : "",
  );

  const stormsByName: Record<string, Storm[]> = {};
  (storms || []).forEach((storm) => {
    if (!stormsByName[storm.name]) stormsByName[storm.name] = [];
    stormsByName[storm.name].push(storm);
  });

  const positionTitle = getPositionTitle(position);

  // Sort by the first storm year for each name ascending; names with no storms go to the end
  const sortedNames = [...positionNames].sort((a, b) => {
    const aStorms = stormsByName[a.name] || [];
    const bStorms = stormsByName[b.name] || [];
    const aFirst = aStorms.length > 0 ? Math.min(...aStorms.map((s) => s.year)) : Infinity;
    const bFirst = bStorms.length > 0 ? Math.min(...bStorms.map((s) => s.year)) : Infinity;
    return aFirst - bFirst;
  });

  const getNameColor = (name: TyphoonName) => {
    if (name.isLanguageProblem === 2) return "text-amber-500";
    if (name.isRetired) return "text-red-500";
    return "text-green-700";
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={positionTitle} maxWidth={400} height={280}>
      {() => (
        <div>
          {loading ? (
            <div className="py-4 text-center text-gray-500">Loading storms...</div>
          ) : positionNames.length === 0 ? (
            <div className="py-4 text-center text-gray-500">No names at this position.</div>
          ) : (
            <div>
              {sortedNames.map((name) => {
                const nameStorms = stormsByName[name.name] || [];
                const count = nameStorms.length;
                const years = nameStorms.map((s) => s.year).join(", ");
                const colorClass = getNameColor(name);

                return (
                  <div key={name.id} className="flex items-baseline gap-2 py-1">
                    <span className="min-w-8 text-sm font-bold text-gray-400">
                      {count > 0 ? `x${count}` : "x0"}
                    </span>
                    <span className={`font-semibold ${colorClass}`}>{name.name}</span>
                    {count > 0 && <span className="text-sm text-gray-500">({years})</span>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};

export default HistoryModal;
