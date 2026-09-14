import AvgGapPanel from "@/lib/components/AvgGapPanel";
import DefModal from "@/lib/components/DefModal";
import type { BaseModalProps, Storm } from "@/lib/types";
import { getDistanceColor } from "@/lib/utils/colors";

interface DistanceModalProps extends BaseModalProps {
  title: string;
  storms: Storm[];
  average: number;
}

const DistanceModal = ({ isOpen, onClose, title, storms, average }: DistanceModalProps) => (
  <DefModal
    open={isOpen}
    onClose={onClose}
    width={448}
    title={
      <span className="text-2xl font-bold" style={{ color: getDistanceColor(average) }}>
        {title}
      </span>
    }
  >
    <div className="pt-3">
      <AvgGapPanel storms={storms} />
    </div>
  </DefModal>
);

export default DistanceModal;
