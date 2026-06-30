import { Calendar } from "lucide-react";
import {
  BACKGROUND_BADGE,
  TEXT_COLOR_BADGE,
  getNameStatusColorClass,
} from "../../../../components/colors";
import CountryFlag from "../../../../components/components/CountryFlag";
import EmptyResults from "../../../../components/components/EmptyResults";
import FrownNotFound from "../../../../components/components/FrownNotFound";
import ImageWithLoader from "../../../../components/components/ImageWithLoader";
import NameStatusIcon from "../../../../components/components/NameStatusIcon";
import { INTENSITY_LABEL } from "../../../../constants";
import { formatStormDateRange } from "../../../../containers/utils/fns";
import type { SearchDetail, Storm, TyphoonName, RetiredName } from "../../../../types";

interface InfoPageContentProps {
  detail: SearchDetail | null;
  name: string;
}

function StatusBadge({
  isInPosition,
  isRetired,
  isMisspelling,
}: {
  isInPosition: boolean;
  isRetired: boolean;
  isMisspelling: boolean;
}) {
  if (!isInPosition) {
    return (
      <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-500">
        External name
      </span>
    );
  }
  if (isMisspelling) {
    return (
      <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-600">
        Misspelling
      </span>
    );
  }
  if (isRetired) {
    return (
      <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-600">
        Retired
      </span>
    );
  }
  return (
    <span className="rounded-full bg-teal-100 px-3 py-1 text-sm font-semibold text-teal-600">
      Active
    </span>
  );
}

function NameDetailsSection({
  name,
  correctSpelling,
}: {
  name: TyphoonName | RetiredName;
  correctSpelling?: string;
}) {
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
            <div className="text-sm font-medium text-slate-500">Language</div>
            <div className="mt-1 text-base text-slate-700">{name.language}</div>
          </div>

          {(correctSpelling || ("replacementName" in name && name.replacementName)) && (
            <div className="border-t border-slate-200 pt-3">
              <div className="text-sm font-medium text-slate-500">
                {correctSpelling ? "Correct spelling" : "Replaced by"}
              </div>
              <div className="mt-1 text-base font-semibold text-teal-600">
                {correctSpelling || ("replacementName" in name ? name.replacementName : "")}
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
  const dateRange = formatStormDateRange(
    storm.year,
    storm.monthStart,
    storm.dateStart,
    storm.monthEnd,
    storm.dateEnd,
    storm.isFromPrevYear,
  );

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex h-20 flex-col justify-center px-4" style={{ backgroundColor: bgColor }}>
        <span className="text-sm leading-tight font-bold" style={{ color: textColor }}>
          {label} {storm.name}
        </span>
        {dateRange && (
          <div className="mt-1 flex items-center gap-1.5">
            <Calendar size={12} style={{ color: textColor }} />
            <span className="text-xs font-medium" style={{ color: textColor }}>
              {dateRange}
            </span>
          </div>
        )}
      </div>
      <div className="relative h-44 w-full bg-slate-50">
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

function StormsSection({ storms }: { storms: Storm[] }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-bold text-slate-800">All Storms ({storms.length})</h2>

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

export default function InfoPageContent({ detail, name }: InfoPageContentProps) {
  if (!detail) {
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
    return <EmptyResults description="No typhoon named this was found." />;
  }

  const correctSpelling = storms[0]?.correctSpelling;
  const isMisspelling = nameData?.isLanguageProblem === 2;
  const metaCountry = nameData?.country ?? storms[0]?.country;
  const metaPosition = nameData?.position ?? storms[0]?.position;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-8">
      <div className="mb-3 flex items-center gap-3">
        <NameStatusIcon
          isRetired={isRetired}
          isLanguageProblem={nameData?.isLanguageProblem ?? 0}
          position={nameData?.position}
          size={28}
        />
        <h1 className={`text-3xl font-bold capitalize ${titleColorClass}`}>
          {displayName.toLowerCase()}
        </h1>
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-3">
        {metaCountry && (
          <div className="flex items-center gap-2">
            {isInPosition && <CountryFlag country={metaCountry} className="h-5 w-8" />}
            <span className="text-base font-medium text-slate-700">{metaCountry}</span>
          </div>
        )}
        {isInPosition && metaPosition != null && (
          <span className="text-base text-slate-500">· #{metaPosition}</span>
        )}
        <StatusBadge
          isInPosition={isInPosition}
          isRetired={isRetired}
          isMisspelling={isMisspelling}
        />
      </div>

      <div className="space-y-6">
        {isInPosition && nameData && (
          <NameDetailsSection name={nameData} correctSpelling={correctSpelling} />
        )}
        <StormsSection storms={storms} />
      </div>
    </div>
  );
}
