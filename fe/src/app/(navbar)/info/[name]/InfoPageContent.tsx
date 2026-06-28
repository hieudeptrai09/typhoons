"use client";

import { CircleHelp, Flame, Skull } from "lucide-react";
import {
  BACKGROUND_BADGE,
  TEXT_COLOR_BADGE,
  getNameStatusColorClass,
} from "../../../../components/colors";
import CountryFlag from "../../../../components/components/CountryFlag";
import FrownNotFound from "../../../../components/components/FrownNotFound";
import ImageWithLoader from "../../../../components/components/ImageWithLoader";
import TyphoonSpinner from "../../../../components/components/TyphoonSpinner";
import { INTENSITY_LABEL } from "../../../../constants";
import { useFetchData } from "../../../../containers/hooks/useFetchData";
import type { SearchDetail, Storm, TyphoonName, RetiredName } from "../../../../types";

interface InfoPageContentProps {
  name: string;
}

function NameDetailsSection({ name }: { name: TyphoonName | RetiredName }) {
  const hasImage = !!name.image;
  const hasDescription = !!name.description;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-bold text-slate-800">Name Details</h2>
      <div className={`flex gap-6 ${hasImage ? "flex-col sm:flex-row" : "flex-col"}`}>
        <div className="flex-1 space-y-4">
          <div>
            <div className="text-sm font-medium text-slate-500">Meaning</div>
            <p className="mt-1 text-base leading-relaxed font-semibold text-teal-600 italic">
              {name.meaning}
            </p>
          </div>

          <div className="border-t border-slate-200 pt-3">
            <div className="mb-2 text-sm font-medium text-slate-500">Origin</div>
            <div className="flex items-center gap-3">
              <CountryFlag country={name.country} className="h-8 w-12" />
              <div className="text-base font-semibold text-slate-800">{name.country}</div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-3">
            <div className="text-sm font-medium text-slate-500">Language</div>
            <div className="mt-1 text-base text-slate-700">{name.language}</div>
          </div>

          {"replacementName" in name && name.replacementName && (
            <div className="border-t border-slate-200 pt-3">
              <div className="text-sm font-medium text-slate-500">Replaced by</div>
              <div className="mt-1 text-base font-semibold text-teal-600">
                {name.replacementName}
              </div>
            </div>
          )}

          {!hasImage && hasDescription && (
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
              <div className="mb-2 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                Note
              </div>
              <p className="text-sm leading-relaxed text-slate-700">{name.description}</p>
            </div>
          )}
        </div>

        {name.image && (
          <div className="min-w-0 flex-1">
            <div
              className="relative overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
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
            {hasDescription && (
              <p className="mt-3 text-center text-xs leading-relaxed text-slate-600 italic">
                {name.description}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function StormCard({ storm }: { storm: Storm }) {
  const bgColor = BACKGROUND_BADGE[storm.intensity];
  const textColor = TEXT_COLOR_BADGE[storm.intensity];
  const label = INTENSITY_LABEL[storm.intensity];
  const hasMap = storm.map && storm.map.trim() !== "";

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex h-16 items-center gap-3 px-4" style={{ backgroundColor: bgColor }}>
        <span className="text-sm leading-tight font-bold" style={{ color: textColor }}>
          {label} {storm.name} ({storm.year})
        </span>
      </div>
      <div className="relative h-48 w-full bg-slate-50">
        {hasMap ? (
          <ImageWithLoader
            src={storm.map}
            alt={`${storm.name} ${storm.year} track`}
            fill
            className="object-contain"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-slate-400">
            No track map
          </div>
        )}
      </div>
    </div>
  );
}

function StormsSection({ storms }: { name: string; storms: Storm[] }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800">All Storms ({storms.length})</h2>
        {storms.length > 0 && (
          <div className="flex items-center gap-2">
            <CountryFlag country={storms[0].country} className="h-5 w-8" />
            <span className="text-sm text-slate-600">Position {storms[0].position}</span>
          </div>
        )}
      </div>

      {storms[0]?.correctSpelling && (
        <div className="mb-4 text-sm text-slate-600">
          <span className="font-semibold">Correct spelling:</span> {storms[0].correctSpelling}
        </div>
      )}

      {storms.length === 0 ? (
        <p className="py-4 text-center text-gray-500">No storms found for this name.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {storms.map((storm, idx) => (
            <StormCard key={idx} storm={storm} />
          ))}
        </div>
      )}
    </section>
  );
}

export default function InfoPageContent({ name }: InfoPageContentProps) {
  const {
    data: detail,
    loading,
    error,
  } = useFetchData<SearchDetail>(`/search?name=${encodeURIComponent(name)}`);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <TyphoonSpinner size="large" />
      </div>
    );
  }

  if (error || !detail) {
    return <FrownNotFound />;
  }

  const nameData = detail.name ?? null;
  const storms = detail.storms ?? [];
  const isInPosition = nameData ? nameData.position >= 1 && nameData.position <= 140 : false;
  const displayName = nameData?.name ?? name;

  const titleColorClass = !isInPosition
    ? "text-slate-500"
    : nameData
      ? getNameStatusColorClass(nameData)
      : "text-slate-800";
  const isRetired = nameData ? Boolean(nameData.isRetired) : false;

  if (!nameData && storms.length === 0) {
    return <FrownNotFound />;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-8">
      <div className="mb-8 flex items-center gap-3">
        {!isInPosition ? (
          <CircleHelp className={titleColorClass} size={28} />
        ) : isRetired ? (
          <Skull className={titleColorClass} size={28} />
        ) : (
          <Flame className={titleColorClass} size={28} />
        )}
        <h1 className={`text-3xl font-bold capitalize ${titleColorClass}`}>
          {displayName.toLowerCase()}
        </h1>
      </div>

      <div className="space-y-6">
        {isInPosition && nameData && <NameDetailsSection name={nameData} />}
        <StormsSection name={displayName} storms={storms} />
      </div>
    </div>
  );
}
