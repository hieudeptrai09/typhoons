"use client";

import DefModal from "@/lib/components/DefModal";
import FrownError from "@/lib/components/FrownError";
import GroupedStormCards from "@/lib/components/GroupedStormCards";
import SeasonNameChanges, { hasNameChanges } from "@/lib/components/SeasonNameChanges";
import StormStatistics from "@/lib/components/StormStatistics";
import Tabs, { type Tab } from "@/lib/components/Tabs";
import { MONTH_NAMES } from "@/lib/constants";
import type { RetiredName, Storm } from "@/lib/types";
import { TEXT_COLOR_WHITE_BACKGROUND } from "@/lib/utils/colors";
import { getSeasonMonthGroups } from "@/lib/utils/stormDates";
import { calculateAverage, getIntensityFromNumber } from "@/lib/utils/storms";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";

interface YearModalProps {
  year: number;
  // Already in start-date order.
  storms: Storm[] | null;
  // Names whose last season this was.
  retiredNames: RetiredName[];
  // The storms that first carried their name, in start-date order.
  debuts: Storm[];
}

type TabType = "names" | "storms" | "stats";

export default function YearModal({ year, storms, retiredNames, debuts }: YearModalProps) {
  const router = useRouter();
  const showNames = hasNameChanges({ retiredNames, debuts });
  // Mirrors the page, where name changes lead when the season has any.
  const [activeTab, setActiveTab] = useState<TabType>(showNames ? "names" : "storms");

  const titleColor =
    storms && storms.length > 0
      ? TEXT_COLOR_WHITE_BACKGROUND[getIntensityFromNumber(calculateAverage(storms))]
      : "#64748b";

  const title: ReactNode = (
    <div className="flex items-baseline gap-3">
      <span className="text-2xl font-bold tabular-nums" style={{ color: titleColor }}>
        {year}
      </span>
      <span className="text-base font-normal text-foreground">Typhoon Season</span>
    </div>
  );

  let content: ReactNode;

  if (!storms) {
    content = <FrownError />;
  } else {
    const groups = getSeasonMonthGroups(storms).map(([month, monthStorms], idx) => ({
      // A carried-over December and the season's own December are separate runs.
      key: `${month}-${idx}`,
      label: MONTH_NAMES[month],
      storms: monthStorms,
    }));

    const tabs: Tab<TabType>[] = [
      {
        key: "storms",
        label: `Storms (${storms.length})`,
        content: <GroupedStormCards groups={groups} showRecurrence={false} isCompact />,
      },
      {
        key: "stats",
        label: "Stats",
        content: <StormStatistics storms={storms} showGap={false} idPrefix="year-modal-stats" />,
      },
    ];
    if (showNames) {
      tabs.unshift({
        key: "names",
        label: "Name Changes",
        content: <SeasonNameChanges retiredNames={retiredNames} debuts={debuts} />,
      });
    }

    content = (
      <div className="pt-4">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          ariaLabel="Season details tabs"
          idPrefix="year-modal-tab"
        />
      </div>
    );
  }

  return (
    <DefModal onClose={() => router.back()} title={title} width={600}>
      {content}
    </DefModal>
  );
}
