import { useState } from "react";
import { Modal, Spin } from "antd";
import NameImage from "./NameImage";
import NameInfo from "./NameInfo";
import SuggestionsList from "./SuggestionsList";
import type { RetiredName, Suggestion, BaseModalProps } from "../../../../../../types";

export interface NameDetailsModalProps extends BaseModalProps {
  selectedName: RetiredName;
  suggestions: Suggestion[];
  suggestionsLoading?: boolean;
  suggestionsError?: Error | null;
}

type TabType = "info" | "suggestions";

const NameDetailsModal = ({
  isOpen,
  onClose,
  selectedName,
  suggestions,
  suggestionsLoading = false,
  suggestionsError = null,
}: NameDetailsModalProps) => {
  const [activeTab, setActiveTab] = useState<TabType>("info");

  if (!selectedName) return null;

  const getNameColorClass = (name: RetiredName): string => {
    switch (name.isLanguageProblem) {
      case 0:
        return "text-red-600";
      case 1:
        return "text-green-600";
      case 2:
        return "text-amber-500";
      case 3:
        return "text-purple-600";
      default:
        return "text-red-600";
    }
  };

  const getTabClasses = (tab: TabType) => {
    const isActive = activeTab === tab;
    return `flex-1 px-6 pb-3 font-semibold transition-colors ${
      isActive ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"
    }`;
  };

  const hasImageOrDescription = !!selectedName.image;

  const renderSuggestionsContent = () => {
    if (suggestionsLoading) {
      return (
        <div className="flex justify-center py-8">
          <Spin size="medium" />
        </div>
      );
    }
    if (suggestionsError) {
      return (
        <div className="py-4 text-center text-gray-500">Failed to load suggested replacements.</div>
      );
    }
    return <SuggestionsList suggestions={suggestions} />;
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      width={600}
      footer={null}
      centered
      destroyOnHidden
      title={
        <span className={`text-3xl font-bold ${getNameColorClass(selectedName)}`}>
          {selectedName.name}
        </span>
      }
      styles={{
        header: { borderBottom: "1px solid #9ca3af", paddingBottom: "12px" },
        body: {
          height: typeof window !== "undefined" ? window.innerHeight * 0.8 - 120 : 480,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <div className="flex flex-1 flex-col pt-4">
        {/* Tabs */}
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
                className={`flex w-full gap-6 ${
                  !hasImageOrDescription ? "max-w-2xl rounded-lg bg-white p-8 shadow-sm" : ""
                }`}
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

          {activeTab === "suggestions" && renderSuggestionsContent()}
        </div>
      </div>
    </Modal>
  );
};

export default NameDetailsModal;
