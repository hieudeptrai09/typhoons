const RetirementReasonRadio = ({ value, onChange }) => {
  const options = [
    { value: "all", label: "All Names", colorClass: "text-gray-700" },
    {
      value: "true",
      label: "Language Problem (Green)",
      colorClass: "text-green-600",
    },
    {
      value: "false",
      label: "Destructive Storm (Red)",
      colorClass: "text-red-600",
    },
  ];

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Filter by Retirement Reason
      </label>
      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center cursor-pointer"
          >
            <input
              type="radio"
              name="languageProblem"
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="w-4 h-4 text-blue-500 cursor-pointer"
            />
            <span className={`ml-2 ${option.colorClass}`}>{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default RetirementReasonRadio;
