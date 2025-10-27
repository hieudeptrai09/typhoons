import { useState, useEffect } from "react";
import ModalHeader from "./FilterModalHeader";
import NameSearchInput from "./NameSearchInput";
import YearDigitSelector from "./YearDigitSelector";
import CountrySelect from "./CountrySelect";
import RetirementReasonCheckbox from "./RetirementReasonCheckbox";
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
    retirementReasons: [],
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
  const [tempRetirementReasons, setTempRetirementReasons] = useState(
    initialFilters.retirementReasons
  );

  useEffect(() => {
    setTempSearchName(initialFilters.searchName);
    setTempSelectedYear(initialFilters.selectedYear);
    setTempSelectedCountry(initialFilters.selectedCountry);
    setTempRetirementReasons(initialFilters.retirementReasons);
  }, [initialFilters]);

  const handleApply = () => {
    onApply({
      searchName: tempSearchName,
      selectedYear: tempSelectedYear,
      selectedCountry: tempSelectedCountry,
      retirementReasons: tempRetirementReasons,
    });
  };

  const handleClearAll = () => {
    setTempSearchName("");
    setTempSelectedYear("");
    setTempSelectedCountry("");
    setTempRetirementReasons([]);
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

            <YearDigitSelector
              value={tempSelectedYear}
              onChange={setTempSelectedYear}
            />

            <CountrySelect
              value={tempSelectedCountry}
              onChange={setTempSelectedCountry}
              countries={countries}
            />

            <RetirementReasonCheckbox
              value={tempRetirementReasons}
              onChange={setTempRetirementReasons}
            />
          </div>

          <ModalActions onClearAll={handleClearAll} onApply={handleApply} />
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
