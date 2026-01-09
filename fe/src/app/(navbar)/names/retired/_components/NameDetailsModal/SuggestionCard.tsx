import Image from "next/image";
import type { Suggestion } from "../../../../../../types";

interface SuggestionCardProps {
  suggestion: Suggestion;
}

const SuggestionCard = ({ suggestion }: SuggestionCardProps) => {
  const cardClasses = Boolean(suggestion.isChosen)
    ? "bg-blue-100 border-2 border-blue-500"
    : "bg-gray-100 border-2 border-gray-200";

  // Determine image visibility class
  const imageVisibilityClass = !suggestion.image ? "hidden" : "block";

  return (
    <div className={`rounded-lg p-4 ${cardClasses} w-full md:w-[400px]`}>
      <div className="mb-4 flex items-center gap-x-2 font-semibold text-gray-700">
        {suggestion.replacementName}
        {Boolean(suggestion.isChosen) && (
          <span className="rounded bg-blue-500 px-2 py-1 text-xs text-white">APPROVED</span>
        )}
      </div>

      <div className="flex items-start gap-4 md:gap-6">
        <div className="flex-1 text-sm text-gray-700">{suggestion.replacementMeaning}</div>

        <div
          className={`relative w-32 shrink-0 bg-gray-200 md:w-36 ${imageVisibilityClass}`}
          style={{ aspectRatio: "4/3" }}
        >
          {suggestion.image && (
            <Image
              src={suggestion.image}
              alt={suggestion.replacementName}
              fill
              className="rounded-lg border border-gray-200 object-contain shadow-sm"
              unoptimized
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SuggestionCard;
