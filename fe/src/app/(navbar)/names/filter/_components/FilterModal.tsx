import { useState, useEffect } from "react";
import Modal from "../../../../../components/components/Modal";
import FilterInput from "../../../../../components/ui/FilterModal/FilterInput";
import FilterSelect from "../../../../../components/ui/FilterModal/FilterSelect";
import ModalActions from "../../../../../components/ui/FilterModal/ModalActions";
import type { BaseModalProps, FilterParams } from "../../../../../types";

export interface FilterModalProps extends BaseModalProps {
  onApply: (filters: FilterParams) => void;
  countries: string[];
  languages: string[];
  tags: string[];
  initialFilters: FilterParams;
}

const FilterModal = ({
  isOpen,
  onClose,
  onApply,
  countries,
  languages,
  tags,
  initialFilters,
}: FilterModalProps) => {
  const [tempSearchName, setTempSearchName] = useState(initialFilters.name);
  const [tempSelectedCountry, setTempSelectedCountry] = useState(initialFilters.country);
  const [tempSelectedLanguage, setTempSelectedLanguage] = useState(initialFilters.language);
  const [tempPosition, setTempPosition] = useState(initialFilters.position);
  const [tempSelectedTag, setTempSelectedTag] = useState(initialFilters.tag ?? "");

  useEffect(() => {
    setTempSearchName(initialFilters.name);
    setTempSelectedCountry(initialFilters.country);
    setTempSelectedLanguage(initialFilters.language);
    setTempPosition(initialFilters.position);
    setTempSelectedTag(initialFilters.tag ?? "");
  }, [initialFilters]);

  const handleApply = () => {
    onApply({
      name: tempSearchName,
      country: tempSelectedCountry,
      language: tempSelectedLanguage,
      position: tempPosition,
      tag: tempSelectedTag,
      letter: "",
    });
  };

  const handleClearAll = () => {
    setTempSearchName("");
    setTempSelectedCountry("");
    setTempSelectedLanguage("");
    setTempPosition("");
    setTempSelectedTag("");
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

            <FilterSelect
              label="Filter by Tag"
              value={tempSelectedTag}
              onChange={setTempSelectedTag}
              options={tags}
              placeholder="All Tags"
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
          </div>

          <ModalActions onClearAll={handleClearAll} onApply={handleApply} />
        </>
      )}
    </Modal>
  );
};

export default FilterModal;
