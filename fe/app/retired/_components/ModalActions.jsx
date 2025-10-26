const ModalActions = ({ onClearAll, onApply }) => {
  return (
    <div className="flex gap-3 mt-6">
      <button
        onClick={onClearAll}
        className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
      >
        Clear All
      </button>
      <button
        onClick={onApply}
        className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
      >
        Apply Filters
      </button>
    </div>
  );
};

export default ModalActions;
