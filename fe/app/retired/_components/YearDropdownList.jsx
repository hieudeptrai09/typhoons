const YearDropdownList = ({
  years,
  yearSearch,
  onYearSearchChange,
  onYearSelect,
}) => {
  return (
    <div className="absolute z-10 w-full mt-1 bg-yellow-50 border border-gray-400 rounded-lg shadow-lg">
      <div className="p-2 border-b border-gray-200">
        <input
          type="text"
          placeholder="Search year..."
          value={yearSearch}
          onChange={(e) => onYearSearchChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:border-blue-500 text-orange-600 outline-none"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      <div className="max-h-60 overflow-y-auto">
        <div
          onClick={() => onYearSelect("")}
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-orange-600"
        >
          All Years
        </div>
        {years.map((year) => (
          <div
            key={year}
            onClick={() => onYearSelect(year)}
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-orange-600"
          >
            {year}
          </div>
        ))}
      </div>
    </div>
  );
};

export default YearDropdownList;
