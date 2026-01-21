import { useState, useEffect } from "react";
import FilterInput from "../../../../../components/FilterModal/FilterInput";
import FilterSelect from "../../../../../components/FilterModal/FilterSelect";
import ModalActions from "../../../../../components/FilterModal/ModalActions";
import Modal from "../../../../../components/Modal";
import type { BaseModalProps, FilterParams } from "../../../../../types";

export interface FilterModalProps extends BaseModalProps {
  onApply: (filters: FilterParams) => void;
  countries: string[];
  languages: string[];
  initialFilters: FilterParams;
}

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
      letter: "",
    });
  };

  const handleClearAll = () => {
    setTempSearchName("");
    setTempSelectedCountry("");
    setTempSelectedLanguage("");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Filter Options" maxWidth={448}>
      {() => (
        <>
          <div className="space-y-4">
            <FilterInput
              label="Filter by Name"
              value={tempSearchName}
              onChange={setTempSearchName}
              placeholder="Enter typhoon name..."
            />

            <FilterSelect
              label="Filter by Country"
              value={tempSelectedCountry}
              onChange={setTempSelectedCountry}
              options={countries}
              placeholder="All Countries"
            />

            <FilterSelect
              label="Filter by Language"
              value={tempSelectedLanguage}
              onChange={setTempSelectedLanguage}
              options={languages}
              placeholder="All Languages"
            />
          </div>

          <ModalActions onClearAll={handleClearAll} onApply={handleApply} />
        </>
      )}
    </Modal>
  );
};

export default FilterModal;
