import FilterSection from "../../../../../../components/FilterModal/FilterSection";

interface ReasonOption {
  value: string;
  label: string;
  activeColor: string;
  inactiveColor: string;
  hoverActiveColor: string;
  hoverInactiveColor: string;
  textInactiveColor: string;
}

interface RetirementReasonCheckboxProps {
  value: string;
  onChange: (value: string) => void;
}

const RetirementReasonCheckbox = ({ value, onChange }: RetirementReasonCheckboxProps) => {
  const options: ReasonOption[] = [
    {
      value: "0",
      label: "Destructive Storm",
      activeColor: "bg-red-600",
      inactiveColor: "bg-red-100",
      hoverActiveColor: "hover:bg-red-700",
      hoverInactiveColor: "hover:bg-red-200",
      textInactiveColor: "text-red-700",
    },
    {
      value: "1",
      label: "Language Problem",
      activeColor: "bg-green-600",
      inactiveColor: "bg-green-100",
      hoverActiveColor: "hover:bg-green-700",
      hoverInactiveColor: "hover:bg-green-200",
      textInactiveColor: "text-green-700",
    },
    {
      value: "2",
      label: "Misspelling",
      activeColor: "bg-amber-600",
      inactiveColor: "bg-amber-100",
      hoverActiveColor: "hover:bg-amber-700",
      hoverInactiveColor: "hover:bg-amber-200",
      textInactiveColor: "text-amber-700",
    },
    {
      value: "3",
      label: "Special Storm",
      activeColor: "bg-purple-600",
      inactiveColor: "bg-purple-100",
      hoverActiveColor: "hover:bg-purple-700",
      hoverInactiveColor: "hover:bg-purple-200",
      textInactiveColor: "text-purple-700",
    },
  ];

  // Parse current value (comma-separated string) into array
  const selectedValues = value ? value.split(",") : [];

  const handleButtonClick = (selectedValue: string) => {
    let newValues: string[];

    if (selectedValues.includes(selectedValue)) {
      // Remove value if already selected
      newValues = selectedValues.filter((v) => v !== selectedValue);
    } else {
      // Add value if not selected
      newValues = [...selectedValues, selectedValue];
    }

    // Convert array back to comma-separated string
    onChange(newValues.join(","));
  };

  return (
    <FilterSection
      label="Filter by Retirement Reason"
      hasValue={Boolean(value)}
      onClear={() => onChange("")}
    >
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = selectedValues.includes(option.value);
          return (
            <button
              key={option.value}
              onClick={() => handleButtonClick(option.value)}
              className={`rounded-lg px-4 py-2 transition-colors ${
                isActive
                  ? `${option.activeColor} text-white ${option.hoverActiveColor}`
                  : `${option.inactiveColor} ${option.textInactiveColor} ${option.hoverInactiveColor}`
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </FilterSection>
  );
};

export default RetirementReasonCheckbox;
