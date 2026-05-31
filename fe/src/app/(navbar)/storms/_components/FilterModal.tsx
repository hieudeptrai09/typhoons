import { useState } from "react";
import Modal from "../../../../components/components/Modal";
import ModalActions from "../../../../components/ui/FilterModal/ModalActions";
import type { BaseModalProps, DashboardParams as FilterModalParams } from "../../../../types";

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

interface FilterModalProps extends BaseModalProps {
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

  const getFilterOptions = (): FilterOption[] => {
    if (view === "highlights") {
      return [
        { value: "strongest", label: "Strongest" },
        { value: "first", label: "First" },
        { value: "last", label: "Last" },
      ];
    }
    if (view === "average") {
      return [
        { value: "position", label: "Position" },
        { value: "name", label: "Name" },
        { value: "country", label: "Country" },
        { value: "year", label: "Year" },
      ];
    }
    if (view === "distance") {
      return [
        { value: "position", label: "Position" },
        { value: "name", label: "Name" },
      ];
    }
    return [];
  };

  const getDefaultFilter = (viewType: string): string => {
    if (viewType === "highlights") return "strongest";
    if (viewType === "average") return "position";
    if (viewType === "distance") return "position";
    return "";
  };

  const isFilterDisabled = view === "storms";

  // Table mode is only valid for distance+position; for all other distance combos → list only
  const isModeTableOptionDisabled =
    (view === "average" && (filter === "name" || filter === "country" || filter === "year")) ||
    (view === "distance" && filter === "name");

  // For distance view, table is only available when filter === "position"
  const isModeListOptionDisabled = false;

  const handleViewChange = (newView: string) => {
    setView(newView);
    const defaultFilter = getDefaultFilter(newView);
    setFilter(defaultFilter);
    // Reset mode sensibly
    if (newView === "distance") {
      setMode("table"); // position is default, table is valid for position
    } else if (
      newView === "average" &&
      (filter === "name" || filter === "country" || filter === "year")
    ) {
      setMode("list");
    }
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    // Force list mode when table is not applicable
    if (
      view === "average" &&
      (newFilter === "name" || newFilter === "country" || newFilter === "year")
    ) {
      setMode("list");
    }
    if (view === "distance" && newFilter === "name") {
      setMode("list");
    }
    if (view === "distance" && newFilter === "position") {
      setMode("table");
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
    <Modal isOpen={isOpen} onClose={onClose} title="Dashboard View Options" maxWidth={512}>
      {() => (
        <>
          <div className="mb-6 space-y-4">
            <ButtonGroup
              label="View"
              options={[
                { value: "storms", label: "Storms" },
                { value: "highlights", label: "Highlights" },
                { value: "average", label: "Average" },
                { value: "distance", label: "Distance" },
              ]}
              value={view}
              onChange={handleViewChange}
            />

            <ButtonGroup
              label="Filter by"
              options={filterOptions}
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

          <ModalActions onClearAll={handleClearAll} onApply={handleApply} />
        </>
      )}
    </Modal>
  );
};

export default FilterModal;
