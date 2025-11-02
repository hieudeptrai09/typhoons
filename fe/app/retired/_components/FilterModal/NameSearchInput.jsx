import FilterSection from "./FilterSection";

const NameSearchInput = ({ value, onChange }) => {
  return (
    <FilterSection
      label="Filter by Name"
      hasValue={Boolean(value)}
      onClear={() => onChange("")}
    >
      <input
        type="text"
        placeholder="Enter typhoon name..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:border-blue-500 text-purple-600 outline-none"
      />
    </FilterSection>
  );
};

export default NameSearchInput;
