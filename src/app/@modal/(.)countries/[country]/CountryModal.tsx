"use client";

import CountryFlag from "@/lib/components/CountryFlag";
import CountryNames from "@/lib/components/CountryNames";
import DefModal from "@/lib/components/DefModal";
import EmptyResults from "@/lib/components/EmptyResults";
import FrownError from "@/lib/components/FrownError";
import GroupedStormCards from "@/lib/components/GroupedStormCards";
import StormStatistics from "@/lib/components/StormStatistics";
import Tabs, { type Tab } from "@/lib/components/Tabs";
import type { RetiredName, Storm } from "@/lib/types";
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
  names: RetiredName[] | null;
}

type TabType = "names" | "storms" | "stats";

export default function CountryModal({ country, storms, names }: CountryModalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("names");

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

  if (!storms || !names) {
    content = <FrownError />;
  } else if (storms.length === 0 && names.length === 0) {
    content = (
      <EmptyResults icon={SearchX} description="No storms recorded for this country yet." />
    );
  } else {
    const positionGroups = getCountryPositionGroups(storms, country);
    const groups = positionGroups
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
        key: "names",
        label: `Names (${names.length})`,
        content: <CountryNames names={names} positionGroups={positionGroups} />,
      },
      {
        key: "storms",
        label: `Storms (${storms.length})`,
        content:
          storms.length === 0 ? (
            <p className="py-4 text-center text-foreground">
              No storms recorded for this country&apos;s names.
            </p>
          ) : (
            <GroupedStormCards groups={groups} isCompact />
          ),
      },
    ];
    if (storms.length > 0) {
      tabs.push({
        key: "stats",
        label: "Stats",
        content: <StormStatistics storms={storms} showGap={false} idPrefix="country-modal-stats" />,
      });
    }

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
