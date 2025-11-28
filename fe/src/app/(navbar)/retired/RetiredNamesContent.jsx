"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import fetchData from "../../../containers/utils/fetcher";
import { TITLE_COMMON } from "../../../constants";
import FilterModal from "./_components/FilterModal";
import NameDetailsModal from "./_components/NameDetailsModal";
import FilterButton from "./_components/MainPage/FilterButton";
import RetiredNamesTable from "./_components/MainPage/RetiredNamesTable";
import Pagination from "./_components/MainPage/Pagination";
import { useFilteredNames } from "./_hooks/useFilteredNames";
import { usePagination } from "./_hooks/usePagination";
import { getRetiredNamesTitle } from "./_utils/fns";
import PageHeader from "../../../components/PageHeader";

const RetiredNamesContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [retiredNames, setRetiredNames] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedName, setSelectedName] = useState(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Applied filter states - initialized from URL
  const [searchName, setSearchName] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [retirementReasons, setRetirementReasons] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Initialize filters from URL parameters
  useEffect(() => {
    const name = searchParams.get("name") || "";
    const year = searchParams.get("year") || "";
    const country = searchParams.get("country") || "";
    const lang = searchParams.get("lang");

    setSearchName(name);
    setSelectedYear(year ? parseInt(year) : "");
    setSelectedCountry(country);

    // Parse lang parameter to array
    const reasons = [];
    if (lang === "true") {
      reasons.push("language");
    } else if (lang === "false") {
      reasons.push("destructive");
    } else if (lang === "both") {
      reasons.push("language", "destructive");
    }
    setRetirementReasons(reasons);
  }, [searchParams]);

  // Update page title based on filters (client-side)
  useEffect(() => {
    // Convert retirementReasons array back to lang format
    let lang = "";
    if (retirementReasons.length === 2) {
      lang = "both";
    } else if (retirementReasons.includes("language")) {
      lang = "true";
    } else if (retirementReasons.includes("destructive")) {
      lang = "false";
    }

    const titleParts = getRetiredNamesTitle(
      searchName,
      selectedYear?.toString() || "",
      selectedCountry,
      lang
    );

    document.title = titleParts
      ? `Retired Names: ${titleParts} | ${TITLE_COMMON}`
      : `Retired Typhoon Names | ${TITLE_COMMON}`;
  }, [searchName, selectedYear, selectedCountry, retirementReasons]);

  // Update URL when filters change
  const updateURL = (filters) => {
    const params = new URLSearchParams();

    if (filters.searchName) {
      params.set("name", filters.searchName);
    }
    if (filters.selectedYear) {
      params.set("year", filters.selectedYear.toString());
    }
    if (filters.selectedCountry) {
      params.set("country", filters.selectedCountry);
    }

    // Convert retirement reasons array to lang parameter
    if (filters.retirementReasons.length === 2) {
      params.set("lang", "both");
    } else if (filters.retirementReasons.includes("language")) {
      params.set("lang", "true");
    } else if (filters.retirementReasons.includes("destructive")) {
      params.set("lang", "false");
    }

    const queryString = params.toString();
    const newURL = queryString ? `/retired?${queryString}` : "/retired";
    router.push(newURL);
  };

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
    retirementReasons,
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
    setRetirementReasons(filters.retirementReasons);
    setIsFilterModalOpen(false);
    updateURL(filters);
  };

  return (
    <PageHeader title="Retired Typhoon Names">
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

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyFilters}
        countries={countries}
        initialFilters={{
          searchName,
          selectedYear,
          selectedCountry,
          retirementReasons,
        }}
      />

      <NameDetailsModal
        selectedName={selectedName}
        suggestions={suggestions}
        onClose={() => setSelectedName(null)}
      />
    </PageHeader>
  );
};

export default RetiredNamesContent;
