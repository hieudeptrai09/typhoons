import { Modal } from "../../../../../../components/Modal";
import NameInfo from "./NameInfo";
import NameImage from "./NameImage";
import SuggestionsList from "./SuggestionsList";

const NameDetailsModal = ({ selectedName, suggestions, onClose }) => {
  if (!selectedName) return null;

  const getNameColor = (selectedName) => {
    if (Boolean(Number(selectedName.isLanguageProblem))) {
      if (Number(selectedName.isLanguageProblem) === 1) {
        return "!text-green-700";
      } else return "!text-amber-600";
    }
    if (selectedName.name === "Vamei") return "!text-purple-700";
    return "!text-red-700";
  };

  return (
    <Modal
      isOpen={!!selectedName}
      onClose={onClose}
      title={selectedName.name}
      wrapperClassName="max-w-2xl max-h-[80vh] overflow-hidden"
      titleClassName={`!text-3xl ${getNameColor(selectedName)}`}
    >
      <div className="flex gap-6 mb-6 pb-4 border-b border-gray-200 items-center">
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
        <h3 className="font-bold text-xl mb-4 text-gray-800">
          Suggested Replacements
        </h3>
        <SuggestionsList suggestions={suggestions} />
      </div>
    </Modal>
  );
};

export default NameDetailsModal;
