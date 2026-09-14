"use client";

import IntensityBreakdown from "@/lib/components/IntensityBreakdown";
import RecurrenceTimeline from "@/lib/components/RecurrenceTimeline";
import StartMonthBreakdown from "@/lib/components/StartMonthBreakdown";
import StormStats from "@/lib/components/StormStats";
import Tabs, { type Tab } from "@/lib/components/Tabs";
import type { Storm } from "@/lib/types";
import { useState } from "react";

type BreakdownTab = "intensity" | "dates" | "gap";

interface StormStatisticsProps {
  storms: Storm[];
  // Gap only means something for one name or slot: a season or a country has several storms a year.
  showGap?: boolean;
  // Keeps the tab ids unique when a page and a modal are both mounted.
  idPrefix: string;
}

/** Headline averages above the Avg. Intensity / Avg. Dates / Avg. Gap breakdowns. */
const StormStatistics = ({ storms, showGap = true, idPrefix }: StormStatisticsProps) => {
  const [activeTab, setActiveTab] = useState<BreakdownTab>("intensity");

  const tabs: Tab<BreakdownTab>[] = [
    { key: "intensity", label: "Avg. Intensity", content: <IntensityBreakdown storms={storms} /> },
    { key: "dates", label: "Avg. Dates", content: <StartMonthBreakdown storms={storms} /> },
    { key: "gap", label: "Avg. Gap", content: <RecurrenceTimeline storms={storms} /> },
  ];

  return (
    <div className="space-y-6">
      <StormStats storms={storms} showRecurrence={showGap} />
      <Tabs
        tabs={showGap ? tabs : tabs.filter((tab) => tab.key !== "gap")}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        ariaLabel="Storm statistics tabs"
        idPrefix={idPrefix}
      />
    </div>
  );
};

export default StormStatistics;
