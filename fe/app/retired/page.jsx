"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "../../components/NavBar";
import fetchData from "../../containers/fetcher";

const RetiredNamesPage = () => {
  const [retiredNames, setRetiredNames] = useState([]);
  const [filteredNames, setFilteredNames] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedName, setSelectedName] = useState(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Applied filter states (what's currently filtering the data)
  const [searchName, setSearchName] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [languageProblemFilter, setLanguageProblemFilter] = useState("all");

  // Temporary filter states (what's being edited in the modal)
  const [tempSearchName, setTempSearchName] = useState("");
  const [tempSelectedYear, setTempSelectedYear] = useState("");
  const [tempSelectedCountry, setTempSelectedCountry] = useState("");
  const [tempLanguageProblemFilter, setTempLanguageProblemFilter] =
    useState("all");

  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [yearSearch, setYearSearch] = useState("");
  const yearDropdownRef = useRef(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Generate years from 2000 to current year
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 2000 + 1 },
    (_, i) => 2000 + i
  );

  useEffect(() => {
    fetchData("/typhoon-names?isRetired=1").then((data) => {
      if (data) {
        setRetiredNames(data.data);
        setFilteredNames(data.data);
      }
    });
  }, []);

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

  // Get unique countries for pagination
  const countries = [
    ...new Set(retiredNames.map((name) => name.country)),
  ].sort();

  // Apply filters (only runs when applied filter states change)
  useEffect(() => {
    let filtered = [...retiredNames];

    // Filter by name
    if (searchName) {
      filtered = filtered.filter((name) =>
        name.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    // Filter by year
    if (selectedYear) {
      filtered = filtered.filter((name) => {
        return name.note && name.note.includes(selectedYear);
      });
    }

    // Filter by country
    if (selectedCountry) {
      filtered = filtered.filter((name) => name.country === selectedCountry);
    }

    // Filter by language problem
    if (languageProblemFilter === "true") {
      filtered = filtered.filter(
        (name) => Boolean(name.isLanguageProblem) === true
      );
    } else if (languageProblemFilter === "false") {
      filtered = filtered.filter(
        (name) => Boolean(name.isLanguageProblem) === false
      );
    }

    setFilteredNames(filtered);
  }, [
    searchName,
    selectedYear,
    selectedCountry,
    languageProblemFilter,
    retiredNames,
  ]);

  const activeFilterCount = [
    searchName,
    selectedYear,
    selectedCountry,
    languageProblemFilter !== "all" ? languageProblemFilter : "",
  ].filter(Boolean).length;

  // Paginate by country
  const getPaginatedData = () => {
    let result = [];
    if (activeFilterCount > 0) {
      // If a condition is applied, show all items
      result.push({
        country: "",
        items: filteredNames,
      });
    } else {
      // Group by country and paginate
      const groupedByCountry = {};
      retiredNames.forEach((name) => {
        if (!groupedByCountry[name.country]) {
          groupedByCountry[name.country] = [];
        }
        groupedByCountry[name.country].push(name);
      });

      const countryKeys = Object.keys(groupedByCountry).sort();

      result.push({
        country: countryKeys[currentPage - 1],
        items: groupedByCountry[countryKeys[currentPage - 1]],
      });
    }
    return result;
  };

  const totalPages = 14;

  const loadSuggestions = async (nameId) => {
    fetchData(`/suggested-names?nameId=${nameId}`).then((data) => {
      if (data) {
        setSuggestions(data.data);
      }
    });
  };

  const handleNameClick = async (name) => {
    setSelectedName(name);
    await loadSuggestions(name.id);
  };

  const closeModal = () => {
    setSelectedName(null);
  };

  const openFilterModal = () => {
    // Copy current applied filters to temporary states
    setTempSearchName(searchName);
    setTempSelectedYear(selectedYear);
    setTempSelectedCountry(selectedCountry);
    setTempLanguageProblemFilter(languageProblemFilter);
    setIsFilterModalOpen(true);
  };

  const closeFilterModal = () => {
    setIsFilterModalOpen(false);
  };

  const applyFilters = () => {
    // Apply the temporary filters to the actual filter states
    setSearchName(tempSearchName);
    setSelectedYear(tempSelectedYear);
    setSelectedCountry(tempSelectedCountry);
    setLanguageProblemFilter(tempLanguageProblemFilter);
    setIsFilterModalOpen(false);
  };

  const clearAllFilters = () => {
    // Clear only temporary filters (not applied until "Apply Filters" is clicked)
    setTempSearchName("");
    setTempSelectedYear("");
    setTempSelectedCountry("");
    setTempLanguageProblemFilter("all");
  };

  const filteredYears = years.filter((year) =>
    year.toString().includes(yearSearch)
  );

  return (
    <div className="min-h-screen bg-sky-100">
      <Navbar />
      <div className="p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          Retired Typhoon Names
        </h1>

        {/* Filter Button */}
        <div className="max-w-4xl mx-auto mb-6">
          <button
            onClick={openFilterModal}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold flex items-center gap-2 mx-auto"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-white text-blue-500 rounded-full px-2 py-0.5 text-sm font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {getPaginatedData().map((group, gidx) => (
              <div key={gidx}>
                <h2 className="text-2xl font-bold text-blue-600 mb-4 pb-2 border-b-2 border-blue-200">
                  {group.country}
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Meaning
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Country
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Note
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {group.items?.map((name, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => handleNameClick(name)}
                        >
                          <td className="px-6 py-4">
                            <span
                              className={`text-lg font-bold ${
                                name.isLanguageProblem
                                  ? "text-green-600"
                                  : name.name === "Vamei"
                                  ? "text-purple-600"
                                  : "text-red-600"
                              }`}
                            >
                              {name.name}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-700">
                            {name.meaning}
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {name.country}
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {name.note || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
          {/* Pagination */}
          {activeFilterCount === 0 && totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
              >
                Previous
              </button>

              <span className="px-4 py-2 text-gray-700">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter Modal */}
      {isFilterModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={closeFilterModal}
        >
          <div
            className="bg-white rounded-lg shadow-2xl max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 pb-4 border-b border-gray-300">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  Filter Options
                </h2>
                <button
                  onClick={closeFilterModal}
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
                  onClick={clearAllFilters}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
                >
                  Clear All
                </button>
                <button
                  onClick={applyFilters}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Name Details Modal */}
      {selectedName && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 pb-4 border-b border-gray-300">
              <div className="flex justify-between items-start">
                <div>
                  <h2
                    className={`text-3xl font-bold mb-2 ${
                      selectedName.isLanguageProblem
                        ? "text-green-600"
                        : selectedName.name === "Vamei"
                        ? "text-purple-600"
                        : "text-red-600"
                    }`}
                  >
                    {selectedName.name}
                  </h2>
                  <p className="text-gray-700">
                    <span className="font-semibold">Meaning:</span>{" "}
                    {selectedName.meaning}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Country:</span>{" "}
                    {selectedName.country}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(80vh-200px)]">
              <h3 className="font-bold text-xl mb-4 text-gray-800">
                Suggested Replacements
              </h3>
              <div className="space-y-3">
                {suggestions.map((suggestion, sidx) => (
                  <div
                    key={sidx}
                    className={`p-4 rounded-lg ${
                      suggestion.isChosen
                        ? "bg-blue-100 border-2 border-blue-500"
                        : "bg-gray-50"
                    }`}
                  >
                    <div className="font-semibold text-gray-800 mb-1">
                      {suggestion.replacementName}
                      {Boolean(suggestion.isChosen) && (
                        <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded">
                          CHOSEN
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      {suggestion.replacementMeaning}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RetiredNamesPage;
