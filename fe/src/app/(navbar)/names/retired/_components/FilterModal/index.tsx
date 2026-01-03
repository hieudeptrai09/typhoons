import { useState, useEffect } from "react";
import Modal from "../../../../../../components/Modal";
import CountrySelect from "./CountrySelect";
import ModalActions from "./ModalActions";
import NameSearchInput from "./NameSearchInput";
import RetirementReasonCheckbox from "./RetirementReasonCheckbox";
import YearDigitSelector from "./YearDigitSelector";
import type { BaseModalProps, RetiredFilterParams } from "../../../../../../types";

interface FilterModalProps extends BaseModalProps {
  onApply: (filters: RetiredFilterParams) => void;
  countries: string[];
  initialFilters: RetiredFilterParams;
}

const FilterModal = ({ isOpen, onClose, onApply, countries, initialFilters }: FilterModalProps) => {
  const [tempSearchName, setTempSearchName] = useState(initialFilters.name);
  const [tempSelectedYear, setTempSelectedYear] = useState(initialFilters.year);
  const [tempSelectedCountry, setTempSelectedCountry] = useState(initialFilters.country);
  const [tempRetirementReason, setTempRetirementReason] = useState(initialFilters.reason);

  useEffect(() => {
    setTempSearchName(initialFilters.name);
    setTempSelectedYear(initialFilters.year);
    setTempSelectedCountry(initialFilters.country);
    setTempRetirementReason(initialFilters.reason);
  }, [initialFilters]);

  const handleApply = () => {
    onApply({
      name: tempSearchName,
      year: tempSelectedYear,
      country: tempSelectedCountry,
      reason: tempRetirementReason,
    });
  };

  const handleClearAll = () => {
    setTempSearchName("");
    setTempSelectedYear("");
    setTempSelectedCountry("");
    setTempRetirementReason("");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Filter Options" wrapperClassName="max-w-2xl">
      <div className="space-y-4">
        <NameSearchInput value={tempSearchName} onChange={setTempSearchName} />

        <YearDigitSelector value={tempSelectedYear} onChange={setTempSelectedYear} />

        <CountrySelect
          value={tempSelectedCountry}
          onChange={setTempSelectedCountry}
          countries={countries}
        />

        <RetirementReasonCheckbox value={tempRetirementReason} onChange={setTempRetirementReason} />
      </div>

      <ModalActions onClearAll={handleClearAll} onApply={handleApply} />
    </Modal>
  );
};

export default FilterModal;
