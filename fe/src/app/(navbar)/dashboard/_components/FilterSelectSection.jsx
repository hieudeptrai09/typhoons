const Select = ({
  value,
  onChange,
  options,
  disabled = false,
  className = "",
}) => {
  const baseClassName =
    "w-full px-4 py-2 border border-gray-400 rounded-lg focus:border-blue-500 text-blue-500 outline-none";
  const disabledClassName = disabled
    ? "bg-gray-100 cursor-not-allowed opacity-60"
    : "";

  return (
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`${baseClassName} ${disabledClassName} ${className}`}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} disabled={opt.disabled}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};

export const FilterSelectSection = ({
  label,
  value,
  onChange,
  options,
  hasValue,
  onClear,
  disabled = false,
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-semibold text-gray-700">{label}</label>
        {hasValue && !disabled && (
          <button
            onClick={onClear}
            className="text-sm text-blue-500 hover:text-blue-600 hover:underline"
          >
            Clear
          </button>
        )}
      </div>
      <Select
        value={value}
        onChange={onChange}
        options={options}
        disabled={disabled}
      />
    </div>
  );
};
