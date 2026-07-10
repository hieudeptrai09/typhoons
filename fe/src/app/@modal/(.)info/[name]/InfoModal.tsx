"use client";

import CountryFlag from "@/lib/components/CountryFlag";
import EmptyResults from "@/lib/components/EmptyResults";
import ImageWithLoader from "@/lib/components/ImageWithLoader";
import NameDetailsContent from "@/lib/components/NameDetailsContent";
import NameStatusIcon from "@/lib/components/NameStatusIcon";
import Tabs, { type Tab } from "@/lib/components/Tabs";
import { INTENSITY_LABEL } from "@/lib/constants";
import type { SearchDetail, Storm } from "@/lib/types";
import {
  BACKGROUND_BADGE,
  getNameStatusColor,
  isExternalPosition,
  TEXT_COLOR_WHITE_BACKGROUND,
} from "@/lib/utils/colors";
import { formatStormDateRange } from "@/lib/utils/fns";
import { Modal, Switch } from "antd";
import { Inbox, SearchX } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

interface InfoModalProps {
  detail: SearchDetail | null;
  name: string;
}

type TabType = "details" | "storms";

function StormRow({ storm, showMap }: { storm: Storm; showMap: boolean }) {
  const borderColor = BACKGROUND_BADGE[storm.intensity];
  const textColor = TEXT_COLOR_WHITE_BACKGROUND[storm.intensity];
  const label = INTENSITY_LABEL[storm.intensity];
  const hasMap = storm.map && storm.map.trim() !== "";
  const dateRange = formatStormDateRange(
    storm.year,
    storm.monthStart,
    storm.dateStart,
    storm.monthEnd,
    storm.dateEnd,
    storm.isFromPrevYear,
  );

  return (
    <div
      className="rounded-md px-3 py-2 transition-colors hover:bg-gray-50"
      style={{ borderLeft: `4px solid ${borderColor}` }}
    >
      {showMap && hasMap && (
        <div className="relative mb-2 h-48 w-full">
          <ImageWithLoader
            src={storm.map}
            alt={`${storm.name} ${storm.year} track`}
            fill
            className="rounded border border-gray-200 object-contain"
            unoptimized
          />
        </div>
      )}
      <div className="text-sm font-bold" style={{ color: textColor }}>
        {label} {storm.name}
      </div>
      {dateRange && <div className="text-xs text-muted">{dateRange}</div>}
    </div>
  );
}

function StormsTab({ storms }: { storms: Storm[] }) {
  const [showMap, setShowMap] = useState(false);

  if (storms.length === 0) {
    return <EmptyResults icon={Inbox} description="No storms found for this name." />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-muted">Contributed by:</span>
            <CountryFlag country={storms[0].country} className="h-5 w-8" />
            <span className="text-muted">{storms[0].country}</span>
          </div>
          <div>
            <span className="font-semibold text-muted">Position:</span>
            <span className="ml-2 text-muted">{storms[0].position}</span>
          </div>
          {storms[0].correctSpelling && (
            <div>
              <span className="font-semibold text-muted">Correct spelling:</span>
              <span className="ml-2 text-muted">{storms[0].correctSpelling}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-muted">Show Map</span>
          <Switch checked={showMap} onChange={setShowMap} aria-label="Show storm track map" />
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-semibold text-muted">All Storms ({storms.length})</h3>
        <div className="space-y-1">
          {storms.map((storm, idx) => (
            <StormRow key={`${storm.year}-${storm.name}-${idx}`} storm={storm} showMap={showMap} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function InfoModal({ detail, name }: InfoModalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const nameData = detail?.name ?? null;
  const storms = detail?.storms ?? [];
  const displayName = nameData?.name ?? name;
  const isRetired = nameData ? Boolean(nameData.isRetired) : false;

  const [activeTab, setActiveTab] = useState<TabType>(
    searchParams.get("tab") === "storms" ? "storms" : "details",
  );

  if (!nameData && storms.length === 0) {
    return (
      <Modal open onCancel={() => router.back()} footer={null} width={560} centered destroyOnHidden>
        <EmptyResults icon={SearchX} description="No typhoon with that name was found." />
      </Modal>
    );
  }

  const nameStatusColor = getNameStatusColor({
    isRetired,
    isLanguageProblem: nameData?.isLanguageProblem ?? 0,
    isExternal: isExternalPosition(nameData?.position),
  });

  const detailsContent = nameData ? (
    <NameDetailsContent name={nameData} />
  ) : (
    <EmptyResults icon={Inbox} description="No name details available for this external name." />
  );
  const stormsContent = <StormsTab storms={storms} />;

  const tabs: Tab<TabType>[] = [
    { key: "storms", label: `Storms (${storms.length})`, content: stormsContent },
    { key: "details", label: "Name Details", content: detailsContent },
  ];

  return (
    <Modal
      open
      onCancel={() => router.back()}
      footer={null}
      width={560}
      centered
      destroyOnHidden
      styles={{
        // CONSOLIDATION: this exact `{ borderBottom: "1px solid #9ca3af",
        // paddingBottom: "12px" }` header style is copy-pasted verbatim into
        // 11 modal components (StormDetailModal, NamesSettingsModal,
        // AverageModal, DashboardModal, ListFilterModal, RetiredNameDetailsModal,
        // RetiredFilterModal, NameDetailsModal, HistoryModal, NameListModal,
        // plus this one) — candidate for one shared `modalHeaderStyles`
        // constant/style object.
        header: { borderBottom: "1px solid #9ca3af", paddingBottom: "12px" },
        body: { maxHeight: "70vh", overflowY: "auto" },
      }}
      title={
        <div className="flex items-center gap-2">
          <NameStatusIcon
            isRetired={isRetired}
            isLanguageProblem={nameData?.isLanguageProblem ?? 0}
            position={nameData?.position ?? 0}
            size={24}
          />
          <span className="text-2xl font-bold capitalize" style={{ color: nameStatusColor }}>
            {displayName.toLowerCase()}
          </span>
        </div>
      }
    >
      <div className="pt-4">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          ariaLabel="Name details tabs"
          idPrefix="info-modal-tab"
        />
      </div>
    </Modal>
  );
}
