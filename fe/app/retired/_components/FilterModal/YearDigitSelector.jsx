const YearDigitSelector = ({ value, onChange }) => {
  // Parse current year value into digits
  const yearString = value ? value.toString().padStart(4, "0") : "0000";
  const digits = yearString.split("");

  const digitOptions = Array.from({ length: 10 }, (_, i) => i.toString());

  const handleDigitChange = (position, newDigit) => {
    const newDigits = [...digits];
    newDigits[position] = newDigit;
    const newYear = newDigits.join("");

    // If all zeros, return empty string
    if (newYear === "0000") {
      onChange("");
    } else {
      onChange(parseInt(newYear, 10));
    }
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Filter by Year
      </label>
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {digits.map((digit, index) => (
            <select
              key={index}
              value={digit}
              onChange={(e) => handleDigitChange(index, e.target.value)}
              className="w-16 px-2 py-2 border border-gray-400 rounded-lg focus:border-blue-500 text-purple-600 outline-none text-center font-mono text-lg"
            >
              {digitOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ))}
        </div>
      </div>
    </div>
  );
};

export default YearDigitSelector;
