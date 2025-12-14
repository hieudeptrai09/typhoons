import { Modal } from "../../../../../components/Modal";
import { useState, useEffect } from "react";
import FilterSection from "./FilterSection";

const FilterModal = ({
  isOpen,
  onClose,
  onApply,
  countries,
  languages,
  initialFilters,
}) => {
  const [tempSearchName, setTempSearchName] = useState(
    initialFilters.searchName
  );
  const [tempSelectedCountry, setTempSelectedCountry] = useState(
    initialFilters.selectedCountry
  );
  const [tempSelectedLanguage, setTempSelectedLanguage] = useState(
    initialFilters.selectedLanguage
  );

  useEffect(() => {
    setTempSearchName(initialFilters.searchName);
    setTempSelectedCountry(initialFilters.selectedCountry);
    setTempSelectedLanguage(initialFilters.selectedLanguage);
  }, [initialFilters]);

  const handleApply = () => {
    onApply({
      searchName: tempSearchName,
      selectedCountry: tempSelectedCountry,
      selectedLanguage: tempSelectedLanguage,
    });
  };

  const handleClearAll = () => {
    setTempSearchName("");
    setTempSelectedCountry("");
    setTempSelectedLanguage("");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Filter Options"
      wrapperClassName="max-w-md"
    >
      <div className="space-y-4">
        <FilterSection
          label="Filter by Name"
          hasValue={Boolean(tempSearchName)}
          onClear={() => setTempSearchName("")}
        >
          <input
            type="text"
            placeholder="Enter typhoon name..."
            value={tempSearchName}
            onChange={(e) => setTempSearchName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:border-blue-500 text-blue-600 outline-none"
          />
        </FilterSection>

        <FilterSection
          label="Filter by Country"
          hasValue={Boolean(tempSelectedCountry)}
          onClear={() => setTempSelectedCountry("")}
        >
          <select
            value={tempSelectedCountry}
            onChange={(e) => setTempSelectedCountry(e.target.value)}
            className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:border-blue-500 text-blue-500 outline-none"
          >
            <option value="">All Countries</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </FilterSection>

        <FilterSection
          label="Filter by Language"
          hasValue={Boolean(tempSelectedLanguage)}
          onClear={() => setTempSelectedLanguage("")}
        >
          <select
            value={tempSelectedLanguage}
            onChange={(e) => setTempSelectedLanguage(e.target.value)}
            className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:border-blue-500 text-blue-500 outline-none"
          >
            <option value="">All Languages</option>
            {languages.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
        </FilterSection>
      </div>

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
    </Modal>
  );
};

export default FilterModal;
