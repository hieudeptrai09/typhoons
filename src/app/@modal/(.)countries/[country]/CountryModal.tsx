"use client";

import CountryFlag from "@/lib/components/CountryFlag";
import DefModal from "@/lib/components/DefModal";
import EmptyResults from "@/lib/components/EmptyResults";
import FrownError from "@/lib/components/FrownError";
import GroupedStormList from "@/lib/components/GroupedStormList";
import StormStatistics from "@/lib/components/StormStatistics";
import Tabs, { type Tab } from "@/lib/components/Tabs";
import type { Storm } from "@/lib/types";
import { TEXT_COLOR_WHITE_BACKGROUND } from "@/lib/utils/colors";
import { getCountryPositionGroups } from "@/lib/utils/country";
import { getPositionSlug, getPositionTitle } from "@/lib/utils/position";
import { calculateAverage, getIntensityFromNumber } from "@/lib/utils/storms";
import { SearchX } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";

interface CountryModalProps {
  country: string;
  storms: Storm[] | null;
}

type TabType = "storms" | "stats";

export default function CountryModal({ country, storms }: CountryModalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("storms");

  const titleColor =
    storms && storms.length > 0
      ? TEXT_COLOR_WHITE_BACKGROUND[getIntensityFromNumber(calculateAverage(storms))]
      : "#64748b";

  const title: ReactNode = (
    <div className="flex items-center gap-3">
      <CountryFlag country={country} className="h-6 w-9" />
      <span className="text-2xl font-bold" style={{ color: titleColor }}>
        {country}
      </span>
    </div>
  );

  let content: ReactNode;

  if (!storms) {
    content = <FrownError />;
  } else if (storms.length === 0) {
    content = (
      <EmptyResults icon={SearchX} description="No storms recorded for this country yet." />
    );
  } else {
    const groups = getCountryPositionGroups(storms, country)
      .filter(([, positionStorms]) => positionStorms.length > 0)
      .map(([position, positionStorms]) => ({
        key: String(position),
        label: (
          <Link href={`/positions/${getPositionSlug(position)}/`} className="hover:underline">
            {getPositionTitle(position)}
          </Link>
        ),
        storms: positionStorms,
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
        content: <StormStatistics storms={storms} showGap={false} idPrefix="country-modal-stats" />,
      },
    ];

    content = (
      <div className="pt-4">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          ariaLabel="Country details tabs"
          idPrefix="country-modal-tab"
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
