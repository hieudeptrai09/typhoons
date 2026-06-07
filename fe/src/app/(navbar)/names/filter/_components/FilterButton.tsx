import { Filter } from "lucide-react";
import type { FilterParams } from "../../../../../types";

interface FilterButtonProps {
  onClick: () => void;
  params: FilterParams;
}

const fmtMulti = (val: string) => val.split(",").filter(Boolean).join(", ");

const FilterButton = ({ onClick, params }: FilterButtonProps) => {
  const parts: string[] = [];
  if (params.name) parts.push(params.name);
  if (params.country) parts.push(fmtMulti(params.country));
  if (params.language) parts.push(fmtMulti(params.language));
  if (params.position) parts.push(`Position #${params.position}`);
  if (params.tag) parts.push(fmtMulti(params.tag));

  return (
    <div className="mx-auto mb-6 max-w-4xl">
      <button
        onClick={onClick}
        className="mx-auto flex items-center gap-2 rounded-lg bg-emerald-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-emerald-600"
      >
        <Filter size={20} />
        {parts.length > 0 ? parts.join(" / ") : "Filters"}
      </button>
    </div>
  );
};

export default FilterButton;
