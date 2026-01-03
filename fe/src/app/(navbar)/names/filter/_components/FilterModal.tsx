import { useState, useEffect } from "react";
import Modal from "../../../../../components/Modal";
import FilterSection from "./FilterSection";
import { FilterModalProps } from "../../../../../types";

const FilterModal = ({
  isOpen,
  onClose,
  onApply,
  countries,
  languages,
  initialFilters,
}: FilterModalProps) => {
  const [tempSearchName, setTempSearchName] = useState(initialFilters.name);
  const [tempSelectedCountry, setTempSelectedCountry] = useState(initialFilters.country);
  const [tempSelectedLanguage, setTempSelectedLanguage] = useState(initialFilters.language);

  useEffect(() => {
    setTempSearchName(initialFilters.name);
    setTempSelectedCountry(initialFilters.country);
    setTempSelectedLanguage(initialFilters.language);
  }, [initialFilters]);

  const handleApply = () => {
    onApply({
      name: tempSearchName,
      country: tempSelectedCountry,
      language: tempSelectedLanguage,
    });
  };

  const handleClearAll = () => {
    setTempSearchName("");
    setTempSelectedCountry("");
    setTempSelectedLanguage("");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Filter Options" wrapperClassName="max-w-md">
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
            className="w-full rounded-lg border border-gray-400 px-4 py-2 text-blue-600 outline-none focus:border-blue-500"
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
            className="w-full rounded-lg border border-gray-400 px-4 py-2 text-blue-500 outline-none focus:border-blue-500"
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
            className="w-full rounded-lg border border-gray-400 px-4 py-2 text-blue-500 outline-none focus:border-blue-500"
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

      <div className="mt-6 flex gap-3">
        <button
          onClick={handleClearAll}
          className="flex-1 rounded-lg bg-gray-300 px-4 py-2 font-semibold text-gray-700 transition-colors hover:bg-gray-400"
        >
          Clear All
        </button>
        <button
          onClick={handleApply}
          className="flex-1 rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-600"
        >
          Apply Filters
        </button>
      </div>
    </Modal>
  );
};

export default FilterModal;
