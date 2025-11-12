import { X } from "lucide-react";
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
    if (view === "average") return ["by name", "by position"];
    return [];
  };

  const isFilterDisabled = view === "storms";
  const isModeDisabled = view === "storms";
  const isModeTableOptionDisabled = view === "average" && filter === "by name";

  const handleClear = (field) => {
    if (field === "view") setView("storms");
    if (field === "filter") setFilter("");
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
    if (view === "average" && filter === "by name") {
      setMode("list");
    }
  }, [view, filter]);

  if (!isOpen) return null;

  const filterOptions = getFilterOptions();

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 shadow-2xl max-w-lg w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Filter Dashboard</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <FilterSection
            label="View"
            hasValue={view !== "storms"}
            onClear={() => handleClear("view")}
          >
            <select
              value={view}
              onChange={(e) => setView(e.target.value)}
              className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:border-blue-500 text-purple-600 outline-none"
            >
              <option value="storms">Storms</option>
              <option value="highlights">Highlights</option>
              <option value="average">Average</option>
            </select>
          </FilterSection>

          <FilterSection
            label="Filter"
            hasValue={Boolean(filter)}
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
            hasValue={mode !== "table"}
            onClear={() => handleClear("mode")}
            disabled={isModeDisabled}
          >
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              disabled={isModeDisabled}
              className={`w-full px-4 py-2 border border-gray-400 rounded-lg focus:border-blue-500 text-purple-600 outline-none ${
                isModeDisabled
                  ? "bg-gray-100 cursor-not-allowed opacity-60"
                  : ""
              }`}
            >
              <option value="table" disabled={isModeTableOptionDisabled}>
                Table
              </option>
              <option value="list">List</option>
            </select>
          </FilterSection>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleClearAll}
            className="flex-1 px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
          >
            Clear All
          </button>
          <button
            onClick={handleApply}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};
