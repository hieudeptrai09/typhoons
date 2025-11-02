import FilterSection from "./FilterSection";

const CountrySelect = ({ value, onChange, countries }) => {
  return (
    <FilterSection
      label="Filter by Country"
      hasValue={Boolean(value)}
      onClear={() => onChange("")}
    >
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:border-blue-500 text-purple-600 outline-none"
      >
        <option value="">All Countries</option>
        {countries.map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
      </select>
    </FilterSection>
  );
};

export default CountrySelect;
