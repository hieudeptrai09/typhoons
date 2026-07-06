"use client";

import {
  calculateAverage,
  getGroupedStorms,
  getIntensityFromNumber,
} from "@/app/(navbar)/storms/_utils/fns";
import CountryFlag from "@/lib/components/CountryFlag";
import EmptyResults from "@/lib/components/EmptyResults";
import ImageWithLoader from "@/lib/components/ImageWithLoader";
import IntensityBadge from "@/lib/components/IntensityBadge";
import Tabs, { type Tab } from "@/lib/components/Tabs";
import { INTENSITY_LABEL } from "@/lib/constants";
import type { PositionDetail, Storm, TyphoonName } from "@/lib/types";
import {
  BACKGROUND_BADGE,
  getNameStatusColor,
  TEXT_COLOR_WHITE_BACKGROUND,
} from "@/lib/utils/colors";
import { getPositionTitle } from "@/lib/utils/fns";
import { Modal, Popover } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type ReactNode } from "react";

interface PositionModalProps {
  detail: PositionDetail | null;
  position: number;
}

type TabType = "storms" | "names" | "average";

function StormsTab({ storms }: { storms: Storm[] }) {
  if (storms.length === 0) {
    return <EmptyResults description="No storms recorded at this position." />;
  }

  const nameGroups = Object.entries(getGroupedStorms(storms, "name"));

  return (
    <div className="flex flex-col gap-3">
      {nameGroups.map(([name, group]) => (
        <div key={name} className="flex flex-col gap-1.5">
          {[...group]
            .sort((a, b) => a.year - b.year)
            .map((storm, idx) => (
              <div key={idx} className="flex items-center">
                <IntensityBadge intensity={storm.intensity} />
                <span
                  className="ml-1.5"
                  style={{ color: TEXT_COLOR_WHITE_BACKGROUND[storm.intensity] }}
                >
                  {storm.name} {storm.year}
                </span>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}

function NamesTab({ names, storms }: { names: TyphoonName[]; storms: Storm[] }) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (names.length === 0) {
    return <EmptyResults description="No names have been assigned to this position." />;
  }

  const stormsByName: Record<string, Storm[]> = {};
  storms.forEach((storm) => {
    if (!stormsByName[storm.name]) stormsByName[storm.name] = [];
    stormsByName[storm.name].push(storm);
  });

  const sortedNames = [...names].sort((a, b) => {
    const aStorms = stormsByName[a.name] || [];
    const bStorms = stormsByName[b.name] || [];
    const aFirst = aStorms.length > 0 ? Math.min(...aStorms.map((s) => s.year)) : Infinity;
    const bFirst = bStorms.length > 0 ? Math.min(...bStorms.map((s) => s.year)) : Infinity;
    return aFirst - bFirst;
  });

  return (
    <div className="space-y-1">
      {sortedNames.map((name) => {
        const nameStorms = stormsByName[name.name] || [];
        const count = nameStorms.length;
        const years = nameStorms.map((s) => s.year).join(", ");
        const isExpanded = expandedId === name.id;
        const hasExpandable = !!name.image;

        return (
          <div key={name.id} className="overflow-hidden rounded-lg">
            <button
              type="button"
              disabled={!hasExpandable}
              onClick={() => hasExpandable && setExpandedId(isExpanded ? null : name.id)}
              aria-expanded={hasExpandable ? isExpanded : undefined}
              className={`w-full rounded-lg border-0 bg-transparent px-3 py-2 text-left transition-colors ${
                isExpanded ? "rounded-b-none bg-sky-50" : "hover:bg-gray-50"
              } ${hasExpandable ? "cursor-pointer" : "cursor-default"}`}
            >
              <div className="flex w-full items-baseline gap-2">
                <span className="min-w-8 shrink-0 text-sm font-bold text-gray-400">
                  {count > 0 ? `x${count}` : "x0"}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="whitespace-pre-line">
                    <span className="font-semibold" style={{ color: getNameStatusColor(name) }}>
                      {name.name}
                    </span>
                    {count > 0 && <span className="ml-1 text-sm text-gray-500">({years})</span>}
                  </div>
                  {name.meaning && (
                    <p className="mt-0.5 text-xs leading-relaxed whitespace-pre-line text-teal-700 italic">
                      {name.meaning}
                    </p>
                  )}
                  {name.description && (
                    <p className="mt-0.5 text-xs leading-relaxed whitespace-pre-line text-gray-600">
                      {name.description}
                    </p>
                  )}
                </div>
              </div>
            </button>

            {isExpanded && name.image && (
              <div className="rounded-b-lg border-t border-sky-100 bg-sky-50 px-4 py-3">
                <div
                  className="relative mx-auto overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
                  style={{ width: 160, aspectRatio: "4/3" }}
                >
                  <ImageWithLoader
                    src={name.image}
                    alt={name.name}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function AverageTab({ storms }: { storms: Storm[] }) {
  if (storms.length === 0) {
    return <EmptyResults description="No storms recorded at this position." />;
  }

  const average = calculateAverage(storms);
  const nameAverages = getGroupedStorms(storms, "name");
  const nameData = Object.entries(nameAverages).map(([name, nameStorms]) => {
    const sortedStorms = [...nameStorms].sort((a, b) => a.year - b.year);
    return {
      name,
      average: calculateAverage(sortedStorms),
      count: sortedStorms.length,
      storms: sortedStorms,
    };
  });

  return (
    <div className="space-y-3">
      <div>
        <span id="position-avg-label" className="text-gray-500">
          Overall Average Intensity:{" "}
        </span>
        <span
          className="text-lg font-bold"
          aria-describedby="position-avg-label"
          style={{ color: TEXT_COLOR_WHITE_BACKGROUND[getIntensityFromNumber(average)] }}
        >
          {average.toFixed(2)}
        </span>
      </div>
      <div>
        <div className="mb-2 text-gray-500">Storm names at this position:</div>
        <div className="space-y-2">
          {nameData.map((data, idx) => {
            const intensityLabel = getIntensityFromNumber(data.average);
            const bgColor = BACKGROUND_BADGE[intensityLabel];

            return (
              <Popover
                key={data.name}
                styles={{ container: { backgroundColor: "#f3f4f6" } }}
                content={
                  <div className="flex flex-col gap-1.5">
                    {data.storms.map((storm) => (
                      <div key={storm.year} className="text-sm text-gray-600">
                        {INTENSITY_LABEL[storm.intensity]}{" "}
                        <span
                          className="font-semibold"
                          style={{ color: TEXT_COLOR_WHITE_BACKGROUND[storm.intensity] }}
                        >
                          {data.name}
                        </span>{" "}
                        {storm.year}
                      </div>
                    ))}
                  </div>
                }
                trigger={["hover", "click"]}
                placement="bottom"
              >
                <div
                  className="flex cursor-pointer items-center justify-between rounded-md bg-white px-3 py-2 transition-colors hover:bg-gray-100"
                  style={{ borderLeft: `4px solid ${bgColor}` }}
                >
                  <span
                    className="font-semibold text-gray-700"
                    aria-describedby={`position-avg-stats-${idx}`}
                  >
                    {data.name}
                  </span>
                  <div
                    id={`position-avg-stats-${idx}`}
                    className="flex gap-3 text-sm text-gray-500"
                  >
                    <span>
                      Count: <span className="font-semibold text-gray-700">{data.count}</span>
                    </span>
                    <span>
                      Avg:{" "}
                      <span
                        className="font-semibold"
                        style={{ color: TEXT_COLOR_WHITE_BACKGROUND[intensityLabel] }}
                      >
                        {data.average.toFixed(2)}
                      </span>
                    </span>
                  </div>
                </div>
              </Popover>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function PositionModal({ detail, position }: PositionModalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const origin = searchParams.get("origin");
  const namesOnly = origin === "names";
  const stormsOnly = origin === "storms";
  const averageOnly = origin === "average";

  const [activeTab, setActiveTab] = useState<TabType>(
    origin === "names" || origin === "average" ? (origin as TabType) : "storms",
  );

  const positionTitle = getPositionTitle(position);
  const names = detail?.names ?? [];
  const storms = detail?.storms ?? [];

  if (!detail || (names.length === 0 && storms.length === 0)) {
    return (
      <Modal open onCancel={() => router.back()} footer={null} width={560} centered destroyOnHidden>
        <EmptyResults description="No data was found for this position." />
      </Modal>
    );
  }

  const avgIntensityColor =
    storms.length > 0
      ? TEXT_COLOR_WHITE_BACKGROUND[getIntensityFromNumber(calculateAverage(storms))]
      : "#64748b";

  const isSingleLens = namesOnly || stormsOnly || averageOnly;

  let body: ReactNode;
  if (namesOnly) {
    body = <NamesTab names={names} storms={storms} />;
  } else if (stormsOnly) {
    body = <StormsTab storms={storms} />;
  } else if (averageOnly) {
    body = <AverageTab storms={storms} />;
  } else {
    const tabs: Tab<TabType>[] = [
      {
        key: "names",
        label: `Names (${names.length})`,
        content: <NamesTab names={names} storms={storms} />,
      },
      { key: "average", label: "Average", content: <AverageTab storms={storms} /> },
    ];
    body = (
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        ariaLabel="Position details tabs"
        idPrefix="position-modal-tab"
      />
    );
  }

  return (
    <Modal
      open
      onCancel={() => router.back()}
      footer={null}
      width={560}
      centered
      destroyOnHidden
      styles={{
        header: { borderBottom: "1px solid #9ca3af", paddingBottom: "12px" },
        body: {
          height: isSingleLens ? "" : "70vh",
          maxHeight: "70vh",
          overflowY: "auto",
        },
      }}
      title={
        <div className="flex items-baseline gap-2">
          {detail.country && <CountryFlag country={detail.country} className="h-5 w-8" />}
          <span className="text-2xl font-bold" style={{ color: avgIntensityColor }}>
            {positionTitle}
          </span>
          {detail.country && (
            <span className="text-base font-normal text-gray-500">{detail.country}</span>
          )}
        </div>
      }
    >
      <div className="pt-4 pb-px">{body}</div>
    </Modal>
  );
}
