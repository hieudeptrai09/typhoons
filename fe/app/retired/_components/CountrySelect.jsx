const CountrySelect = ({ value, onChange, countries }) => {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Filter by Country
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:border-blue-500 text-orange-600 outline-none"
      >
        <option value="">All Countries</option>
        {countries.map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CountrySelect;
