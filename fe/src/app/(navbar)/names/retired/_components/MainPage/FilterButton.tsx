import { Filter } from "lucide-react";
import type { RetiredFilterParams } from "../../../../../../types";

interface FilterButtonProps {
  activeFilterCount: number;
  onClick: () => void;
  params: RetiredFilterParams;
}

const REASON_LABELS: Record<string, string> = {
  "0": "Destructive",
  "1": "Language",
  "2": "Misspelling",
  "3": "Special",
};

const fmtMulti = (val: string) => val.split(",").filter(Boolean).join(", ");
const fmtReason = (val: string) =>
  val
    .split(",")
    .filter(Boolean)
    .map((r) => REASON_LABELS[r] ?? r)
    .join(", ");

const FilterButton = ({ activeFilterCount, onClick, params }: FilterButtonProps) => {
  const parts: string[] = [];
  if (params.name) parts.push(params.name);
  if (params.year) parts.push(`Year ${params.year}`);
  if (params.country) parts.push(fmtMulti(params.country));
  if (params.position) parts.push(`Position #${params.position}`);
  if (params.reason) parts.push(fmtReason(params.reason));

  return (
    <div className="mx-auto mb-6 max-w-4xl">
      <button
        onClick={onClick}
        className="mx-auto flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-orange-600"
      >
        <Filter size={20} />
        {activeFilterCount > 0 ? parts.join(" / ") : "Filters"}
      </button>
    </div>
  );
};

export default FilterButton;
