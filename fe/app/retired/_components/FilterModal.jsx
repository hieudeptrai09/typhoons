import { useState, useEffect, useRef } from "react";

const FilterModal = ({
  isOpen,
  onClose,
  onApply,
  countries,
  initialFilters = {
    searchName: "",
    selectedYear: "",
    selectedCountry: "",
    languageProblemFilter: "all",
  },
}) => {
  const [tempSearchName, setTempSearchName] = useState(
    initialFilters.searchName
  );
  const [tempSelectedYear, setTempSelectedYear] = useState(
    initialFilters.selectedYear
  );
  const [tempSelectedCountry, setTempSelectedCountry] = useState(
    initialFilters.selectedCountry
  );
  const [tempLanguageProblemFilter, setTempLanguageProblemFilter] = useState(
    initialFilters.languageProblemFilter
  );

  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [yearSearch, setYearSearch] = useState("");
  const yearDropdownRef = useRef(null);

  // Generate years from 2000 to current year
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 2000 + 1 },
    (_, i) => 2000 + i
  );

  // Update temp filters when initialFilters change
  useEffect(() => {
    setTempSearchName(initialFilters.searchName);
    setTempSelectedYear(initialFilters.selectedYear);
    setTempSelectedCountry(initialFilters.selectedCountry);
    setTempLanguageProblemFilter(initialFilters.languageProblemFilter);
  }, [initialFilters]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        yearDropdownRef.current &&
        !yearDropdownRef.current.contains(event.target)
      ) {
        setIsYearDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredYears = years.filter((year) =>
    year.toString().includes(yearSearch)
  );

  const handleApply = () => {
    onApply({
      searchName: tempSearchName,
      selectedYear: tempSelectedYear,
      selectedCountry: tempSelectedCountry,
      languageProblemFilter: tempLanguageProblemFilter,
    });
  };

  const handleClearAll = () => {
    setTempSearchName("");
    setTempSelectedYear("");
    setTempSelectedCountry("");
    setTempLanguageProblemFilter("all");
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-2xl max-w-2xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 pb-4 border-b border-gray-300">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Filter Options</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {/* Name Search */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search by Name
              </label>
              <input
                type="text"
                placeholder="Enter typhoon name..."
                value={tempSearchName}
                onChange={(e) => setTempSearchName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:border-blue-500 text-orange-600 outline-none"
              />
            </div>

            {/* Year Select with Search */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Filter by Year
              </label>
              <div className="relative" ref={yearDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                  className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:border-blue-500 text-orange-600 outline-none text-left"
                >
                  {tempSelectedYear || "All Years"}
                </button>

                {isYearDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-yellow-50 border border-gray-400 rounded-lg shadow-lg">
                    <div className="p-2 border-b border-gray-200">
                      <input
                        type="text"
                        placeholder="Search year..."
                        value={yearSearch}
                        onChange={(e) => setYearSearch(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:border-blue-500 text-orange-600 outline-none"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>

                    <div className="max-h-60 overflow-y-auto">
                      <div
                        onClick={() => {
                          setTempSelectedYear("");
                          setIsYearDropdownOpen(false);
                          setYearSearch("");
                        }}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-orange-600"
                      >
                        All Years
                      </div>
                      {filteredYears.map((year) => (
                        <div
                          key={year}
                          onClick={() => {
                            setTempSelectedYear(year);
                            setIsYearDropdownOpen(false);
                            setYearSearch("");
                          }}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-orange-600"
                        >
                          {year}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Country Select */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Filter by Country
              </label>
              <select
                value={tempSelectedCountry}
                onChange={(e) => setTempSelectedCountry(e.target.value)}
                className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:border-blue-500 text-orange-600 outline-none"
              >
                <option value="">All Countries</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            {/* Language Problem Filter - Radio Buttons */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Filter by Retirement Reason
              </label>
              <div className="space-y-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="languageProblem"
                    value="all"
                    checked={tempLanguageProblemFilter === "all"}
                    onChange={(e) =>
                      setTempLanguageProblemFilter(e.target.value)
                    }
                    className="w-4 h-4 text-blue-500 cursor-pointer"
                  />
                  <span className="ml-2 text-gray-700">All Names</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="languageProblem"
                    value="true"
                    checked={tempLanguageProblemFilter === "true"}
                    onChange={(e) =>
                      setTempLanguageProblemFilter(e.target.value)
                    }
                    className="w-4 h-4 text-blue-500 cursor-pointer"
                  />
                  <span className="ml-2 text-green-600">
                    Language Problem (Green)
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="languageProblem"
                    value="false"
                    checked={tempLanguageProblemFilter === "false"}
                    onChange={(e) =>
                      setTempLanguageProblemFilter(e.target.value)
                    }
                    className="w-4 h-4 text-blue-500 cursor-pointer"
                  />
                  <span className="ml-2 text-red-600">
                    Destructive Storm (Red)
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleClearAll}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
            >
              Clear All
            </button>
            <button
              onClick={handleApply}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;