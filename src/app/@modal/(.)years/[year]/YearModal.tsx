"use client";

import DefModal from "@/lib/components/DefModal";
import FrownError from "@/lib/components/FrownError";
import GroupedStormList from "@/lib/components/GroupedStormList";
import StormStatistics from "@/lib/components/StormStatistics";
import Tabs, { type Tab } from "@/lib/components/Tabs";
import { MONTH_NAMES } from "@/lib/constants";
import type { Storm } from "@/lib/types";
import { TEXT_COLOR_WHITE_BACKGROUND } from "@/lib/utils/colors";
import { getSeasonMonthGroups } from "@/lib/utils/stormDates";
import { calculateAverage, getIntensityFromNumber } from "@/lib/utils/storms";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";

interface YearModalProps {
  year: number;
  // Already in start-date order.
  storms: Storm[] | null;
}

type TabType = "storms" | "stats";

export default function YearModal({ year, storms }: YearModalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("storms");

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
        content: <GroupedStormList groups={groups} showRecurrence={false} />,
      },
      {
        key: "stats",
        label: "Stats",
        content: <StormStatistics storms={storms} showGap={false} idPrefix="year-modal-stats" />,
      },
    ];

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
