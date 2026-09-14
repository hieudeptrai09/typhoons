import AvgDatesPanel from "@/lib/components/AvgDatesPanel";
import DefModal from "@/lib/components/DefModal";
import type { BaseModalProps, Storm } from "@/lib/types";

interface AvgDateModalProps extends BaseModalProps {
  title: string;
  storms: Storm[];
}

const AvgDateModal = ({ isOpen, onClose, title, storms }: AvgDateModalProps) => (
  <DefModal
    open={isOpen}
    onClose={onClose}
    width={448}
    title={<span className="text-2xl font-bold text-sky-800">{title}</span>}
  >
    <div className="pt-3">
      <AvgDatesPanel storms={storms} />
    </div>
  </DefModal>
);

export default AvgDateModal;
