"use client";

import {
  calculateAverage,
  getGroupedStorms,
  getIntensityFromNumber,
  sortNamesByFirstYear,
} from "@/app/(navbar)/storms/_utils/fns";
import CountryFlag from "@/lib/components/CountryFlag";
import DefModal from "@/lib/components/DefModal";
import EmptyResults from "@/lib/components/EmptyResults";
import FrownError from "@/lib/components/FrownError";
import ImageWithLoader from "@/lib/components/ImageWithLoader";
import Tabs, { type Tab } from "@/lib/components/Tabs";
import { INTENSITY_LABEL } from "@/lib/constants";
import type { PositionDetail, Storm, TyphoonName } from "@/lib/types";
import {
  BACKGROUND_BADGE,
  getNameStatusColorClass,
  TEXT_COLOR_WHITE_BACKGROUND,
} from "@/lib/utils/colors";
import { formatStormDateRange, getPositionTitle } from "@/lib/utils/fns";
import { Switch } from "antd";
import { Calendar, ImageIcon, SearchX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";

interface PositionModalProps {
  detail: PositionDetail | null;
  position: number;
  isError?: boolean;
}

type TabType = "names" | "storms";

/** Header row shared by both tabs: flag + label, with a switch to reveal images. */
function SectionHeader({
  country,
  label,
  showImages,
  onToggle,
  extra,
}: {
  country?: string;
  label: string;
  showImages: boolean;
  onToggle: (value: boolean) => void;
  extra?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        {country && <CountryFlag country={country} className="h-5 w-8" />}
        <span className="text-sm font-semibold text-muted">{label}</span>
        {extra}
      </div>
      <label className="flex shrink-0 cursor-pointer items-center gap-1.5 text-xs text-muted">
        <ImageIcon className="h-3.5 w-3.5" />
        Images
        <Switch size="small" checked={showImages} onChange={onToggle} />
      </label>
    </div>
  );
}

/** A single name in the roster: name + language + meaning, image revealed by the switch. */
function NameCard({ name, showImage }: { name: TyphoonName; showImage: boolean }) {
  const withImage = showImage && !!name.image;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className={`flex gap-4 ${withImage ? "flex-col sm:flex-row" : "flex-col"}`}>
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <span className={`font-bold ${getNameStatusColorClass(name)}`}>{name.name}</span>
            {name.language && <span className="text-xs text-muted">· {name.language}</span>}
          </div>
          {name.meaning && (
            <p className="mt-1 text-sm leading-relaxed text-teal-600 italic">{name.meaning}</p>
          )}
          {name.description && (
            <p className="mt-1 text-xs leading-relaxed text-muted">{name.description}</p>
          )}
        </div>
        {showImage && name.image && (
          <div
            className="relative shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 sm:w-32"
            style={{ aspectRatio: "4/3" }}
          >
            <ImageWithLoader
              src={name.image}
              alt={name.name}
              fill
              className="object-contain"
              unoptimized
            />
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * A single storm with a left accent border for its intensity. When the switch is
 * on, the track map is shown and the storm's label/date becomes its caption.
 */
function StormItem({ storm, showImage }: { storm: Storm; showImage: boolean }) {
  const accent = BACKGROUND_BADGE[storm.intensity];
  const label = INTENSITY_LABEL[storm.intensity];
  const dateRange = formatStormDateRange(
    storm.year,
    storm.monthStart,
    storm.dateStart,
    storm.monthEnd,
    storm.dateEnd,
    storm.isFromPrevYear,
  );
  const hasMap = !!storm.map && storm.map.trim() !== "";

  const caption = (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
      <span className="text-sm font-bold text-muted">
        {label} {storm.name}
      </span>
      {dateRange && (
        <span className="flex items-center gap-1 text-xs text-muted">
          <Calendar size={12} />
          {dateRange}
        </span>
      )}
    </div>
  );

  return (
    <div
      className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
      style={{ borderLeftWidth: 4, borderLeftColor: accent }}
    >
      {showImage ? (
        <div className="p-3">
          <div className="relative h-44 w-full overflow-hidden rounded-md bg-slate-50">
            {hasMap ? (
              <ImageWithLoader
                src={storm.map}
                alt={`${storm.name} ${storm.year} track`}
                fill
                className="object-contain"
                unoptimized
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-muted">
                No track map
              </div>
            )}
          </div>
          <div className="mt-2">{caption}</div>
        </div>
      ) : (
        <div className="px-4 py-3">{caption}</div>
      )}
    </div>
  );
}

export default function PositionModal({ detail, position, isError = false }: PositionModalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("names");
  const [showNameImages, setShowNameImages] = useState(false);
  const [showStormImages, setShowStormImages] = useState(false);

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
    <span className="text-2xl font-bold" style={{ color: titleColor }}>
      {positionTitle}
    </span>
  );

  const stormsPanel = (
    <div>
      <SectionHeader
        country={isInternal ? country : undefined}
        label={`Storms (${storms.length})`}
        showImages={showStormImages}
        onToggle={setShowStormImages}
        extra={
          storms.length > 0 ? (
            <span className="text-xs text-muted">
              Avg{" "}
              <span
                className="font-bold"
                style={{
                  color:
                    TEXT_COLOR_WHITE_BACKGROUND[getIntensityFromNumber(calculateAverage(storms))],
                }}
              >
                {calculateAverage(storms).toFixed(2)}
              </span>
            </span>
          ) : undefined
        }
      />
      {storms.length === 0 ? (
        <p className="py-4 text-center text-muted">No storms recorded at this position.</p>
      ) : (
        <div className="space-y-5">
          {sortNamesByFirstYear(Object.entries(getGroupedStorms(storms, "name"))).map(
            ([name, group]) => {
              const sorted = [...group].sort((a, b) => a.year - b.year);
              const average = calculateAverage(sorted);
              const groupColor = TEXT_COLOR_WHITE_BACKGROUND[getIntensityFromNumber(average)];
              return (
                <div key={name}>
                  <div className="mb-2 flex items-baseline justify-between gap-2">
                    <div className="flex items-baseline gap-2">
                      <span className="font-semibold" style={{ color: groupColor }}>
                        {name}
                      </span>
                      <span className="text-xs text-muted">{sorted.length}</span>
                    </div>
                    <span className="text-sm text-muted">
                      avg:{" "}
                      <span className="font-bold" style={{ color: groupColor }}>
                        {average.toFixed(2)}
                      </span>
                    </span>
                  </div>
                  <div className={showStormImages ? "grid gap-3 sm:grid-cols-2" : "space-y-2"}>
                    {sorted.map((storm, idx) => (
                      <StormItem key={idx} storm={storm} showImage={showStormImages} />
                    ))}
                  </div>
                </div>
              );
            },
          )}
        </div>
      )}
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
        content: (
          <div>
            <SectionHeader
              country={country}
              label={`Names (${names.length})`}
              showImages={showNameImages}
              onToggle={setShowNameImages}
            />
            {names.length === 0 ? (
              <p className="py-4 text-center text-muted">
                No names have been assigned to this slot.
              </p>
            ) : (
              <div className="space-y-3">
                {names.map((name) => (
                  <NameCard key={name.id} name={name} showImage={showNameImages} />
                ))}
              </div>
            )}
          </div>
        ),
      },
      { key: "storms", label: `Storms (${storms.length})`, content: stormsPanel },
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
    content = <div className="pt-4">{stormsPanel}</div>;
  }

  return (
    <DefModal onClose={() => router.back()} width={720} title={title}>
      {content}
    </DefModal>
  );
}
