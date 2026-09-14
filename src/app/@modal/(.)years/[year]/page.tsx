import { getStorms } from "@/lib/db/api/getStorms";
import { getSeasonStorms, isSeasonYear } from "@/lib/utils/storms";
import { notFound } from "next/navigation";
import YearModal from "./YearModal";

interface YearModalPageProps {
  params: Promise<{ year: string }>;
}

export default async function YearModalPage({ params }: YearModalPageProps) {
  const { year } = await params;
  const yearNum = Number(year);

  if (year.trim() === "" || !Number.isInteger(yearNum) || !isSeasonYear(yearNum)) {
    notFound();
  }

  const result = await getStorms();
  if (!result?.data) {
    return <YearModal year={yearNum} storms={null} />;
  }

  const storms = getSeasonStorms(result.data, yearNum);
  if (storms.length === 0) {
    notFound();
  }

  return <YearModal year={yearNum} storms={storms} />;
}
