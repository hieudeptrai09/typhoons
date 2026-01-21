import { useState } from "react";
import Modal from "../../../../../../components/Modal";
import NameImage from "./NameImage";
import NameInfo from "./NameInfo";
import SuggestionsList from "./SuggestionsList";
import type { RetiredName, Suggestion, BaseModalProps } from "../../../../../../types";

export interface NameDetailsModalProps extends BaseModalProps {
  selectedName: RetiredName;
  suggestions: Suggestion[];
}

type TabType = "info" | "suggestions";

const NameDetailsModal = ({
  isOpen,
  onClose,
  selectedName,
  suggestions,
}: NameDetailsModalProps) => {
  const [activeTab, setActiveTab] = useState<TabType>("info");

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

  const getTabClasses = (tab: TabType) => {
    const isActive = activeTab === tab;
    return `flex-1 px-6 pb-3 font-semibold transition-colors ${
      isActive ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"
    }`;
  };

  // Check if there's any image or description to display
  const hasImageOrDescription = !!selectedName.image;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={selectedName.name}
      maxWidth={672}
      height={typeof window !== "undefined" ? window.innerHeight * 0.8 : 600}
      titleClassName={`!text-3xl ${getNameColor(selectedName)}`}
    >
      {() => (
        <>
          <div className="mb-6 flex border-b border-gray-200">
            <button onClick={() => setActiveTab("info")} className={getTabClasses("info")}>
              Name Information
            </button>
            <button
              onClick={() => setActiveTab("suggestions")}
              className={getTabClasses("suggestions")}
            >
              Suggested Replacements
            </button>
          </div>

          <div className="flex-1">
            {activeTab === "info" && (
              <div className="flex h-full items-start justify-center">
                <div
                  className={`flex w-full gap-6 ${!hasImageOrDescription ? "max-w-2xl rounded-lg bg-white p-8 shadow-sm" : ""}`}
                >
                  <NameInfo
                    name={selectedName.name}
                    meaning={selectedName.meaning}
                    country={selectedName.country}
                    position={selectedName.position}
                    language={selectedName.language}
                    replacementName={selectedName.replacementName}
                    description={selectedName.description || ""}
                    image={selectedName.image || ""}
                  />
                  <NameImage
                    src={selectedName.image}
                    alt={selectedName.name}
                    description={selectedName.description}
                  />
                </div>
              </div>
            )}

            {activeTab === "suggestions" && <SuggestionsList suggestions={suggestions} />}
          </div>
        </>
      )}
    </Modal>
  );
};

export default NameDetailsModal;
