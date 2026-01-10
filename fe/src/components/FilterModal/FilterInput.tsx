import FilterSection from "./FilterSection";

interface FilterInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "number";
  min?: string;
  max?: string;
}

const FilterInput = ({
  label,
  value,
  onChange,
  placeholder = "Enter value...",
  type = "text",
  min,
  max,
}: FilterInputProps) => {
  return (
    <FilterSection label={label} hasValue={Boolean(value)} onClear={() => onChange("")}>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        max={max}
        className="w-full rounded-lg border border-gray-400 px-4 py-2 text-blue-600 outline-none focus:border-blue-500"
      />
    </FilterSection>
  );
};

export default FilterInput;
