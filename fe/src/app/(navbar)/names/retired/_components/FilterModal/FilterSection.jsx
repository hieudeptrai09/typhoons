const FilterSection = ({ label, hasValue, onClear, children }) => {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm font-semibold text-gray-700">{label}</label>
        {hasValue && (
          <button
            onClick={onClear}
            className="px-2 text-sm font-semibold text-blue-500 hover:text-blue-600 hover:underline"
          >
            Clear this filter
          </button>
        )}
      </div>
      {children}
    </div>
  );
};

export default FilterSection;
