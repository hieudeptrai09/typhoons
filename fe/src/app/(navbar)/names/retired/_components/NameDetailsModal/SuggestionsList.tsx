import EmptySuggestions from "./EmptySuggestions";
import SuggestionCard from "./SuggestionCard";
import type { Suggestion } from "../../../../../../types";

interface SuggestionsListProps {
  suggestions: Suggestion[];
}

const SuggestionsList = ({ suggestions }: SuggestionsListProps) => {
  if (suggestions.length === 0) {
    return <EmptySuggestions />;
  }

  // Check if any suggestion has an image
  const hasAnyImage = suggestions.some((s) => s.image);

  return (
    <div className="space-y-3">
      {suggestions.map((suggestion, sidx) => (
        <SuggestionCard key={sidx} suggestion={suggestion} hasAnyImage={hasAnyImage} />
      ))}
    </div>
  );
};

export default SuggestionsList;
