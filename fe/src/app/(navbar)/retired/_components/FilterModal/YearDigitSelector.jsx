import FilterSection from "./FilterSection";

const YearDigitSelector = ({ value, onChange }) => {
  return (
    <FilterSection
      label="Filter by Year"
      hasValue={Boolean(value)}
      onClear={() => onChange("")}
    >
      <input
        type="number"
        placeholder="Enter year..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min="2000"
        max="2100"
        className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:border-blue-500 text-purple-600 outline-none"
      />
    </FilterSection>
  );
};

export default YearDigitSelector;
