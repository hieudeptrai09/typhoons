import { useState } from "react";
import Modal from "../../../../components/Modal";
import type { DashboardParams as FilterModalParams } from "../../../../types";

interface FilterOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface ButtonGroupProps {
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (params: FilterModalParams) => void;
  currentParams: FilterModalParams;
}

const ButtonGroup = ({ label, options, value, onChange, disabled }: ButtonGroupProps) => (
  <div className="space-y-2">
    <label className="text-sm font-semibold text-gray-700">{label}</label>
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isActive = value === option.value;
        const isDisabled = disabled || option.disabled;

        return (
          <button
            key={option.value}
            onClick={() => !isDisabled && onChange(option.value)}
            disabled={isDisabled}
            className={`rounded-lg px-4 py-2 font-semibold transition-colors ${
              isActive
                ? "bg-blue-500 text-white"
                : isDisabled
                  ? "cursor-not-allowed bg-gray-200 text-gray-400"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  </div>
);

const FilterModal = ({ isOpen, onClose, onApply, currentParams }: FilterModalProps) => {
  const [view, setView] = useState(currentParams.view || "storms");
  const [filter, setFilter] = useState(currentParams.filter || "");
  const [mode, setMode] = useState(currentParams.mode || "table");

  const getFilterOptions = (): string[] => {
    if (view === "highlights") return ["strongest", "first", "last"];
    if (view === "average") return ["position", "name", "country", "year"];
    return [];
  };

  const getDefaultFilter = (viewType: string): string => {
    if (viewType === "highlights") return "strongest";
    if (viewType === "average") return "position";
    return "";
  };

  const isFilterDisabled = view === "storms";
  const isModeTableOptionDisabled =
    view === "average" && (filter === "name" || filter === "country" || filter === "year");
  const isModeListOptionDisabled = false;

  const handleViewChange = (newView: string) => {
    setView(newView);
    if (newView === "highlights" || newView === "average") {
      setFilter(getDefaultFilter(newView));
    } else {
      setFilter("");
    }
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    if (
      view === "average" &&
      (newFilter === "name" || newFilter === "country" || newFilter === "year")
    ) {
      setMode("list");
    }
  };

  const handleClearAll = () => {
    setView("storms");
    setFilter("");
    setMode("table");
  };

  const handleApply = () => {
    const params: FilterModalParams = { view, mode, filter };
    onApply(params);
  };

  if (!isOpen) return null;

  const filterOptions = getFilterOptions();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Dashboard View Options"
      wrapperClassName="max-w-lg"
    >
      <div className="mb-6 space-y-4">
        <ButtonGroup
          label="View"
          options={[
            { value: "storms", label: "Storms" },
            { value: "highlights", label: "Highlights" },
            { value: "average", label: "Average" },
          ]}
          value={view}
          onChange={handleViewChange}
        />

        <ButtonGroup
          label="Filter by"
          options={filterOptions.map((opt) => ({ value: opt, label: opt }))}
          value={filter}
          onChange={handleFilterChange}
          disabled={isFilterDisabled}
        />

        <ButtonGroup
          label="Mode"
          options={[
            {
              value: "table",
              label: "Table",
              disabled: isModeTableOptionDisabled,
            },
            {
              value: "list",
              label: "List",
              disabled: isModeListOptionDisabled,
            },
          ]}
          value={mode}
          onChange={setMode}
        />
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
          Apply
        </button>
      </div>
    </Modal>
  );
};

export default FilterModal;
