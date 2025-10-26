import { useState, useEffect, useRef } from "react";
import YearDropdownList from "./YearDropdownList";

const YearDropdown = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [yearSearch, setYearSearch] = useState("");
  const dropdownRef = useRef(null);

  // Generate years from 2000 to current year
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 2000 + 1 },
    (_, i) => 2000 + i
  );

  const filteredYears = years.filter((year) =>
    year.toString().includes(yearSearch)
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleYearSelect = (year) => {
    onChange(year);
    setIsOpen(false);
    setYearSearch("");
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Filter by Year
      </label>
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:border-blue-500 text-orange-600 outline-none text-left"
        >
          {value || "All Years"}
        </button>

        {isOpen && (
          <YearDropdownList
            years={filteredYears}
            yearSearch={yearSearch}
            onYearSearchChange={setYearSearch}
            onYearSelect={handleYearSelect}
          />
        )}
      </div>
    </div>
  );
};

export default YearDropdown;
