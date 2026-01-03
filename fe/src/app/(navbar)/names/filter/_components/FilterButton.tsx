import { Filter } from "lucide-react";

interface FilterButtonParams {
  name: string;
  country: string;
  language: string;
}

interface FilterButtonProps {
  onClick: () => void;
  params: FilterButtonParams;
}

const FilterButton = ({ onClick, params }: FilterButtonProps) => {
  const getFilterText = () => {
    const parts: string[] = [];
    if (params.name) parts.push(params.name);
    if (params.country) parts.push(params.country);
    if (params.language) parts.push(params.language);
    return parts.length > 0 ? parts.join(" / ") : "Filters";
  };

  return (
    <div className="mx-auto mb-6 max-w-4xl">
      <button
        onClick={onClick}
        className="mx-auto flex items-center gap-2 rounded-lg bg-emerald-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-emerald-600"
      >
        <Filter size={20} />
        {getFilterText()}
      </button>
    </div>
  );
};

export default FilterButton;
