import FilterSection from "./FilterSection";

const YearDigitSelector = ({ value, onChange }) => {
  return (
    <FilterSection label="Filter by Year" hasValue={Boolean(value)} onClear={() => onChange("")}>
      <input
        type="number"
        placeholder="Enter year..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min="2000"
        max="2100"
        className="w-full rounded-lg border border-gray-400 px-4 py-2 text-blue-500 outline-none focus:border-blue-500"
      />
    </FilterSection>
  );
};

export default YearDigitSelector;
