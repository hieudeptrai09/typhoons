import { Filter } from "lucide-react";
import { getRetiredNamesTitle } from "../../_utils/fns";

const FilterButton = ({ activeFilterCount, onClick, params }) => {
  const hasFilters = activeFilterCount > 0;
  const filterText = hasFilters
    ? getRetiredNamesTitle(
        params.name,
        params.year,
        params.country,
        params.lang
      ).join(" / ")
    : "Filters";

  return (
    <div className="max-w-4xl mx-auto mb-6">
      <button
        onClick={onClick}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold flex items-center gap-2 mx-auto"
      >
        <Filter size={20} />
        {filterText}
      </button>
    </div>
  );
};

export default FilterButton;
