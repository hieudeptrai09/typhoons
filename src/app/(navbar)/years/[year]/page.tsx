import { getStorms } from "@/lib/db/api/getStorms";
import { getSeasonStorms, getSeasonYears } from "@/lib/utils/storms";
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import YearPageContent from "./YearPageContent";

interface YearPageProps {
  params: Promise<{ year: string }>;
}

export async function generateStaticParams() {
  const result = await getStorms();
  return getSeasonYears(result?.data ?? []).map((year) => ({ year: String(year) }));
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

  const result = await getStorms();
  if (!result?.data) {
    return <YearPageContent year={yearNum} storms={null} years={[]} />;
  }

  const years = getSeasonYears(result.data);
  if (!years.includes(yearNum)) {
    notFound();
  }

  const storms = getSeasonStorms(result.data, yearNum);

  return <YearPageContent year={yearNum} storms={storms} years={years} />;
}
