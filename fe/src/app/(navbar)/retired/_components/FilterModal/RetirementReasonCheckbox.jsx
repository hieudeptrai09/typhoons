import FilterSection from "./FilterSection";

const RetirementReasonCheckbox = ({ value, onChange }) => {
  const options = [
    {
      value: "language",
      label: "Language Problem",
      activeColor: "bg-green-600",
      inactiveColor: "bg-green-100",
      hoverActiveColor: "hover:bg-green-700",
      hoverInactiveColor: "hover:bg-green-200",
      textInactiveColor: "text-green-700",
    },
    {
      value: "destructive",
      label: "Destructive Storm",
      activeColor: "bg-red-600",
      inactiveColor: "bg-red-100",
      hoverActiveColor: "hover:bg-red-700",
      hoverInactiveColor: "hover:bg-red-200",
      textInactiveColor: "text-red-700",
    },
  ];

  const handleButtonClick = (selectedValue) => {
    // If clicking the same button, deselect it (set to empty string)
    if (value === selectedValue) {
      onChange("");
    } else {
      // Select this option
      onChange(selectedValue);
    }
  };

  return (
    <FilterSection
      label="Filter by Retirement Reason"
      hasValue={Boolean(value)}
      onClear={() => onChange("")}
    >
      <div className="flex gap-2">
        {options.map((option) => {
          const isActive = value === option.value;
          return (
            <button
              key={option.value}
              onClick={() => handleButtonClick(option.value)}
              className={`px-4 py-2 rounded-lg ${
                isActive
                  ? `${option.activeColor} text-white ${option.hoverColor}`
                  : `bg-gray-200 text-gray-700 hover:bg-gray-300`
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
