import { useState, useEffect } from "react";

const NULL_DIGIT = "−";

const YearDigitSelector = ({ value, onChange }) => {
  // Local state to track individual digits (including NULL_DIGIT)
  const [digits, setDigits] = useState([
    NULL_DIGIT,
    NULL_DIGIT,
    NULL_DIGIT,
    NULL_DIGIT,
  ]);

  // Digit options including NULL_DIGIT for "any"
  const digitOptions = [
    NULL_DIGIT,
    ...Array.from({ length: 10 }, (_, i) => i.toString()),
  ];

  // Initialize digits from value prop
  useEffect(() => {
    if (value && value !== "") {
      const yearString = value.toString().padStart(4, "0");
      setDigits(yearString.split(""));
    } else {
      setDigits([NULL_DIGIT, NULL_DIGIT, NULL_DIGIT, NULL_DIGIT]);
    }
  }, [value]);

  const handleDigitChange = (position, newDigit) => {
    const newDigits = [...digits];
    newDigits[position] = newDigit;
    setDigits(newDigits);

    // Check if any digit is NULL_DIGIT
    if (newDigits.some((d) => d === NULL_DIGIT)) {
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
                <option
                  key={option}
                  value={option}
                  disabled={option === NULL_DIGIT}
                >
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
