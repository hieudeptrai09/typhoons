import { X } from "lucide-react";
import { useState, useEffect } from "react";

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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              View
            </label>
            <div className="flex gap-2">
              <select
                value={view}
                onChange={(e) => setView(e.target.value)}
                className="flex-1 border border-gray-300 rounded px-3 py-2"
              >
                <option value="storms">Storms</option>
                <option value="highlights">Highlights</option>
                <option value="average">Average</option>
              </select>
              <button
                onClick={() => handleClear("view")}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded"
              >
                Clear
              </button>
            </div>
          </div>

          {filterOptions.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter
              </label>
              <div className="flex gap-2">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="flex-1 border border-gray-300 rounded px-3 py-2"
                >
                  <option value="">Select filter...</option>
                  {filterOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleClear("filter")}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mode
            </label>
            <div className="flex gap-2">
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="flex-1 border border-gray-300 rounded px-3 py-2"
                disabled={view === "average" && filter === "by name"}
              >
                <option value="table">Table</option>
                <option value="list">List</option>
              </select>
              <button
                onClick={() => handleClear("mode")}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded"
              >
                Clear
              </button>
            </div>
          </div>
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
