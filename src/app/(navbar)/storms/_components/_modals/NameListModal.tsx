import DefModal from "@/lib/components/DefModal";
import StormListContent from "@/lib/components/StormListContent";
import StormStatistics from "@/lib/components/StormStatistics";
import Tabs, { type Tab } from "@/lib/components/Tabs";
import type { BaseModalProps, Storm } from "@/lib/types";
import { TEXT_COLOR_WHITE_BACKGROUND } from "@/lib/utils/colors";
import { getIntensityFromNumber } from "@/lib/utils/storms";
import { useState, type CSSProperties } from "react";

// It's used to a part of modal @modal/(.)info/[name], but the owner forced to divorce and go back to here.
export interface NameListModalProps extends BaseModalProps {
  name: string;
  storms: Storm[];
  avgIntensity?: number;
}

type TabType = "storms" | "stats";

const NameListTabs = ({ storms }: { storms: Storm[] }) => {
  const [activeTab, setActiveTab] = useState<TabType>("storms");

  const tabs: Tab<TabType>[] = [
    {
      key: "storms",
      label: `Storms (${storms.length})`,
      content: <StormListContent storms={storms} />,
    },
    {
      key: "stats",
      label: "Stats",
      content: <StormStatistics storms={storms} idPrefix="name-list-modal-stats" />,
    },
  ];

  return (
    <Tabs
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      ariaLabel="Name storms tabs"
      idPrefix="name-list-modal-tab"
    />
  );
};

const NameListModal = ({ isOpen, onClose, name, storms, avgIntensity = 0 }: NameListModalProps) => {
  const titleStyle: CSSProperties = {
    color: TEXT_COLOR_WHITE_BACKGROUND[getIntensityFromNumber(avgIntensity)],
  };

  if (!storms || storms.length === 0) return null;

  return (
    <DefModal
      open={isOpen}
      onClose={onClose}
      width={512}
      title={
        <span className="text-2xl font-bold" style={titleStyle}>
          {name}
        </span>
      }
    >
      <div className="pt-4">
        {/* Keyed by name so opening another name starts back on its storms. */}
        <NameListTabs key={name} storms={storms} />
      </div>
    </DefModal>
  );
};

export default NameListModal;
