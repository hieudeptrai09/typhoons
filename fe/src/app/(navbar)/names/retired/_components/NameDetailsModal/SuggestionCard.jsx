const SuggestionCard = ({ suggestion, hasAnyImage }) => {
  const cardClasses = Boolean(Number(suggestion.isChosen))
    ? "bg-blue-100 border-2 border-blue-500"
    : "bg-gray-100";

  // Determine image visibility class
  const imageVisibilityClass = !hasAnyImage
    ? "hidden" // No images at all - remove from layout
    : suggestion.image
      ? "block" // This card has image - show it
      : "invisible"; // Some cards have images but not this one - preserve space

  return (
    <div className={`rounded-lg p-4 ${cardClasses}`}>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="mb-1 font-semibold text-gray-800">
            {suggestion.replacementName}
            {Boolean(Number(suggestion.isChosen)) && (
              <span className="ml-2 rounded bg-blue-500 px-2 py-1 text-xs text-white">CHOSEN</span>
            )}
          </div>
          <div className="text-sm text-gray-600">{suggestion.replacementMeaning}</div>
        </div>

        <div className="shrink-0 self-end">
          <img
            src={suggestion.image}
            alt={suggestion.replacementName}
            className={`h-24 max-h-72 w-32 rounded-lg border border-gray-200 object-cover shadow-sm ${imageVisibilityClass}`}
          />
        </div>
      </div>
    </div>
  );
};

export default SuggestionCard;
