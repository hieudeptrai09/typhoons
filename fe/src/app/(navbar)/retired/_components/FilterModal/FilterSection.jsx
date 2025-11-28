const FilterSection = ({ label, hasValue, onClear, children }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-semibold text-gray-700">{label}</label>
        {hasValue && (
          <button
            onClick={onClear}
            className="text-sm text-blue-500 hover:text-blue-600 hover:underline"
          >
            Clear
          </button>
        )}
      </div>
      {children}
    </div>
  );
};

export default FilterSection;
