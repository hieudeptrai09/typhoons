"use client";

import { useState } from "react";
import { Modal, Spin } from "antd";
import { NameListModalInner } from "../../../app/(navbar)/storms/_components/_modals/NameListModal";
import { useFetchData } from "../../../containers/hooks/useFetchData";
import { getNameStatusColorClass } from "../../colors";
import { NameDetailsContent } from "../NameDetailsModal";
import Tabs, { type Tab } from "../../components/Tabs";
import type { SearchDetail, BaseModalProps } from "../../../types";

interface SearchResultModalProps extends BaseModalProps {
  nameId?: number | null;
  stormName?: string | null;
}

type TabType = "storms" | "details";

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

  const isInPosition = nameData ? nameData.position >= 1 && nameData.position <= 140 : false;

  const titleColorClass = nameData ? getNameStatusColorClass(nameData) : "text-gray-700";

  const displayName = nameData?.name ?? stormName ?? storms[0]?.name ?? "Unknown";

  const tabs: Tab<TabType>[] = [
    {
      key: "storms",
      label: "Storms",
      content:
        storms.length > 0 ? (
          <NameListModalInner name={displayName} storms={storms} />
        ) : (
          <div className="py-4 text-center text-gray-500">No storms found for this name.</div>
        ),
    },
    {
      key: "details",
      label: "Name Details",
      content:
        isInPosition && nameData ? (
          <NameDetailsContent name={nameData} />
        ) : (
          <div className="py-4 text-center text-gray-500">
            This storm doesn&apos;t have name details.
          </div>
        ),
    },
  ];

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
      <div className="pt-4">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          ariaLabel="Search result tabs"
          idPrefix="search-tabpanel"
        />
      </div>
    </Modal>
  );
};

export default SearchResultModal;
