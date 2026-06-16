import { useState } from "react";
import { Modal, Spin } from "antd";
import CountryFlag from "../../../components/components/CountryFlag";
import ImageWithLoader from "../../components/ImageWithLoader";
import SuggestionsList from "./SuggestionsList";
import type { TyphoonName, RetiredName, Suggestion, BaseModalProps } from "../../../types";

interface NameDetailsModalProps extends BaseModalProps {
  name: TyphoonName | RetiredName;
  suggestions?: Suggestion[];
  suggestionsLoading?: boolean;
  suggestionsError?: Error | null;
}

type TabType = "info" | "suggestions";

const NameDetailsModal = ({
  isOpen,
  onClose,
  name,
  suggestions,
  suggestionsLoading = false,
  suggestionsError = null,
}: NameDetailsModalProps) => {
  const [activeTab, setActiveTab] = useState<TabType>("info");

  const hasImage = !!name.image;
  const hasDescription = !!name.description;
  const replacementName = "replacementName" in name ? name.replacementName : "";
  const showSuggestionsTab = Boolean(name.isRetired) && suggestions !== undefined;

  const titleColorClass = Boolean(name.isRetired)
    ? name.isLanguageProblem === 2
      ? "text-amber-500"
      : "text-red-600"
    : "text-blue-600";

  const getTabClasses = (tab: TabType) => {
    const isActive = activeTab === tab;
    return `flex-1 px-6 pb-3 font-semibold transition-colors ${
      isActive ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"
    }`;
  };

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
    return <SuggestionsList suggestions={suggestions ?? []} />;
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      width={showSuggestionsTab ? 600 : 560}
      footer={null}
      centered
      destroyOnHidden
      afterOpenChange={(open) => {
        if (open) setActiveTab("info");
      }}
      styles={{ header: { borderBottom: "1px solid #9ca3af", paddingBottom: "12px" } }}
      title={<span className={`text-2xl font-bold ${titleColorClass}`}>{name.name}</span>}
    >
      <div className="max-h-[90%] overflow-y-auto pt-4">
        {showSuggestionsTab && (
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
        )}

        {showSuggestionsTab && activeTab === "suggestions" ? (
          renderSuggestionsContent()
        ) : (
          <div className={`flex gap-6 ${hasImage ? "flex-row" : "flex-col"}`}>
            <div className="flex-1 space-y-4">
              <div>
                <div className="text-sm font-medium text-slate-500">Meaning</div>
                <p className="mt-1 text-base leading-relaxed font-semibold text-teal-600 italic">
                  {name.meaning}
                </p>
              </div>

              <div className="border-t border-slate-200 pt-3">
                <div className="mb-2 text-sm font-medium text-slate-500">Origin</div>
                <div className="flex items-center gap-3">
                  <CountryFlag country={name.country} className="h-8 w-12" />
                  <div className="text-base font-semibold text-slate-800">{name.country}</div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-3">
                <div className="text-sm font-medium text-slate-500">Language</div>
                <div className="mt-1 text-base text-slate-700">{name.language}</div>
              </div>

              <div className="border-t border-slate-200 pt-3 text-sm text-slate-600">
                <span className="font-medium">Index Position:</span> #{name.position}
                {replacementName && (
                  <>
                    <span className="mx-1">•</span>
                    <span className="font-medium">Replaced by:</span>{" "}
                    <span className="font-semibold text-teal-600">{replacementName}</span>
                  </>
                )}
              </div>

              {!hasImage && hasDescription && (
                <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                  <div className="mb-2 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                    Note
                  </div>
                  <p className="text-sm leading-relaxed text-slate-700">{name.description}</p>
                </div>
              )}
            </div>

            {name.image && (
              <div className="min-w-0 flex-1">
                <div className="sticky top-0">
                  <div
                    className="relative overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
                    style={{ aspectRatio: "4/3" }}
                  >
                    <ImageWithLoader
                      src={name.image}
                      alt={name.name}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                  {hasDescription && (
                    <p className="mt-3 text-center text-xs leading-relaxed text-slate-600 italic">
                      {name.description}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default NameDetailsModal;
