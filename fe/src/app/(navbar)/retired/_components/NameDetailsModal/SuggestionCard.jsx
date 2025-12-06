const SuggestionCard = ({ suggestion, hasAnyImage }) => {
  const cardClasses = Boolean(Number(suggestion.isChosen))
    ? "bg-blue-100 border-2 border-blue-500"
    : "bg-gray-50";

  // Determine image visibility class
  const imageVisibilityClass = !hasAnyImage
    ? "hidden" // No images at all - remove from layout
    : suggestion.image
    ? "block" // This card has image - show it
    : "invisible"; // Some cards have images but not this one - preserve space

  return (
    <div className={`p-4 rounded-lg ${cardClasses}`}>
      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <div className="font-semibold text-gray-800 mb-1">
            {suggestion.replacementName}
            {Boolean(Number(suggestion.isChosen)) && (
              <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded">
                CHOSEN
              </span>
            )}
          </div>
          <div className="text-sm text-gray-600">
            {suggestion.replacementMeaning}
          </div>
        </div>

        <div className="shrink-0">
          <img
            src={suggestion.image}
            alt={suggestion.replacementName}
            className={`w-32 h-24 object-cover rounded-lg shadow-sm border border-gray-200 ${imageVisibilityClass}`}
          />
        </div>
      </div>
    </div>
  );
};

export default SuggestionCard;
