"use client";

import { calculateAverage, getIntensityFromNumber } from "@/app/(navbar)/storms/_utils/fns";
import CountryFlag from "@/lib/components/CountryFlag";
import DefModal from "@/lib/components/DefModal";
import EmptyResults from "@/lib/components/EmptyResults";
import FrownError from "@/lib/components/FrownError";
import { PositionNamesList, PositionStormsList } from "@/lib/components/PositionContent";
import Tabs, { type Tab } from "@/lib/components/Tabs";
import type { PositionDetail } from "@/lib/types";
import { TEXT_COLOR_WHITE_BACKGROUND } from "@/lib/utils/colors";
import { getPositionSlug, getPositionTitle } from "@/lib/utils/fns";
import { ChevronLeft, ChevronRight, SearchX } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";

interface PositionModalProps {
  detail: PositionDetail | null;
  position: number;
  isError?: boolean;
}

const TOTAL_POSITIONS = 143;

type TabType = "names" | "storms";

function ModalPagination({ position }: { position: number }) {
  const isFirst = position === 1;
  const isLast = position === TOTAL_POSITIONS;
  const prevPosition = isFirst ? TOTAL_POSITIONS : position - 1;
  const nextPosition = isLast ? 1 : position + 1;

  const linkClass = (isWrap: boolean) =>
    `flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm font-medium text-white transition-colors ${
      isWrap
        ? "border-gray-500 bg-gray-500 hover:border-slate-600 hover:bg-slate-600"
        : "border-sky-600 bg-sky-600 hover:border-sky-700 hover:bg-sky-700"
    }`;

  return (
    <nav
      className="mt-2 flex items-center justify-between border-t border-slate-200 pt-4"
      aria-label="Position pagination"
    >
      <Link href={`/positions/${getPositionSlug(prevPosition)}`} className={linkClass(isFirst)}>
        <ChevronLeft className="h-4 w-4" />
        {getPositionTitle(prevPosition)}
      </Link>
      <span className="text-sm text-muted">
        {position} / {TOTAL_POSITIONS}
      </span>
      <Link href={`/positions/${getPositionSlug(nextPosition)}`} className={linkClass(isLast)}>
        {getPositionTitle(nextPosition)}
        <ChevronRight className="h-4 w-4" />
      </Link>
    </nav>
  );
}

function OverallAverageBadge({ storms }: { storms: PositionDetail["storms"] }) {
  if (storms.length === 0) return null;
  const overallAverage = calculateAverage(storms);
  return (
    <div className="mb-4 flex items-center justify-end">
      <span className="text-sm font-medium text-muted">Overall Avg: </span>
      <span
        className="ml-1 text-lg font-bold"
        style={{ color: TEXT_COLOR_WHITE_BACKGROUND[getIntensityFromNumber(overallAverage)] }}
      >
        {overallAverage.toFixed(2)}
      </span>
    </div>
  );
}

export default function PositionModal({ detail, position, isError = false }: PositionModalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("names");

  const isInternal = position <= 140;
  const positionTitle = getPositionTitle(position);
  const country = detail?.country ?? "";
  const names = detail?.names ?? [];
  const storms = detail?.storms ?? [];

  const isEmpty = !detail || (names.length === 0 && storms.length === 0);

  const titleColor =
    storms.length > 0
      ? TEXT_COLOR_WHITE_BACKGROUND[getIntensityFromNumber(calculateAverage(storms))]
      : "#64748b";

  const title: ReactNode = (
    <div className="flex items-center gap-2">
      {isInternal && country && <CountryFlag country={country} className="h-5 w-8" />}
      <span className="text-2xl font-bold" style={{ color: titleColor }}>
        {positionTitle}
      </span>
      {isInternal && country && <span className="text-sm text-muted">{country}</span>}
    </div>
  );

  let content: ReactNode;

  if (isError) {
    content = <FrownError />;
  } else if (isEmpty) {
    content = <EmptyResults icon={SearchX} description="No data recorded for this position yet." />;
  } else if (isInternal) {
    const tabs: Tab<TabType>[] = [
      {
        key: "names",
        label: `Names (${names.length})`,
        content: <PositionNamesList names={names} storms={storms} />,
      },
      {
        key: "storms",
        label: `Storms (${storms.length})`,
        content: (
          <>
            <OverallAverageBadge storms={storms} />
            <PositionStormsList storms={storms} />
          </>
        ),
      },
    ];

    content = (
      <div className="pt-4">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          ariaLabel="Position details tabs"
          idPrefix="position-modal-tab"
        />
      </div>
    );
  } else {
    // External positions (CPHC / NHC / IMD) have no naming roster — storms only.
    content = (
      <div className="pt-4">
        <OverallAverageBadge storms={storms} />
        <PositionStormsList storms={storms} />
      </div>
    );
  }

  return (
    <DefModal
      onClose={() => router.back()}
      width={720}
      title={title}
      footer={<ModalPagination position={position} />}
    >
      {content}
    </DefModal>
  );
}
