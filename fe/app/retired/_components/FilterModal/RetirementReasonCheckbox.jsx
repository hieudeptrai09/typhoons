import FilterSection from "./FilterSection";

const RetirementReasonCheckbox = ({ value, onChange }) => {
  const options = [
    {
      value: "language",
      label: "Language Problem (Green)",
      colorClass: "text-green-600",
    },
    {
      value: "destructive",
      label: "Destructive Storm (Red)",
      colorClass: "text-red-600",
    },
  ];

  const handleCheckboxChange = (optionValue) => {
    if (value.includes(optionValue)) {
      // Remove from array
      onChange(value.filter((v) => v !== optionValue));
    } else {
      // Add to array
      onChange([...value, optionValue]);
    }
  };

  return (
    <FilterSection
      label="Filter by Retirement Reason"
      hasValue={value.length > 0}
      onClear={() => onChange([])}
    >
      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center cursor-pointer"
          >
            <input
              type="checkbox"
              value={option.value}
              checked={value.includes(option.value)}
              onChange={() => handleCheckboxChange(option.value)}
              className="w-4 h-4 text-blue-500 cursor-pointer rounded border-gray-300"
            />
            <span className={`ml-2 ${option.colorClass}`}>{option.label}</span>
          </label>
        ))}
      </div>
    </FilterSection>
  );
};

export default RetirementReasonCheckbox;
