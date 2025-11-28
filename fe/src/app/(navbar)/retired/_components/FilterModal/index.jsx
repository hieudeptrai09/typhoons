import { Modal } from "../../../../../components/Modal";
import { useState, useEffect } from "react";
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Filter Options"
      wrapperClassName="max-w-2xl"
    >
      <div className="space-y-4">
        <NameSearchInput value={tempSearchName} onChange={setTempSearchName} />

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
    </Modal>
  );
};

export default FilterModal;
