import { Modal } from "../../../../components/Modal";
import { useState, useEffect } from "react";

const FilterSection = ({
  label,
  hasValue,
  onClear,
  children,
  disabled = false,
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-semibold text-gray-700">{label}</label>
        {hasValue && !disabled && (
          <button
            onClick={onClear}
            className="text-sm text-blue-500 hover:text-blue-600 hover:underline"
          >
            Clear
          </button>
        )}
      </div>
      {children}
    </div>
  );
};

export const FilterModal = ({ isOpen, onClose, onApply, currentParams }) => {
  const [view, setView] = useState(currentParams.view || "storms");
  const [filter, setFilter] = useState(currentParams.filter || "");
  const [mode, setMode] = useState(currentParams.mode || "table");

  useEffect(() => {
    setView(currentParams.view || "storms");
    setFilter(currentParams.filter || "");
    setMode(currentParams.mode || "table");
  }, [currentParams]);

  const getFilterOptions = () => {
    if (view === "highlights") return ["strongest", "first"];
    if (view === "average") return ["by position", "by name", "by country"];
    return [];
  };

  const getDefaultFilter = (viewType) => {
    if (viewType === "highlights") return "strongest";
    if (viewType === "average") return "by position";
    return "";
  };

  const isFilterDisabled = view === "storms";
  const isModeTableOptionDisabled =
    view === "average" && (filter === "by name" || filter === "by country");
  const isModeListOptionDisabled = view === "storms";

  const handleViewChange = (newView) => {
    setView(newView);
    // Auto-set default filter when view changes
    if (newView === "highlights" || newView === "average") {
      setFilter(getDefaultFilter(newView));
    } else {
      setFilter("");
    }
  };

  const handleClear = (field) => {
    if (field === "view") {
      setView("storms");
      setFilter("");
    }
    if (field === "filter") {
      setFilter(getDefaultFilter(view));
    }
    if (field === "mode") setMode("table");
  };

  const handleClearAll = () => {
    setView("storms");
    setFilter("");
    setMode("table");
  };

  const handleApply = () => {
    const params = { view, mode };
    if (filter && view !== "storms") params.filter = filter;
    onApply(params);
  };

  useEffect(() => {
    if (
      view === "average" &&
      (filter === "by name" || filter === "by country")
    ) {
      setMode("list");
    } else if (view === "storms") {
      setMode("table");
    }
  }, [view, filter]);

  if (!isOpen) return null;

  const filterOptions = getFilterOptions();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Dashboard View Options"
      wrapperClassName="max-w-lg"
    >
      <div className="space-y-4 mb-6">
        <FilterSection
          label="View"
          hasValue={view !== "storms"}
          onClear={() => handleClear("view")}
        >
          <select
            value={view}
            onChange={(e) => handleViewChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:border-blue-500 text-purple-600 outline-none"
          >
            <option value="storms">Storms</option>
            <option value="highlights">Highlights</option>
            <option value="average">Average</option>
          </select>
        </FilterSection>

        <FilterSection
          label="Filter"
          hasValue={Boolean(filter) && filter !== getDefaultFilter(view)}
          onClear={() => handleClear("filter")}
          disabled={isFilterDisabled}
        >
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            disabled={isFilterDisabled}
            className={`w-full px-4 py-2 border border-gray-400 rounded-lg focus:border-blue-500 text-purple-600 outline-none ${
              isFilterDisabled
                ? "bg-gray-100 cursor-not-allowed opacity-60"
                : ""
            }`}
          >
            {filterOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </FilterSection>

        <FilterSection
          label="Mode"
          hasValue={
            mode !== "table" &&
            !(
              view === "average" &&
              (filter === "by name" || filter === "by country")
            )
          }
          onClear={() => handleClear("mode")}
        >
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:border-blue-500 text-purple-600 outline-none"
          >
            <option value="table" disabled={isModeTableOptionDisabled}>
              Table
            </option>
            <option value="list" disabled={isModeListOptionDisabled}>
              List
            </option>
          </select>
        </FilterSection>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={handleClearAll}
          className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
        >
          Clear All
        </button>
        <button
          onClick={handleApply}
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
        >
          Apply
        </button>
      </div>
    </Modal>
  );
};
