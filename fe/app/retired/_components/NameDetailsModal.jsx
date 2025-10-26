import NameDetailsHeader from "./NameDetailsHeader";
import SuggestionsList from "./SuggestionsList";

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
        <NameDetailsHeader selectedName={selectedName} onClose={onClose} />

        <div className="p-6 overflow-y-auto max-h-[calc(80vh-200px)]">
          <h3 className="font-bold text-xl mb-4 text-gray-800">
            Suggested Replacements
          </h3>
          <SuggestionsList suggestions={suggestions} />
        </div>
      </div>
    </div>
  );
};

export default NameDetailsModal;
