"use client";

import { useState, useEffect } from "react";
import Navbar from "../../components/NavBar";
import fetchData from "../../containers/fetcher";
import FilterModal from "./_components/FilterModal/FilterModal";
import NameDetailsModal from "./_components/NameDetailsModal/NameDetailsModal";
import FilterButton from "./_components/MainPage/FilterButton";
import RetiredNamesTable from "./_components/MainPage/RetiredNamesTable";
import Pagination from "./_components/MainPage/Pagination";
import { useFilteredNames } from "./_hooks/useFilteredNames";
import { usePagination } from "./_hooks/usePagination";

const RetiredNamesPage = () => {
  const [retiredNames, setRetiredNames] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedName, setSelectedName] = useState(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Applied filter states
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
      }
    });
  }, []);

  const countries = [
    ...new Set(retiredNames.map((name) => name.country)),
  ].sort();

  const { filteredNames, activeFilterCount } = useFilteredNames({
    retiredNames,
    searchName,
    selectedYear,
    selectedCountry,
    languageProblemFilter,
  });

  const { paginatedData, totalPages } = usePagination({
    retiredNames,
    filteredNames,
    activeFilterCount,
    currentPage,
  });

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

        <FilterButton
          activeFilterCount={activeFilterCount}
          onClick={() => setIsFilterModalOpen(true)}
        />

        <div className="max-w-4xl mx-auto">
          <RetiredNamesTable
            paginatedData={paginatedData}
            onNameClick={handleNameClick}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            activeFilterCount={activeFilterCount}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyFilters}
        countries={countries}
        initialFilters={{
          searchName,
          selectedYear,
          selectedCountry,
          languageProblemFilter,
        }}
      />

      <NameDetailsModal
        selectedName={selectedName}
        suggestions={suggestions}
        onClose={() => setSelectedName(null)}
      />
    </div>
  );
};

export default RetiredNamesPage;
