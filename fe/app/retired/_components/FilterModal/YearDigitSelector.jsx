import { useState, useEffect } from "react";

const YearDigitSelector = ({ value, onChange }) => {
  // Local state to track individual digits (including "-")
  const [digits, setDigits] = useState(["−", "−", "−", "−"]);

  // Digit options including "-" for "any"
  const digitOptions = [
    "−",
    ...Array.from({ length: 10 }, (_, i) => i.toString()),
  ];

  // Initialize digits from value prop
  useEffect(() => {
    if (value && value !== "") {
      const yearString = value.toString().padStart(4, "0");
      setDigits(yearString.split(""));
    } else {
      setDigits(["−", "−", "−", "−"]);
    }
  }, [value]);

  const handleDigitChange = (position, newDigit) => {
    const newDigits = [...digits];
    newDigits[position] = newDigit;
    setDigits(newDigits);

    // Check if any digit is "−"
    if (newDigits.some((d) => d === "−")) {
      onChange("");
      return;
    }

    // All digits are numbers, convert to year
    const newYear = newDigits.join("");
    onChange(parseInt(newYear, 10));
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
