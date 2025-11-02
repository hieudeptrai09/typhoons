import SuggestionCard from "./SuggestionCard";
import EmptySuggestions from "./EmptySuggestions";

const SuggestionsList = ({ suggestions }) => {
  if (suggestions.length === 0) {
    return <EmptySuggestions />;
  }

  return (
    <div className="space-y-3">
      {suggestions.map((suggestion, sidx) => (
        <SuggestionCard key={sidx} suggestion={suggestion} />
      ))}
    </div>
  );
};

export default SuggestionsList;
