import { calculateAverage, getIntensityFromNumber } from "@/app/(navbar)/storms/_utils/fns";
import CountryFlag from "@/lib/components/CountryFlag";
import EmptyResults from "@/lib/components/EmptyResults";
import FrownError from "@/lib/components/FrownError";
import { PositionNamesList, PositionStormsList } from "@/lib/components/PositionContent";
import type { PositionDetail, Storm, TyphoonName } from "@/lib/types";
import { TEXT_COLOR_WHITE_BACKGROUND } from "@/lib/utils/colors";
import { getPositionSlug, getPositionTitle } from "@/lib/utils/fns";
import { ChevronLeft, ChevronRight, SearchX } from "lucide-react";
import Link from "next/link";

interface PositionPageContentProps {
  detail: PositionDetail | null;
  position: number;
  isError?: boolean;
}

const TOTAL_POSITIONS = 143;

function PositionPagination({ position }: { position: number }) {
  const isFirst = position === 1;
  const isLast = position === TOTAL_POSITIONS;
  const prevPosition = isFirst ? TOTAL_POSITIONS : position - 1;
  const nextPosition = isLast ? 1 : position + 1;

  const linkClass = (isWrap: boolean) =>
    `flex items-center gap-1 rounded-lg border px-4 py-2 text-sm font-medium text-white transition-colors ${
      isWrap
        ? "border-gray-500 bg-gray-500 hover:border-slate-600 hover:bg-slate-600"
        : "border-sky-600 bg-sky-600 hover:border-sky-700 hover:bg-sky-700"
    }`;

  return (
    <nav
      className="mt-6 flex items-center justify-between border-t border-slate-200 pt-6"
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

function NamesSection({ names, storms }: { names: TyphoonName[]; storms: Storm[] }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-bold text-muted">Names Used ({names.length})</h2>
      <PositionNamesList names={names} storms={storms} />
    </section>
  );
}

function StormsSection({ storms }: { storms: Storm[] }) {
  const overallAverage = storms.length > 0 ? calculateAverage(storms) : 0;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-muted">All Storms ({storms.length})</h2>
        {storms.length > 0 && (
          <div>
            <span className="text-sm font-medium text-muted">Overall Avg: </span>
            <span
              className="text-lg font-bold"
              style={{ color: TEXT_COLOR_WHITE_BACKGROUND[getIntensityFromNumber(overallAverage)] }}
            >
              {overallAverage.toFixed(2)}
            </span>
          </div>
        )}
      </div>
      <PositionStormsList storms={storms} />
    </section>
  );
}

export default function PositionPageContent({
  detail,
  position,
  isError = false,
}: PositionPageContentProps) {
  if (isError) {
    return <FrownError />;
  }
  if (!detail || (detail.names.length === 0 && detail.storms.length === 0)) {
    return <EmptyResults icon={SearchX} description="No data recorded for this position yet." />;
  }

  const { country, names, storms } = detail;
  const positionTitle = getPositionTitle(position);
  const titleColor =
    storms.length > 0
      ? TEXT_COLOR_WHITE_BACKGROUND[getIntensityFromNumber(calculateAverage(storms))]
      : "#64748b";

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-8">
      <div className="mb-8 flex items-baseline gap-3">
        {position <= 140 && <CountryFlag country={country} className="h-6 w-9" />}
        <h1 className="text-3xl font-bold" style={{ color: titleColor }}>
          {positionTitle}
        </h1>
        {position <= 140 && <span className="text-base text-muted">{country}</span>}
      </div>

      <div className="space-y-6">
        {position <= 140 && <NamesSection names={names} storms={storms} />}
        <StormsSection storms={storms} />
      </div>

      <PositionPagination position={position} />
    </div>
  );
}
