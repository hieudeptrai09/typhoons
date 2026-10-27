import { getSeasonDetails } from "@/lib/db/queries/getSeasonDetails";
import { getStormYears } from "@/lib/db/queries/getStormYears";
import YearPageContent from "@/lib/features/years/components/YearPageContent";
import { getSeasonDebuts, getSeasonStorms, isSeasonYear } from "@/lib/utils/storms";
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

interface YearPageProps {
  params: Promise<{ year: string }>;
}

export async function generateStaticParams() {
  const result = await getStormYears();
  return (result?.data ?? []).filter(isSeasonYear).map((year) => ({ year: String(year) }));
}

export async function generateMetadata({ params }: YearPageProps): Promise<Metadata> {
  const { year } = await params;
  const yearNum = Number(year);

  if (!Number.isInteger(yearNum)) {
    return {};
  }

  return {
    title: `${yearNum} — Typhoon Season`,
    description: `Every named storm of the ${yearNum} typhoon season, with average intensity and seasonal timing.`,
    alternates: {
      canonical: `/years/${yearNum}/`,
    },
  };
}

export default async function YearPage({ params }: YearPageProps) {
  const { year } = await params;
  const yearNum = Number(year);

  if (year.trim() === "" || !Number.isInteger(yearNum)) {
    notFound();
  }

  // "02024" and "2024.0" are the same season.
  if (String(yearNum) !== year) {
    permanentRedirect(`/years/${yearNum}/`);
  }

  const [yearsResult, result] = await Promise.all([getStormYears(), getSeasonDetails(yearNum)]);
  if (!yearsResult?.data || !result?.data) {
    return (
      <YearPageContent
        year={yearNum}
        storms={null}
        years={[]}
        names={[]}
        retiredNames={[]}
        debuts={[]}
      />
    );
  }

  const years = yearsResult.data.filter(isSeasonYear);
  if (!years.includes(yearNum)) {
    notFound();
  }

  const storms = getSeasonStorms(result.data.storms, yearNum);
  // The table only looks up the meanings of names this season used. Sending the whole naming
  // list would make it most of every season's payload, which is billed per byte read.
  const seasonNames = new Set(storms.map((storm) => storm.name.toLowerCase()));

  return (
    <YearPageContent
      year={yearNum}
      storms={storms}
      years={years}
      names={result.data.names.filter((name) => seasonNames.has(name.name.toLowerCase()))}
      // lastYear is set only once a name leaves the rotation.
      retiredNames={result.data.names.filter((name) => name.lastYear === yearNum)}
      debuts={getSeasonDebuts(result.data.storms, yearNum)}
    />
  );
}
