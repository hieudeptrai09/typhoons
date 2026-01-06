import FilterSection from "./FilterSection";

interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
  countries: string[];
}

const CountrySelect = ({ value, onChange, countries }: CountrySelectProps) => {
  return (
    <FilterSection label="Filter by Country" hasValue={Boolean(value)} onClear={() => onChange("")}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-400 px-4 py-2 text-blue-500 outline-none focus:border-blue-500"
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
