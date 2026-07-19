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
import { Carousel as AntCarousel } from "antd";
import { Calendar, ChevronLeft, ChevronRight, SearchX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, type ComponentRef, type ReactNode } from "react";

interface PositionModalProps {
  detail: PositionDetail | null;
  position: number;
  isError?: boolean;
}

type TabType = "names" | "storms";

function Carousel({ slides }: { slides: ReactNode[] }) {
  const ref = useRef<ComponentRef<typeof AntCarousel>>(null);
  const [active, setActive] = useState(0);
  const count = slides.length;

  if (count === 0) return null;

  return (
    <div>
      <AntCarousel ref={ref} dots={false} afterChange={setActive}>
        {slides}
      </AntCarousel>
      {count > 1 && (
        <div className="mt-3 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => ref.current?.prev()}
            aria-label="Previous"
            className="rounded-full border border-slate-200 p-1.5 text-foreground transition-colors hover:bg-slate-100"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => ref.current?.goTo(i)}
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
            onClick={() => ref.current?.next()}
            aria-label="Next"
            className="rounded-full border border-slate-200 p-1.5 text-foreground transition-colors hover:bg-slate-100"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

/** One name slide: "Name (country): meaning" above its image. */
function NameSlide({ name }: { name: TyphoonName }) {
  return (
    <div className="px-2">
      <p className="text-sm mb-3 text-center leading-relaxed">
        <span className={`font-bold ${getNameStatusColorClass(name)}`}>{name.name}</span>
        {name.country && <span className="text-foreground"> ({name.language}): </span>}
        {name.meaning && <span className="text-foreground italic">{name.meaning}</span>}
      </p>
      {name.image && (
        <div className="relative mx-auto aspect-4/3 w-full max-w-sm overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
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
  );
}

function StormSlide({ storm }: { storm: Storm }) {
  const accent = TEXT_COLOR_WHITE_BACKGROUND[storm.intensity];
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
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="p-3">
        <div className="relative aspect-4/3 w-full overflow-hidden rounded-md bg-slate-50">
          {hasMap && (
            <ImageWithLoader
              src={storm.map}
              alt={`${storm.name} ${storm.year} track`}
              fill
              className="object-contain"
              unoptimized
            />
          )}
        </div>
        <div className="mt-2 space-y-0.5">
          <div className="text-sm font-bold" style={{ color: accent }}>
            {label}
          </div>
          <div className="flex items-center gap-1 text-sm text-foreground">
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
    <div className="flex items-center gap-3">
      {isInternal && country && <CountryFlag country={country} className="h-6 w-9" />}
      <span className="text-2xl font-bold" style={{ color: titleColor }}>
        {positionTitle}
      </span>
    </div>
  );

  const stormsPanel = (
    <div>
      {storms.length > 0 && (
        <div className="mb-4 flex items-baseline justify-between gap-2">
          <span className="text-lg font-bold text-foreground">All Storms ({storms.length})</span>
          <span className="text-sm text-foreground">
            Overall Avg:{" "}
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
        </div>
      )}
      {storms.length === 0 ? (
        <p className="py-4 text-center text-foreground">No storms recorded at this position.</p>
      ) : (
        <div className="space-y-6">
          {sortNamesByFirstYear(Object.entries(getGroupedStorms(storms, "name"))).map(
            ([name, group]) => {
              const sorted = [...group].sort((a, b) => a.year - b.year);
              const average = calculateAverage(sorted);
              const groupColor = TEXT_COLOR_WHITE_BACKGROUND[getIntensityFromNumber(average)];
              const groupAccent = BACKGROUND_BADGE[getIntensityFromNumber(average)];
              return (
                <div key={name}>
                  <div
                    className="mb-2 flex items-center justify-between gap-2 rounded-md bg-slate-50 py-2 pr-4 pl-3"
                    style={{ borderLeftWidth: 4, borderLeftColor: groupAccent }}
                  >
                    <span className="font-semibold text-foreground">{name}</span>
                    <span className="flex items-center gap-4 text-sm text-foreground">
                      <span>
                        Count:{" "}
                        <span className="font-semibold text-foreground">{sorted.length}</span>
                      </span>
                      <span>
                        Avg:{" "}
                        <span className="font-bold" style={{ color: groupColor }}>
                          {average.toFixed(2)}
                        </span>
                      </span>
                    </span>
                  </div>
                  <Carousel
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
  } else {
    const tabs: Tab<TabType>[] = [
      {
        key: "names",
        label: `Names (${names.length})`,
        content: (
          <div>
            {names.length === 0 ? (
              <p className="py-4 text-center text-foreground">
                No names have been assigned to this slot.
              </p>
            ) : (
              <Carousel
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
  }

  return (
    <DefModal onClose={() => router.back()} title={title}>
      {content}
    </DefModal>
  );
}
