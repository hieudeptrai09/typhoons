import CountryFlag from "@/lib/components/CountryFlag";
import EmptyResults from "@/lib/components/EmptyResults";
import FrownNotFound from "@/lib/components/FrownNotFound";
import ImageWithLoader from "@/lib/components/ImageWithLoader";
import NameStatusIcon from "@/lib/components/NameStatusIcon";
import StormCard from "@/lib/components/StormCard";
import type { RetiredName, SearchDetail, Storm, TyphoonName } from "@/lib/types";
import {
  getNameStatusBgClass,
  getNameStatusColorClass,
  isExternalPosition,
} from "@/lib/utils/colors";

interface InfoPageContentProps {
  detail: SearchDetail | null;
  name: string;
}

function StatusBadge({
  isInPosition,
  isRetired,
  isLanguageProblem,
}: {
  isInPosition: boolean;
  isRetired: boolean;
  isLanguageProblem: number;
}) {
  const status = { isRetired, isLanguageProblem, isExternal: !isInPosition };
  const label = !isInPosition
    ? "External name"
    : isLanguageProblem === 2
      ? "Misspelling"
      : isRetired
        ? "Retired"
        : "Active";
  return (
    <span
      className={`rounded-full px-3 py-1 text-sm font-semibold ${getNameStatusBgClass(status)} ${getNameStatusColorClass(status)}`}
    >
      {label}
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
  const isInPosition = nameData ? !isExternalPosition(nameData.position) : false;
  const displayName = nameData?.name ?? name;

  const titleColorClass = nameData
    ? getNameStatusColorClass({ ...nameData, isExternal: !isInPosition })
    : "text-slate-800";
  const isRetired = nameData ? Boolean(nameData.isRetired) : false;

  if (!nameData && storms.length === 0) {
    return <EmptyResults description="No typhoon named this was found." />;
  }

  const correctSpelling = storms[0]?.correctSpelling;
  const metaCountry = nameData?.country ?? storms[0]?.country;
  const metaPosition = nameData?.position ?? storms[0]?.position;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-8">
      <div className="mb-3 flex items-center gap-3">
        <NameStatusIcon
          isRetired={isRetired}
          isLanguageProblem={nameData?.isLanguageProblem ?? 0}
          position={isInPosition ? nameData?.position : 0}
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
          isLanguageProblem={nameData?.isLanguageProblem ?? 0}
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
