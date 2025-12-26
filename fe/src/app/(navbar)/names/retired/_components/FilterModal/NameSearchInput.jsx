import FilterSection from "./FilterSection";

const NameSearchInput = ({ value, onChange }) => {
  return (
    <FilterSection label="Filter by Name" hasValue={Boolean(value)} onClear={() => onChange("")}>
      <input
        type="text"
        placeholder="Enter typhoon name..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-400 px-4 py-2 text-blue-500 outline-none focus:border-blue-500"
      />
    </FilterSection>
  );
};

export default NameSearchInput;
