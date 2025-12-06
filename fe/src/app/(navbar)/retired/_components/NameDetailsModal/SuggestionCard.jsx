import { Check } from "lucide-react";

const SuggestionCard = ({ suggestion, hasAnyImage }) => {
  const isChosen = Boolean(Number(suggestion.isChosen));

  const cardClasses = isChosen
    ? "bg-blue-50 border-2 border-blue-400 shadow-md"
    : "bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md";

  // Determine image visibility class
  const imageVisibilityClass = !hasAnyImage
    ? "hidden"
    : suggestion.image
    ? "block"
    : "invisible";

  return (
    <div className={`p-5 rounded-xl ${cardClasses}`}>
      <div className="flex gap-5 items-center">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h4 className="font-semibold text-lg text-gray-800">
              {suggestion.replacementName}
            </h4>
            {isChosen && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold bg-blue-500 text-white px-3 py-1 rounded-full shadow-sm">
                <Check className="w-3 h-3" />
                CHOSEN
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            {suggestion.replacementMeaning}
          </p>
        </div>

        <div className="shrink-0">
          <div className={`relative group ${imageVisibilityClass}`}>
            <img
              src={suggestion.image}
              alt={suggestion.replacementName}
              className="w-32 h-24 object-cover rounded-lg shadow-sm border-2 border-white ring-1 ring-gray-200"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuggestionCard;
