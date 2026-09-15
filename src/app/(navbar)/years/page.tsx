import FrownError from "@/lib/components/FrownError";
import IndexTile from "@/lib/components/IndexTile";
import PageHeader from "@/lib/components/PageHeader";
import { getStorms } from "@/lib/db/api/getStorms";
import { getGroupCounts, getSeasonYears } from "@/lib/utils/storms";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Seasons",
  description: "Every typhoon season on record, with its storm count.",
  alternates: { canonical: "/years/" },
};

export default async function YearsPage() {
  const result = await getStorms();
  if (!result?.data) {
    return <FrownError />;
  }

  const counts = getGroupCounts(result.data, "year");
  const decades = new Map<number, number[]>();
  getSeasonYears(result.data).forEach((year) => {
    const decade = Math.floor(year / 10) * 10;
    decades.set(decade, [...(decades.get(decade) ?? []), year]);
  });

  return (
    <PageHeader title="Seasons">
      <div className="mx-auto max-w-5xl space-y-6">
        {[...decades.entries()].map(([decade, years]) => (
          <section key={decade} aria-labelledby={`decade-${decade}`}>
            <h2 id={`decade-${decade}`} className="mb-2 text-lg font-bold text-foreground">
              {decade}s
            </h2>
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
              {years.map((year) => (
                <li key={year}>
                  <IndexTile
                    href={`/years/${year}/`}
                    label={<span className="tabular-nums">{year}</span>}
                    count={counts[year]}
                  />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </PageHeader>
  );
}
