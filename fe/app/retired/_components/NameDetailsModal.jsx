const NameDetailsModal = ({ selectedName, suggestions, onClose }) => {
  if (!selectedName) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 pb-4 border-b border-gray-300">
          <div className="flex justify-between items-start">
            <div>
              <h2
                className={`text-3xl font-bold mb-2 ${
                  selectedName.isLanguageProblem
                    ? "text-green-600"
                    : selectedName.name === "Vamei"
                    ? "text-purple-600"
                    : "text-red-600"
                }`}
              >
                {selectedName.name}
              </h2>
              <p className="text-gray-700">
                <span className="font-semibold">Meaning:</span>{" "}
                {selectedName.meaning}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Country:</span>{" "}
                {selectedName.country}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(80vh-200px)]">
          <h3 className="font-bold text-xl mb-4 text-gray-800">
            Suggested Replacements
          </h3>
          <div className="space-y-3">
            {suggestions.length > 0 ? (
              suggestions.map((suggestion, sidx) => (
                <div
                  key={sidx}
                  className={`p-4 rounded-lg ${
                    suggestion.isChosen
                      ? "bg-blue-100 border-2 border-blue-500"
                      : "bg-gray-50"
                  }`}
                >
                  <div className="font-semibold text-gray-800 mb-1">
                    {suggestion.replacementName}
                    {Boolean(suggestion.isChosen) && (
                      <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded">
                        CHOSEN
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    {suggestion.replacementMeaning}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-center py-4">
                No suggested replacements available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NameDetailsModal;
