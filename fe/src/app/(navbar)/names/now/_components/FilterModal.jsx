import { Modal } from "../../../../components/Modal";
import { useState, useEffect } from "react";

const FilterModal = ({
  isOpen,
  onClose,
  onApply,
  countries,
  initialFilters,
}) => {
  const [tempSearchName, setTempSearchName] = useState(
    initialFilters.searchName
  );
  const [tempSelectedCountry, setTempSelectedCountry] = useState(
    initialFilters.selectedCountry
  );

  useEffect(() => {
    setTempSearchName(initialFilters.searchName);
    setTempSelectedCountry(initialFilters.selectedCountry);
  }, [initialFilters]);

  const handleApply = () => {
    onApply({
      searchName: tempSearchName,
      selectedCountry: tempSelectedCountry,
    });
  };

  const handleClearAll = () => {
    setTempSearchName("");
    setTempSelectedCountry("");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Filter Options"
      wrapperClassName="max-w-2xl"
    >
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-semibold text-gray-700">
              Filter by Name
            </label>
            {tempSearchName && (
              <button
                onClick={() => setTempSearchName("")}
                className="text-sm text-blue-500 hover:text-blue-600 hover:underline px-2 py-1"
              >
                Clear this filter
              </button>
            )}
          </div>
          <input
            type="text"
            placeholder="Enter typhoon name..."
            value={tempSearchName}
            onChange={(e) => setTempSearchName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:border-blue-500 text-purple-600 outline-none"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-semibold text-gray-700">
              Filter by Country
            </label>
            {tempSelectedCountry && (
              <button
                onClick={() => setTempSelectedCountry("")}
                className="text-sm text-blue-500 hover:text-blue-600 hover:underline px-2 py-1"
              >
                Clear this filter
              </button>
            )}
          </div>
          <select
            value={tempSelectedCountry}
            onChange={(e) => setTempSelectedCountry(e.target.value)}
            className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:border-blue-500 text-purple-600 outline-none"
          >
            <option value="">All Countries</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
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
          Apply Filters
        </button>
      </div>
    </Modal>
  );
};

export default FilterModal;
