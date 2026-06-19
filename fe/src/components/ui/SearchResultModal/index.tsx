"use client";

import { useState } from "react";
import { Modal, Spin } from "antd";
import SuggestionsList from "../../../app/(navbar)/names/retired/_components/NameDetailsModal/SuggestionsList";
import { NameListModalInner } from "../../../app/(navbar)/storms/_components/_modals/NameListModal";
import { useFetchData } from "../../../containers/hooks/useFetchData";
import { getNameStatusColorClass } from "../../colors";
import { NameDetailsContent } from "../NameDetailsModal";
import type { SearchDetail, BaseModalProps } from "../../../types";

interface SearchResultModalProps extends BaseModalProps {
  nameId?: number | null;
  stormName?: string | null;
}

type TabType = "storms" | "details" | "suggestions";

const SearchResultModal = ({ isOpen, onClose, nameId, stormName }: SearchResultModalProps) => {
  const [activeTab, setActiveTab] = useState<TabType>("storms");

  const endpoint = nameId
    ? `/search?nameId=${nameId}`
    : stormName
      ? `/search?name=${encodeURIComponent(stormName)}`
      : "";

  const { data: detail, loading, error } = useFetchData<SearchDetail>(isOpen ? endpoint : "");

  const nameData = detail?.name ?? null;
  const storms = detail?.storms ?? [];
  const suggestions = detail?.suggestions ?? [];

  const isInPosition = nameData ? nameData.position >= 1 && nameData.position <= 140 : false;
  const isRetired = nameData ? Boolean(nameData.isRetired) : false;

  const titleColorClass = nameData ? getNameStatusColorClass(nameData) : "text-gray-700";

  const displayName = nameData?.name ?? stormName ?? storms[0]?.name ?? "Unknown";

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

  if (loading) {
    return (
      <Modal open={isOpen} onCancel={onClose} width={600} footer={null} centered destroyOnHidden>
        <div className="flex justify-center py-12">
          <Spin size="large" />
        </div>
      </Modal>
    );
  }

  if (error || !detail) {
    return (
      <Modal open={isOpen} onCancel={onClose} width={600} footer={null} centered destroyOnHidden>
        <div className="py-8 text-center text-gray-500">Failed to load data.</div>
      </Modal>
    );
  }

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
        body: { height: "70vh", overflowY: "auto" },
      }}
      title={<span className={`text-2xl font-bold ${titleColorClass}`}>{displayName}</span>}
    >
      <div className="flex flex-col pt-4">
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
          {activeTab === "storms" &&
            (storms.length > 0 ? (
              <NameListModalInner name={displayName} storms={storms} />
            ) : (
              <div className="py-4 text-center text-gray-500">No storms found for this name.</div>
            ))}
          {activeTab === "details" && nameData && <NameDetailsContent name={nameData} />}
          {activeTab === "suggestions" && <SuggestionsList suggestions={suggestions} />}
        </div>
      </div>
    </Modal>
  );
};

export default SearchResultModal;
