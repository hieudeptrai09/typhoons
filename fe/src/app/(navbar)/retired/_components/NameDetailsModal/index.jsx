import { Modal } from "../../../../../components/Modal";
import NameInfo from "./NameInfo";
import NameImage from "./NameImage";
import SuggestionsList from "./SuggestionsList";

const NameDetailsModal = ({ selectedName, suggestions, onClose }) => {
  if (!selectedName) return null;

  const getNameColor = (selectedName) => {
    if (Boolean(Number(selectedName.isLanguageProblem)))
      return "!text-green-600";
    if (selectedName.name === "Vamei") return "!text-purple-600";
    return "!text-red-600";
  };

  const getBgColors = (selectedName) => {
    if (Boolean(Number(selectedName.isLanguageProblem)))
      return {
        bg: "#f0fdf4",
        border: "#bbf7d0",
        accent: "#22c55e",
      };
    if (selectedName.name === "Vamei")
      return {
        bg: "#faf5ff",
        border: "#e9d5ff",
        accent: "#a855f7",
      };
    return {
      bg: "#fef2f2",
      border: "#fecaca",
      accent: "#ef4444",
    };
  };

  const colors = getBgColors(selectedName);

  return (
    <Modal
      isOpen={!!selectedName}
      onClose={onClose}
      title={selectedName.name}
      wrapperClassName="max-w-2xl max-h-[85vh]"
      titleClassName={`!text-3xl ${getNameColor(selectedName)}`}
    >
      <div className="space-y-6">
        <div
          className="rounded-2xl p-6 shadow-sm border"
          style={{
            backgroundColor: colors.bg,
            borderColor: colors.border,
          }}
        >
          <div className="flex gap-8 items-start">
            <div className="flex-1">
              <NameInfo
                meaning={selectedName.meaning}
                country={selectedName.country}
                position={selectedName.position}
                language={selectedName.language}
              />
            </div>
            <NameImage
              src={selectedName.image}
              alt={selectedName.name}
              description={selectedName.description}
            />
          </div>
        </div>

        <div className="space-y-4 pb-6">
          <div className="flex items-center gap-3">
            <div
              className="h-1 w-12 rounded-full"
              style={{ backgroundColor: colors.accent }}
            ></div>
            <h3 className="font-bold text-2xl text-gray-800">
              Suggested Replacements
            </h3>
          </div>
          <SuggestionsList suggestions={suggestions} />
        </div>
      </div>
    </Modal>
  );
};

export default NameDetailsModal;
