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

  return (
    <div className="flex flex-col items-center space-y-3">
      {suggestions.map((suggestion, sidx) => (
        <SuggestionCard key={sidx} suggestion={suggestion} />
      ))}
    </div>
  );
};

export default SuggestionsList;
