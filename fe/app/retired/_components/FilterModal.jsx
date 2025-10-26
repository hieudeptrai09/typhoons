import { useState, useEffect } from "react";
import ModalHeader from "./FilterModalHeader";
import NameSearchInput from "./NameSearchInput";
import YearDropdown from "./YearDropdown";
import CountrySelect from "./CountrySelect";
import RetirementReasonRadio from "./RetirementReasonRadio";
import ModalActions from "./ModalActions";

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

  // Update temp filters when initialFilters change
  useEffect(() => {
    setTempSearchName(initialFilters.searchName);
    setTempSelectedYear(initialFilters.selectedYear);
    setTempSelectedCountry(initialFilters.selectedCountry);
    setTempLanguageProblemFilter(initialFilters.languageProblemFilter);
  }, [initialFilters]);

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
        <ModalHeader onClose={onClose} />

        <div className="p-6">
          <div className="space-y-4">
            <NameSearchInput
              value={tempSearchName}
              onChange={setTempSearchName}
            />

            <YearDropdown
              value={tempSelectedYear}
              onChange={setTempSelectedYear}
            />

            <CountrySelect
              value={tempSelectedCountry}
              onChange={setTempSelectedCountry}
              countries={countries}
            />

            <RetirementReasonRadio
              value={tempLanguageProblemFilter}
              onChange={setTempLanguageProblemFilter}
            />
          </div>

          <ModalActions onClearAll={handleClearAll} onApply={handleApply} />
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
