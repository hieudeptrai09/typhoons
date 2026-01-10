import { useState, useEffect } from "react";
import FilterInput from "../../../../../../components/FilterModal/FilterInput";
import FilterSelect from "../../../../../../components/FilterModal/FilterSelect";
import ModalActions from "../../../../../../components/FilterModal/ModalActions";
import Modal from "../../../../../../components/Modal";
import RetirementReasonCheckbox from "./RetirementReasonCheckbox";
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
      letter: "",
    });
  };

  const handleClearAll = () => {
    setTempSearchName("");
    setTempSelectedYear("");
    setTempSelectedCountry("");
    setTempRetirementReason("");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Filter Options" maxWidth={672}>
      <div className="space-y-4">
        <FilterInput
          label="Filter by Name"
          value={tempSearchName}
          onChange={setTempSearchName}
          placeholder="Enter typhoon name..."
        />

        <FilterInput
          label="Filter by Year"
          value={tempSelectedYear}
          onChange={setTempSelectedYear}
          placeholder="Enter year..."
          type="number"
          min="2000"
          max="2100"
        />

        <FilterSelect
          label="Filter by Country"
          value={tempSelectedCountry}
          onChange={setTempSelectedCountry}
          options={countries}
          placeholder="All Countries"
        />

        <RetirementReasonCheckbox value={tempRetirementReason} onChange={setTempRetirementReason} />
      </div>

      <ModalActions onClearAll={handleClearAll} onApply={handleApply} />
    </Modal>
  );
};

export default FilterModal;
