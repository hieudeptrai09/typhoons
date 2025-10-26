"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "../../components/NavBar";
import fetchData from "../../containers/fetcher";
import FilterModal from "./_components/FilterModal";
import NameDetailsModal from "./_components/NameDetailsModal";
import FilterIcon from "./assets/filter-icon.svg";

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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchData("/typhoon-names?isRetired=1").then((data) => {
      if (data) {
        setRetiredNames(data.data);
        setFilteredNames(data.data);
      }
    });
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
      filtered = filtered.filter((name) => name.lastYear === selectedYear);
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

  const closeNameModal = () => {
    setSelectedName(null);
  };

  const openFilterModal = () => {
    setIsFilterModalOpen(true);
  };

  const closeFilterModal = () => {
    setIsFilterModalOpen(false);
  };

  const handleApplyFilters = (filters) => {
    setSearchName(filters.searchName);
    setSelectedYear(filters.selectedYear);
    setSelectedCountry(filters.selectedCountry);
    setLanguageProblemFilter(filters.languageProblemFilter);
    setIsFilterModalOpen(false);
  };

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
            <Image src={FilterIcon} alt="Filter" width={20} height={20} />
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
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Year of last storm
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
                          <td className="px-6 py-4 text-gray-600">
                            {name.lastYear}
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
                onClick={() =>
                  setCurrentPage((p) =>
                    p === 1 ? totalPages : Math.max(1, p - 1)
                  )
                }
                className={`px-4 py-2 text-white rounded-lg transition-colors ${
                  currentPage === 1
                    ? "bg-gray-300 hover:bg-gray-400"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                Previous
              </button>

              <span className="px-4 py-2 text-gray-700">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((p) =>
                    p === totalPages ? 1 : Math.min(totalPages, p + 1)
                  )
                }
                className={`px-4 py-2 text-white rounded-lg transition-colors ${
                  currentPage === totalPages
                    ? "bg-gray-300 hover:bg-gray-400"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={closeFilterModal}
        onApply={handleApplyFilters}
        countries={countries}
        initialFilters={{
          searchName,
          selectedYear,
          selectedCountry,
          languageProblemFilter,
        }}
      />

      {/* Name Details Modal */}
      <NameDetailsModal
        selectedName={selectedName}
        suggestions={suggestions}
        onClose={closeNameModal}
      />
    </div>
  );
};

export default RetiredNamesPage;
