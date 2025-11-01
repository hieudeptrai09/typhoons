const SuggestionCard = ({ suggestion }) => {
  const cardClasses = Border(Number(suggestion.isChosen))
    ? "bg-blue-100 border-2 border-blue-500"
    : "bg-gray-50";

  return (
    <div className={`p-4 rounded-lg ${cardClasses}`}>
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
  );
};

export default SuggestionCard;
