const NameSearchInput = ({ value, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Filter by Name
      </label>
      <input
        type="text"
        placeholder="Enter typhoon name..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:border-blue-500 text-orange-600 outline-none"
      />
    </div>
  );
};

export default NameSearchInput;
