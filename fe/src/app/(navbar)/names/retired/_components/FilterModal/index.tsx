import { useState, useEffect } from "react";
import { Modal, Button } from "antd";
import FilterInput from "../../../../../../components/ui/FilterModal/FilterInput";
import FilterSelect from "../../../../../../components/ui/FilterModal/FilterSelect";
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
  const [tempPosition, setTempPosition] = useState(initialFilters.position);

  useEffect(() => {
    setTempSearchName(initialFilters.name);
    setTempSelectedYear(initialFilters.year);
    setTempSelectedCountry(initialFilters.country);
    setTempRetirementReason(initialFilters.reason);
    setTempPosition(initialFilters.position);
  }, [initialFilters]);

  const handleApply = () => {
    onApply({
      name: tempSearchName,
      year: tempSelectedYear,
      country: tempSelectedCountry,
      reason: tempRetirementReason,
      position: tempPosition,
      letter: "",
    });
  };

  const handleClearAll = () => {
    setTempSearchName("");
    setTempSelectedYear("");
    setTempSelectedCountry("");
    setTempRetirementReason("");
    setTempPosition("");
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      width={672}
      centered
      destroyOnHidden
      title={<span className="text-xl font-bold text-gray-700">Filter Options</span>}
      footer={[
        <Button key="clear" onClick={handleClearAll}>
          Clear All
        </Button>,
        <Button key="apply" type="primary" onClick={handleApply}>
          Apply
        </Button>,
      ]}
    >
      <div className="space-y-4 py-4">
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

        <FilterInput
          label="Filter by Position"
          value={tempPosition}
          onChange={setTempPosition}
          placeholder="Enter position (1–140)..."
          type="number"
          min="1"
          max="140"
        />

        <RetirementReasonCheckbox value={tempRetirementReason} onChange={setTempRetirementReason} />
      </div>
    </Modal>
  );
};

export default FilterModal;
