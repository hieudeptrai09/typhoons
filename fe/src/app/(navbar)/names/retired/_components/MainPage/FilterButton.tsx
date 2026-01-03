import { Filter } from "lucide-react";
import { getRetiredNamesTitle } from "../../_utils/fns";
import type { RetiredFilterParams } from "../../../../../../types";

interface FilterButtonProps {
  activeFilterCount: number;
  onClick: () => void;
  params: RetiredFilterParams;
}

const FilterButton = ({ activeFilterCount, onClick, params }: FilterButtonProps) => {
  const hasFilters = activeFilterCount > 0;
  const filterText = hasFilters
    ? getRetiredNamesTitle(params.name, params.year, params.country, params.lang).join(" / ")
    : "Filters";

  return (
    <div className="mx-auto mb-6 max-w-4xl">
      <button
        onClick={onClick}
        className="mx-auto flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-orange-600"
      >
        <Filter size={20} />
        {filterText}
      </button>
    </div>
  );
};

export default FilterButton;
