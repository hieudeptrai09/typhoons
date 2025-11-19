import Image from "next/image";
import FilterIcon from "../../assets/filter-icon.svg";

const FilterButton = ({ activeFilterCount, onClick }) => {
  return (
    <div className="max-w-4xl mx-auto mb-6">
      <button
        onClick={onClick}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold flex items-center gap-2 mx-auto"
      >
        <Image src={FilterIcon} alt="Filter" width={20} height={20} />
        Filters
        {activeFilterCount > 0 && (
          <span className="bg-white text-blue-500 rounded-full px-2 py-0.5 text-sm font-bold">
            {activeFilterCount}
          </span>
        )}
      </button>
    </div>
  );
};

export default FilterButton;
