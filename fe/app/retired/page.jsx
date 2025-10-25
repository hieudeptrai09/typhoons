"use client";

import { useState, useEffect } from "react";
import Navbar from "../../components/NavBar";
import fetchData from "../../containers/fetcher";

const RetiredNamesPage = () => {
  const [retiredNames, setRetiredNames] = useState([]);
  const [filteredNames, setFilteredNames] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedName, setSelectedName] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchName, setSearchName] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [yearSearch, setYearSearch] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
      setLoading(false);
    });
  }, []);

  // Get unique countries for pagination
  const countries = [
    ...new Set(retiredNames.map((name) => name.country)),
  ].sort();

  // Apply filters
  useEffect(() => {
    let filtered = [...retiredNames];

    // Filter by name
    if (searchName) {
      filtered = filtered.filter((name) =>
        name.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    // Filter by year (assuming there's a year field or we can extract from note)
    if (selectedYear) {
      filtered = filtered.filter((name) => {
        // You may need to adjust this based on your data structure
        // This assumes year info might be in the note field
        return name.note && name.note.includes(selectedYear);
      });
    }

    // Filter by country
    if (selectedCountry) {
      filtered = filtered.filter((name) => name.country === selectedCountry);
    }

    setFilteredNames(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchName, selectedYear, selectedCountry, retiredNames]);

  // Paginate by country
  const getPaginatedData = () => {
    if (selectedCountry) {
      // If a country is selected, show all items from that country
      return filteredNames;
    } else {
      // Group by country and paginate
      const groupedByCountry = {};
      filteredNames.forEach((name) => {
        if (!groupedByCountry[name.country]) {
          groupedByCountry[name.country] = [];
        }
        groupedByCountry[name.country].push(name);
      });

      const countryKeys = Object.keys(groupedByCountry).sort();
      const startIdx = (currentPage - 1) * itemsPerPage;
      const endIdx = startIdx + itemsPerPage;

      let result = [];
      let currentCount = 0;

      for (const country of countryKeys) {
        const countryItems = groupedByCountry[country];
        if (currentCount >= endIdx) break;

        if (currentCount + countryItems.length > startIdx) {
          result.push({
            country,
            items: countryItems,
          });
        }
        currentCount += countryItems.length;
      }

      return result;
    }
  };

  const totalPages = selectedCountry
    ? 1
    : Math.ceil(filteredNames.length / itemsPerPage);

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

  const filteredYears = years.filter((year) =>
    year.toString().includes(yearSearch)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          Retired Typhoon Names
        </h1>

        {/* Filters */}
        <div className="max-w-4xl mx-auto mb-6 bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Name Search */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search by Name
              </label>
              <input
                type="text"
                placeholder="Enter typhoon name..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Year Select with Search */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Filter by Year
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search year..."
                  value={yearSearch}
                  onChange={(e) => setYearSearch(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                />
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Years</option>
                  {filteredYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Country Select */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Filter by Country
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Countries</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          {(searchName || selectedYear || selectedCountry) && (
            <button
              onClick={() => {
                setSearchName("");
                setSelectedYear("");
                setSelectedCountry("");
                setYearSearch("");
              }}
              className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Clear All Filters
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-20">Loading...</div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {selectedCountry ? (
              // Show filtered results when country is selected
              <div className="space-y-4">
                {filteredNames.length > 0 ? (
                  filteredNames.map((name, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => handleNameClick(name)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-red-600 mb-2">
                            {name.name}
                          </h3>
                          <p className="text-gray-700 mb-2">
                            <span className="font-semibold">Meaning:</span>{" "}
                            {name.meaning}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-semibold">Country:</span>{" "}
                            {name.country}
                          </p>
                          {name.note && (
                            <p className="text-gray-600 mt-2">
                              <span className="font-semibold">Note:</span>{" "}
                              {name.note}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 text-gray-500">
                    No results found
                  </div>
                )}
              </div>
            ) : (
              // Show paginated results grouped by country
              <div className="space-y-8">
                {getPaginatedData().map((group, gidx) => (
                  <div key={gidx}>
                    <h2 className="text-2xl font-bold text-blue-600 mb-4 pb-2 border-b-2 border-blue-200">
                      {group.country}
                    </h2>
                    <div className="space-y-4">
                      {group.items.map((name, idx) => (
                        <div
                          key={idx}
                          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                          onClick={() => handleNameClick(name)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="text-2xl font-bold text-red-600 mb-2">
                                {name.name}
                              </h3>
                              <p className="text-gray-700 mb-2">
                                <span className="font-semibold">Meaning:</span>{" "}
                                {name.meaning}
                              </p>
                              <p className="text-gray-600">
                                <span className="font-semibold">Country:</span>{" "}
                                {name.country}
                              </p>
                              {name.note && (
                                <p className="text-gray-600 mt-2">
                                  <span className="font-semibold">Note:</span>{" "}
                                  {name.note}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {filteredNames.length === 0 && (
                  <div className="text-center py-20 text-gray-500">
                    No results found
                  </div>
                )}
              </div>
            )}

            {/* Pagination */}
            {!selectedCountry && totalPages > 1 && (
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
        )}
      </div>

      {/* Modal */}
      {selectedName && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-bold text-red-600 mb-2">
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
              {suggestions ? (
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
                        {suggestion.isChosen && (
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
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Loading suggestions...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RetiredNamesPage;
