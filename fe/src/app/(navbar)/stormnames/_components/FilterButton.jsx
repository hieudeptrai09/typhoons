import { Filter } from "lucide-react";

const FilterButton = ({ activeFilterCount, onClick, params }) => {
  const hasFilters = activeFilterCount > 0;

  const getFilterText = () => {
    const parts = [];
    if (params.name) parts.push(params.name);
    if (params.country) parts.push(params.country);
    return parts.length > 0 ? parts.join(" / ") : "Filters";
  };

  return (
    <div className="max-w-4xl mx-auto mb-6">
      <button
        onClick={onClick}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold flex items-center gap-2 mx-auto"
      >
        <Filter size={20} />
        {getFilterText()}
      </button>
    </div>
  );
};

export default FilterButton;
