import AvgIntensityPanel from "@/lib/components/AvgIntensityPanel";
import DefModal from "@/lib/components/DefModal";
import type { BaseModalProps, Storm } from "@/lib/types";

export type AverageModalCriteria = "position" | "country" | "year" | "month" | "name";

interface AverageModalProps extends BaseModalProps {
  title: string;
  storms: Storm[];
  criteria: AverageModalCriteria;
}

const POSITION_AGENCIES = new Set(["CPHC", "NHC", "IMD"]);

const CRITERIA_TEXT: Record<
  AverageModalCriteria,
  { heading: (title: string) => string; empty: (title: string) => string }
> = {
  position: {
    heading: (title) =>
      POSITION_AGENCIES.has(title)
        ? `Storms which are named by ${title}, by intensity:`
        : `Storms in position ${title} by intensity:`,
    empty: (title) =>
      POSITION_AGENCIES.has(title)
        ? `No storms named by ${title}.`
        : `No storms in position ${title}.`,
  },
  country: {
    heading: (title) => `Storms whose names were contributed by ${title}, by intensity:`,
    empty: (title) => `No storms whose names were contributed by ${title}.`,
  },
  year: {
    heading: (title) => `Storms in ${title} by intensity:`,
    empty: (title) => `No storms in ${title}.`,
  },
  month: {
    heading: (title) => `Storms in ${title} by intensity:`,
    empty: (title) => `No storms in ${title}.`,
  },
  name: {
    heading: (title) => `Storms named ${title} by intensity:`,
    empty: (title) => `No storms named ${title}.`,
  },
};

// The position part is used to a part of modal @modal/(.)positions/[position], but the owner forced to divorce and go back to here.
const AverageModal = ({ isOpen, onClose, title, storms, criteria }: AverageModalProps) => {
  const { heading, empty } = CRITERIA_TEXT[criteria];

  return (
    <DefModal
      open={isOpen}
      onClose={onClose}
      width={448}
      title={<span className="text-2xl font-bold text-foreground">{title}</span>}
    >
      <div className="pt-3">
        <AvgIntensityPanel storms={storms} heading={heading(title)} emptyText={empty(title)} />
      </div>
    </DefModal>
  );
};

export default AverageModal;
