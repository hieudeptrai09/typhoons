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
import { Calendar, ChevronLeft, ChevronRight, SearchX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";

interface PositionModalProps {
  detail: PositionDetail | null;
  position: number;
  isError?: boolean;
}

type TabType = "names" | "storms";

/** Shows one slide at a time with prev/next arrows and a dot for each slide. */
function Carousel({ slides, ariaLabel }: { slides: ReactNode[]; ariaLabel: string }) {
  const [index, setIndex] = useState(0);
  const count = slides.length;

  if (count === 0) return null;

  const active = Math.min(index, count - 1);
  const go = (delta: number) =>
    setIndex((prev) => (Math.min(prev, count - 1) + delta + count) % count);

  return (
    <div aria-label={ariaLabel} aria-roledescription="carousel">
      <div>{slides[active]}</div>
      {count > 1 && (
        <div className="mt-3 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous"
            className="rounded-full border border-slate-200 p-1.5 text-muted transition-colors hover:bg-slate-100"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === active}
                className={`h-1.5 rounded-full transition-all ${
                  i === active ? "w-4 bg-slate-700" : "w-1.5 bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next"
            className="rounded-full border border-slate-200 p-1.5 text-muted transition-colors hover:bg-slate-100"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

/** Section heading: flag + label, with optional trailing content (e.g. an average). */
function SectionHeader({
  country,
  label,
  extra,
}: {
  country?: string;
  label: string;
  extra?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center gap-2">
      {country && <CountryFlag country={country} className="h-5 w-8" />}
      <span className="text-sm font-semibold text-muted">{label}</span>
      {extra}
    </div>
  );
}

/** One name slide: "Name (country): meaning" above its image. */
function NameSlide({ name }: { name: TyphoonName }) {
  return (
    <div className="px-2">
      <p className="mb-3 text-center leading-relaxed">
        <span className={`font-bold ${getNameStatusColorClass(name)}`}>{name.name}</span>
        {name.country && <span className="text-sm text-muted"> ({name.country})</span>}
        {name.meaning && <span className="text-sm text-teal-600 italic">: {name.meaning}</span>}
      </p>
      <div className="relative mx-auto aspect-[4/3] w-full max-w-sm overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
        {name.image ? (
          <ImageWithLoader
            src={name.image}
            alt={name.name}
            fill
            className="object-contain"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted">No image</div>
        )}
      </div>
    </div>
  );
}

/** One storm slide: track map with the intensity label and date as its caption. */
function StormSlide({ storm }: { storm: Storm }) {
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

  return (
    <div
      className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
      style={{ borderLeftWidth: 4, borderLeftColor: accent }}
    >
      <div className="p-3">
        <div className="relative h-56 w-full overflow-hidden rounded-md bg-slate-50">
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
        <div className="mt-2 space-y-0.5">
          <div className="text-sm font-bold text-muted">{label}</div>
          <div className="flex items-center gap-1 text-xs text-muted">
            <Calendar size={12} />
            {dateRange || "Date unknown"}
          </div>
        </div>
      </div>
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
    <span className="text-2xl font-bold" style={{ color: titleColor }}>
      {positionTitle}
    </span>
  );

  const stormsPanel = (
    <div>
      <SectionHeader
        country={isInternal ? country : undefined}
        label={`Storms (${storms.length})`}
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
        <div className="space-y-6">
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
                  <Carousel
                    ariaLabel={`${name} storms`}
                    slides={sorted.map((storm, idx) => (
                      <StormSlide key={idx} storm={storm} />
                    ))}
                  />
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
            <SectionHeader country={country} label={`Names (${names.length})`} />
            {names.length === 0 ? (
              <p className="py-4 text-center text-muted">
                No names have been assigned to this slot.
              </p>
            ) : (
              <Carousel
                ariaLabel="Names"
                slides={names.map((name) => (
                  <NameSlide key={name.id} name={name} />
                ))}
              />
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
