import FilterSection from "./FilterSection";

interface FilterSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
}

const FilterSelect = ({
  label,
  value,
  onChange,
  options,
  placeholder = "All",
}: FilterSelectProps) => {
  return (
    <FilterSection label={label} hasValue={Boolean(value)} onClear={() => onChange("")}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-400 px-4 py-2 text-blue-500 outline-none focus:border-blue-500"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </FilterSection>
  );
};

export default FilterSelect;
