"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import fetchData from "../../../containers/utils/fetcher";
import TyphoonNamesTable from "./_components/TyphoonNamesTable";
import TyphoonNameModal from "./_components/TyphoonNamesModal";
import FilterModal from "./_components/FilterModal";
import FilterButton from "./_components/FilterButton";
import FilteredNamesTable from "./_components/FilteredNamesTable";
import Toggle from "./_components/Toggle";
import PageHeader from "../../../components/PageHeader";

const CurrentNamesPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [names, setNames] = useState([]);
  const [selectedName, setSelectedName] = useState(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Filter states
  const [searchName, setSearchName] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");

  // Toggle for showing images and descriptions
  const [showImageAndDescription, setShowImageAndDescription] = useState(false);

  // Initialize filters from URL
  useEffect(() => {
    const name = searchParams.get("name") || "";
    const country = searchParams.get("country") || "";

    setSearchName(name);
    setSelectedCountry(country);
  }, [searchParams]);

  useEffect(() => {
    fetchData("/typhoon-names?isRetired=0").then((data) => {
      if (data) setNames(data.data);
    });
  }, []);

  const countries = useMemo(() => {
    return [...new Set(names.map((name) => name.country))].sort();
  }, [names]);

  const filteredNames = useMemo(() => {
    let filtered = [...names];

    if (searchName) {
      filtered = filtered.filter((name) =>
        name.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    if (selectedCountry) {
      filtered = filtered.filter((name) => name.country === selectedCountry);
    }

    return filtered;
  }, [names, searchName, selectedCountry]);

  const activeFilterCount = [searchName, selectedCountry].filter(
    Boolean
  ).length;
  const hasFilters = activeFilterCount > 0;

  const updateURL = (filters) => {
    const params = new URLSearchParams();
    if (filters.searchName) params.set("name", filters.searchName);
    if (filters.selectedCountry) params.set("country", filters.selectedCountry);

    const queryString = params.toString();
    const newURL = queryString ? `/stormnames?${queryString}` : "/stormnames";
    router.push(newURL);
  };

  const handleApplyFilters = (filters) => {
    setSearchName(filters.searchName);
    setSelectedCountry(filters.selectedCountry);
    setIsFilterModalOpen(false);
    updateURL(filters);
  };

  return (
    <PageHeader title="Current Typhoon Names">
      <FilterButton
        activeFilterCount={activeFilterCount}
        onClick={() => setIsFilterModalOpen(true)}
        params={{
          name: searchName,
          country: selectedCountry,
        }}
      />

      {hasFilters && (
        <Toggle
          value={showImageAndDescription}
          onChange={setShowImageAndDescription}
        />
      )}

      {hasFilters ? (
        <FilteredNamesTable
          filteredNames={filteredNames}
          showImageAndDescription={showImageAndDescription}
          onNameClick={setSelectedName}
        />
      ) : (
        <TyphoonNamesTable names={names} onNameClick={setSelectedName} />
      )}

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyFilters}
        countries={countries}
        initialFilters={{
          searchName,
          selectedCountry,
        }}
      />

      <TyphoonNameModal
        selectedName={selectedName}
        onClose={() => setSelectedName(null)}
      />
    </PageHeader>
  );
};

export default CurrentNamesPage;
