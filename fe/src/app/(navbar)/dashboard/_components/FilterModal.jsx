import { Modal } from "../../../../components/Modal";
import { FilterSelectSection } from "./FilterSelectSection";
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
    if (view === "average") return ["position", "name", "country", "year"];
    return [];
  };

  const getDefaultFilter = (viewType) => {
    if (viewType === "highlights") return "strongest";
    if (viewType === "average") return "position";
    return "";
  };

  const isFilterDisabled = view === "storms";
  const isModeTableOptionDisabled =
    view === "average" &&
    (filter === "name" || filter === "country" || filter === "year");
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
      (filter === "name" || filter === "country" || filter === "year")
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
        <FilterSelectSection
          label="View"
          value={view}
          onChange={(e) => handleViewChange(e.target.value)}
          options={[
            { value: "storms", label: "Storms" },
            { value: "highlights", label: "Highlights" },
            { value: "average", label: "Average" },
          ]}
          hasValue={view !== "storms"}
          onClear={() => handleClear("view")}
        />

        <FilterSelectSection
          label="Filter by"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          options={filterOptions.map((opt) => ({ value: opt, label: opt }))}
          hasValue={Boolean(filter) && filter !== getDefaultFilter(view)}
          onClear={() => handleClear("filter")}
          disabled={isFilterDisabled}
        />

        <FilterSelectSection
          label="Mode"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
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
          hasValue={
            mode !== "table" &&
            !(
              view === "average" &&
              (filter === "name" || filter === "country" || filter === "year")
            )
          }
          onClear={() => handleClear("mode")}
        />
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
