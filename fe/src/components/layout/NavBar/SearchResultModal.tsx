"use client";

import { useState, useRef, useEffect } from "react";
import { Modal, Spin, Switch } from "antd";
import { useFetchData } from "../../../containers/hooks/useFetchData";
import CountryFlag from "../../components/CountryFlag";
import ImageWithLoader from "../../components/ImageWithLoader";
import StormMapPopup from "../../../app/(navbar)/storms/_components/_popups/StormMapPopup";
import SuggestionsList from "../../../app/(navbar)/names/retired/_components/NameDetailsModal/SuggestionsList";
import {
  BACKGROUND_BADGE,
  TEXT_COLOR_BADGE,
  BACKGROUND_HOVER_BADGE,
  INTENSITY_LABEL,
} from "../../../constants";
import type { TyphoonName, RetiredName, Suggestion, Storm, BaseModalProps } from "../../../types";

interface SearchResultModalProps extends BaseModalProps {
  searchName: string;
}

type TabType = "storms" | "details" | "suggestions";

const SearchResultModal = ({ isOpen, onClose, searchName }: SearchResultModalProps) => {
  const [activeTab, setActiveTab] = useState<TabType>("storms");

  const encodedName = encodeURIComponent(searchName);

  const {
    data: storms,
    loading: stormsLoading,
    error: stormsError,
  } = useFetchData<Storm[]>(isOpen ? `/storms?name=${encodedName}` : "");

  const {
    data: nameData,
    loading: nameLoading,
    error: nameError,
  } = useFetchData<(TyphoonName | RetiredName)[]>(
    isOpen ? `/typhoon-names?name=${encodedName}` : "",
  );

  const activeName = (nameData ?? []).find((n) => !n.isRetired);
  const retiredName = (nameData ?? []).find((n) => Boolean(n.isRetired));
  const primaryName = activeName ?? retiredName ?? null;

  const isInPosition = primaryName ? primaryName.position >= 1 && primaryName.position <= 140 : false;
  const isRetired = primaryName ? Boolean(primaryName.isRetired) : false;

  const {
    data: suggestions,
    loading: suggestionsLoading,
    error: suggestionsError,
  } = useFetchData<Suggestion[]>(
    isOpen && retiredName && isInPosition ? `/suggested-names?nameId=${retiredName.id}` : "",
  );

  const titleColorClass = primaryName
    ? isRetired
      ? primaryName.isLanguageProblem === 2
        ? "text-amber-500"
        : primaryName.isLanguageProblem === 1
          ? "text-green-600"
          : primaryName.isLanguageProblem === 3
            ? "text-purple-600"
            : "text-red-600"
      : "text-blue-600"
    : "text-gray-700";

  const tabs: { key: TabType; label: string; visible: boolean }[] = [
    { key: "storms", label: "Storms", visible: true },
    { key: "details", label: "Name Details", visible: isInPosition },
    { key: "suggestions", label: "Suggestions", visible: isInPosition && isRetired },
  ];

  const visibleTabs = tabs.filter((t) => t.visible);

  const getTabClasses = (tab: TabType) => {
    const isActive = activeTab === tab;
    return `flex-1 px-4 pb-3 font-semibold transition-colors text-sm ${
      isActive ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"
    }`;
  };

  return (
    <Modal
      open={isOpen}
      onCancel={() => {
        setActiveTab("storms");
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
      title={<span className={`text-2xl font-bold ${titleColorClass}`}>{searchName}</span>}
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
          {activeTab === "storms" && (
            <StormsTab
              name={searchName}
              storms={storms ?? []}
              loading={stormsLoading}
              error={stormsError}
            />
          )}
          {activeTab === "details" && (
            <DetailsTab name={primaryName} loading={nameLoading} error={nameError} />
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

const StormsTab = ({
  name,
  storms,
  loading,
  error,
}: {
  name: string;
  storms: Storm[];
  loading: boolean;
  error: Error | null;
}) => {
  const [showMap, setShowMap] = useState(false);
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);
  const [selectedStorm, setSelectedStorm] = useState<number | null>(null);
  const [modalContainer, setModalContainer] = useState<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stormRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setModalContainer(containerRef.current);
  }, []);

  const handleBadgeClick = (index: number) => {
    setSelectedStorm((prev) => (prev === index ? null : index));
  };

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

  if (storms.length === 0) {
    return <div className="py-4 text-center text-gray-500">No storms found for this name.</div>;
  }

  const selectedStormData = selectedStorm !== null ? storms[selectedStorm] : null;
  const selectedBorderColor = selectedStormData
    ? BACKGROUND_BADGE[selectedStormData.intensity]
    : "";

  return (
    <div ref={containerRef} className="relative space-y-4">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">Country:</span>
            <CountryFlag country={storms[0].country} className="h-5 w-8" />
          </div>
          <div>
            <span className="font-semibold text-gray-700">Position:</span>
            <span className="ml-2 text-gray-700">{storms[0].position}</span>
          </div>
          {storms[0].correctSpelling && (
            <div>
              <span className="font-semibold text-gray-700">Correct spelling:</span>
              <span className="ml-2 text-gray-700">{storms[0].correctSpelling}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-700">Show Map</span>
          <Switch checked={showMap} onChange={setShowMap} />
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-semibold text-gray-700">
          All {name} Storms ({storms.length})
        </h3>
        <div className="relative space-y-2">
          {storms.map((storm, idx) => {
            const bgColor = BACKGROUND_BADGE[storm.intensity];
            const textColor = TEXT_COLOR_BADGE[storm.intensity];
            const hoverColor = BACKGROUND_HOVER_BADGE[storm.intensity];
            const isHovered = hoveredYear === storm.year;
            const label = INTENSITY_LABEL[storm.intensity];
            const stormTitle = `${label} ${storm.name} ${storm.year}`;

            return (
              <div
                key={idx}
                ref={(el) => {
                  stormRefs.current[idx] = el;
                }}
                className="cursor-pointer rounded-lg bg-white px-2 transition-colors hover:bg-gray-100"
                onMouseEnter={() => setHoveredYear(storm.year)}
                onMouseLeave={() => setHoveredYear(null)}
                onClick={() => handleBadgeClick(idx)}
              >
                <div
                  className={`flex items-center gap-4 rounded-md p-2 transition-colors ${
                    selectedStorm === idx ? "rounded-t-md" : "rounded-md"
                  }`}
                  style={{ backgroundColor: isHovered ? hoverColor : bgColor }}
                >
                  <div className="flex-1">
                    <div className="text-sm font-bold" style={{ color: textColor }}>
                      {stormTitle}
                    </div>
                  </div>
                  {showMap && (
                    <div className="relative h-32 w-48 shrink-0">
                      <ImageWithLoader
                        src={storm.map}
                        alt={`${storm.name} ${storm.year} track`}
                        fill
                        className="rounded border-2 border-white/30 object-cover"
                        unoptimized
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <StormMapPopup
        popupRef={popupRef}
        selectedStorm={selectedStormData}
        stormRefs={stormRefs}
        selectedStormIndex={selectedStorm}
        modalContainer={modalContainer}
        borderColor={selectedBorderColor}
        onClose={() => setSelectedStorm(null)}
      />
    </div>
  );
};

const DetailsTab = ({
  name,
  loading,
  error,
}: {
  name: (TyphoonName | RetiredName) | null;
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

  if (error || !name) {
    return <div className="py-4 text-center text-gray-500">Failed to load name details.</div>;
  }

  const hasImage = !!name.image;
  const hasDescription = !!name.description;

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
