"use client";

import { useState } from "react";
import { Modal, Spin } from "antd";
import { useFetchData } from "../../../containers/hooks/useFetchData";
import CountryFlag from "../../components/CountryFlag";
import ImageWithLoader from "../../components/ImageWithLoader";
import SuggestionsList from "../../../app/(navbar)/names/retired/_components/NameDetailsModal/SuggestionsList";
import type { TyphoonName, RetiredName, Suggestion, Storm, BaseModalProps } from "../../../types";

interface SearchResultModalProps extends BaseModalProps {
  name: TyphoonName | RetiredName;
}

type TabType = "details" | "history" | "suggestions";

const SearchResultModal = ({ isOpen, onClose, name }: SearchResultModalProps) => {
  const [activeTab, setActiveTab] = useState<TabType>("details");

  const isInPosition = name.position >= 1 && name.position <= 140;
  const isRetired = Boolean(name.isRetired);

  const { data: allNames } = useFetchData<TyphoonName[]>(
    isOpen && isInPosition ? "/typhoon-names" : "",
  );

  const { data: suggestions, loading: suggestionsLoading, error: suggestionsError } =
    useFetchData<Suggestion[]>(
      isOpen && isRetired && isInPosition ? `/suggested-names?nameId=${name.id}` : "",
    );

  const positionNames = (allNames ?? []).filter((n) => n.position === name.position);

  const titleColorClass = isRetired
    ? name.isLanguageProblem === 2
      ? "text-amber-500"
      : name.isLanguageProblem === 1
        ? "text-green-600"
        : name.isLanguageProblem === 3
          ? "text-purple-600"
          : "text-red-600"
    : "text-blue-600";

  const tabs: { key: TabType; label: string; visible: boolean }[] = [
    { key: "details", label: "Name Details", visible: true },
    { key: "history", label: "Position History", visible: isInPosition },
    { key: "suggestions", label: "Suggestions", visible: isInPosition && isRetired },
  ];

  const visibleTabs = tabs.filter((t) => t.visible);

  const getTabClasses = (tab: TabType) => {
    const isActive = activeTab === tab;
    return `flex-1 px-4 pb-3 font-semibold transition-colors text-sm ${
      isActive ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"
    }`;
  };

  const hasImage = !!name.image;
  const hasDescription = !!name.description;

  return (
    <Modal
      open={isOpen}
      onCancel={() => {
        setActiveTab("details");
        onClose();
      }}
      width={600}
      footer={null}
      centered
      destroyOnHidden
      styles={{
        header: { borderBottom: "1px solid #9ca3af", paddingBottom: "12px" },
        body: {
          height: typeof window !== "undefined" ? window.innerHeight * 0.8 - 120 : 480,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        },
      }}
      title={<span className={`text-2xl font-bold ${titleColorClass}`}>{name.name}</span>}
    >
      <div className="flex max-h-[90%] flex-1 flex-col overflow-y-auto pt-4">
        {visibleTabs.length > 1 && (
          <div className="mb-6 flex border-b border-gray-200">
            {visibleTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={getTabClasses(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        <div className="flex-1">
          {activeTab === "details" && (
            <DetailsTab name={name} hasImage={hasImage} hasDescription={hasDescription} />
          )}
          {activeTab === "history" && (
            <HistoryTab position={name.position} positionNames={positionNames} />
          )}
          {activeTab === "suggestions" && (
            <SuggestionsTab
              suggestions={suggestions ?? []}
              loading={suggestionsLoading}
              error={suggestionsError}
            />
          )}
        </div>
      </div>
    </Modal>
  );
};

const DetailsTab = ({
  name,
  hasImage,
  hasDescription,
}: {
  name: TyphoonName | RetiredName;
  hasImage: boolean;
  hasDescription: boolean;
}) => {
  const retiredName = "replacementName" in name ? (name as RetiredName) : null;

  return (
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

        {name.position > 0 && (
          <div className="border-t border-slate-200 pt-3">
            <div className="text-sm font-medium text-slate-500">Position</div>
            <div className="mt-1 text-base text-slate-700">#{name.position}</div>
          </div>
        )}

        {retiredName?.replacementName && (
          <div className="border-t border-slate-200 pt-3">
            <div className="text-sm font-medium text-slate-500">Replaced by</div>
            <div className="mt-1 text-base font-semibold text-teal-600">
              {retiredName.replacementName}
            </div>
          </div>
        )}

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
  );
};

const HistoryTab = ({
  position,
  positionNames,
}: {
  position: number;
  positionNames: TyphoonName[];
}) => {
  const [expandedNameId, setExpandedNameId] = useState<number | null>(null);

  const {
    data: storms,
    loading,
    error,
  } = useFetchData<Storm[]>(position ? `/storms?position=${position}` : "");

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spin size="medium" />
      </div>
    );
  }

  if (error) {
    return <div className="py-4 text-center text-gray-500">Failed to load storm data.</div>;
  }

  const stormsByName: Record<string, Storm[]> = {};
  (storms ?? []).forEach((storm) => {
    if (!stormsByName[storm.name]) stormsByName[storm.name] = [];
    stormsByName[storm.name].push(storm);
  });

  const sortedNames = [...positionNames].sort((a, b) => {
    const aStorms = stormsByName[a.name] || [];
    const bStorms = stormsByName[b.name] || [];
    const aFirst = aStorms.length > 0 ? Math.min(...aStorms.map((s) => s.year)) : Infinity;
    const bFirst = bStorms.length > 0 ? Math.min(...bStorms.map((s) => s.year)) : Infinity;
    return aFirst - bFirst;
  });

  const getNameColor = (n: TyphoonName): string => {
    if (n.isLanguageProblem === 2) return "#f59e0b";
    if (n.isRetired) return "#ef4444";
    return "#15803d";
  };

  if (positionNames.length === 0) {
    return <div className="py-4 text-center text-gray-500">No names at this position.</div>;
  }

  return (
    <div className="space-y-1">
      {sortedNames.map((n) => {
        const nameStorms = stormsByName[n.name] || [];
        const count = nameStorms.length;
        const years = nameStorms.map((s) => s.year).join(", ");
        const isExpanded = expandedNameId === n.id;
        const hasExpandable = !!n.image;

        return (
          <div key={n.id} className="overflow-hidden rounded-lg">
            <button
              disabled={!hasExpandable}
              onClick={() => hasExpandable && setExpandedNameId(isExpanded ? null : n.id)}
              className={`w-full rounded-lg px-3 py-2 text-left ${
                isExpanded ? "rounded-b-none bg-sky-50" : ""
              } ${hasExpandable ? "cursor-pointer hover:bg-gray-50" : "cursor-default"}`}
            >
              <div className="flex w-full items-baseline gap-2">
                <span className="min-w-8 shrink-0 text-sm font-bold text-gray-400">
                  {count > 0 ? `x${count}` : "x0"}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="whitespace-pre-line">
                    <span className="font-semibold" style={{ color: getNameColor(n) }}>
                      {n.name}
                    </span>
                    {count > 0 && <span className="ml-1 text-sm text-gray-500">({years})</span>}
                  </div>
                  {n.meaning && (
                    <p className="mt-0.5 text-xs leading-relaxed whitespace-pre-line text-teal-700 italic">
                      {n.meaning}
                    </p>
                  )}
                </div>
              </div>
            </button>

            {isExpanded && n.image && (
              <div className="rounded-b-lg border-t border-sky-100 bg-sky-50 px-4 py-3">
                <div
                  className="relative mx-auto overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
                  style={{ width: 160, aspectRatio: "4/3" }}
                >
                  <ImageWithLoader
                    src={n.image}
                    alt={n.name}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const SuggestionsTab = ({
  suggestions,
  loading,
  error,
}: {
  suggestions: Suggestion[];
  loading: boolean;
  error: Error | null;
}) => {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spin size="medium" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="py-4 text-center text-gray-500">Failed to load suggested replacements.</div>
    );
  }
  return <SuggestionsList suggestions={suggestions} />;
};

export default SearchResultModal;
