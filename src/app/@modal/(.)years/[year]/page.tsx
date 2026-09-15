import { getStorms } from "@/lib/db/api/getStorms";
import { getTyphoonNames } from "@/lib/db/api/getTyphoonNames";
import { getSeasonDebuts, getSeasonStorms, isSeasonYear } from "@/lib/utils/storms";
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

  const [result, namesResult] = await Promise.all([getStorms(), getTyphoonNames()]);
  if (!result?.data || !namesResult?.data) {
    return <YearModal year={yearNum} storms={null} retiredNames={[]} debuts={[]} />;
  }

  const storms = getSeasonStorms(result.data, yearNum);
  if (storms.length === 0) {
    notFound();
  }

  return (
    <YearModal
      year={yearNum}
      storms={storms}
      // lastYear is set only once a name leaves the rotation.
      retiredNames={namesResult.data.filter((name) => name.lastYear === yearNum)}
      debuts={getSeasonDebuts(result.data, yearNum)}
    />
  );
}
