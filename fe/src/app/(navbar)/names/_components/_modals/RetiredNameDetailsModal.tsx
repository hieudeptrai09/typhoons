import { useState } from "react";
import { Modal } from "antd";
import TyphoonSpinner from "../../../../../components/components/TyphoonSpinner";
import { getRetiredReasonColorClass } from "../../../../../components/colors";
import Tabs, { type Tab } from "../../../../../components/components/Tabs";
import { NameDetailsContent } from "../../../../../components/ui/NameDetailsModal";
import SuggestionCard from "../_components/SuggestionCard";
import type { RetiredName, Suggestion, BaseModalProps } from "../../../../../types";

export interface RetiredNameDetailsModalProps extends BaseModalProps {
  selectedName: RetiredName;
  suggestions: Suggestion[];
  suggestionsLoading?: boolean;
  suggestionsError?: Error | null;
}

type TabType = "info" | "suggestions";

const SuggestionsList = ({ suggestions }: { suggestions: Suggestion[] }) => {
  if (suggestions.length === 0) {
    return (
      <div className="py-4 text-center text-gray-500">No suggested replacements available</div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-3">
      {suggestions.map((suggestion, sidx) => (
        <SuggestionCard key={sidx} suggestion={suggestion} />
      ))}
    </div>
  );
};

const RetiredNameDetailsModal = ({
  isOpen,
  onClose,
  selectedName,
  suggestions,
  suggestionsLoading = false,
  suggestionsError = null,
}: RetiredNameDetailsModalProps) => {
  const [activeTab, setActiveTab] = useState<TabType>("info");

  if (!selectedName) return null;

  const renderSuggestionsContent = () => {
    if (suggestionsLoading) {
      return (
        <div className="flex justify-center py-8">
          <TyphoonSpinner size="medium" />
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

  const tabs: Tab<TabType>[] = [
    { key: "info", label: "Name Information", content: <NameDetailsContent name={selectedName} /> },
    { key: "suggestions", label: "Suggested Replacements", content: renderSuggestionsContent() },
  ];

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      width={600}
      footer={null}
      centered
      destroyOnHidden
      title={
        <span
          className={`text-2xl font-bold ${getRetiredReasonColorClass(selectedName.isLanguageProblem)}`}
        >
          {selectedName.name}
        </span>
      }
      styles={{
        header: { borderBottom: "1px solid #9ca3af", paddingBottom: "12px" },
        body: { height: "70vh", overflowY: "auto" },
      }}
    >
      <div className="pt-4">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          ariaLabel="Name details tabs"
          idPrefix="tabpanel"
        />
      </div>
    </Modal>
  );
};

export default RetiredNameDetailsModal;
