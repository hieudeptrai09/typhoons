import Modal from "../../../../../../components/Modal";
import NameImage from "./NameImage";
import NameInfo from "./NameInfo";
import SuggestionsList from "./SuggestionsList";

interface RetiredName {
  name: string;
  meaning: string;
  country: string;
  position: number;
  language: string;
  isLanguageProblem: number;
  image?: string;
  description?: string;
}

interface Suggestion {
  replacementName: string;
  replacementMeaning: string;
  isChosen: number;
  image?: string;
}

interface NameDetailsModalProps {
  selectedName: RetiredName | null;
  suggestions: Suggestion[];
  onClose: () => void;
}

const NameDetailsModal = ({ selectedName, suggestions, onClose }: NameDetailsModalProps) => {
  if (!selectedName) return null;

  const getNameColor = (selectedName: RetiredName): string => {
    const ilp = selectedName.isLanguageProblem;

    switch (ilp) {
      case 0:
        return "!text-red-600"; // Destructive Storm
      case 1:
        return "!text-green-600"; // Language Problem
      case 2:
        return "!text-amber-500"; // Misspelling
      case 3:
        return "!text-purple-600"; // Special Storm
      default:
        return "!text-red-600"; // Default to destructive
    }
  };

  return (
    <Modal
      isOpen={!!selectedName}
      onClose={onClose}
      title={selectedName.name}
      wrapperClassName="max-w-2xl max-h-[80vh] overflow-hidden"
      titleClassName={`!text-3xl ${getNameColor(selectedName)}`}
    >
      <div className="mb-6 flex items-center gap-6 border-b border-gray-200 pb-4">
        <NameInfo
          meaning={selectedName.meaning}
          country={selectedName.country}
          position={selectedName.position}
          language={selectedName.language}
        />
        <NameImage
          src={selectedName.image}
          alt={selectedName.name}
          description={selectedName.description}
        />
      </div>

      <div className="max-h-[calc(80vh-200px)] pb-6">
        <h3 className="mb-4 text-xl font-bold text-gray-800">Suggested Replacements</h3>
        <SuggestionsList suggestions={suggestions} />
      </div>
    </Modal>
  );
};

export default NameDetailsModal;
