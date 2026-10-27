import FrownError from "@/lib/components/ui/FrownError";
import IndexTile from "@/lib/components/ui/IndexTile";
import PageHeader from "@/lib/components/ui/PageHeader";
import { getAllStormHistory } from "@/lib/db/queries/getStormHistory";
import PositionIndexGrid from "@/lib/features/positions/components/PositionIndexGrid";
import { getPositionSlug, SPECIAL_POSITIONS } from "@/lib/utils/position";
import { getGroupCounts } from "@/lib/utils/storms";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Naming Positions",
  description:
    "All 140 slots of the typhoon naming table, plus the neighbouring-basin agencies, with storm counts.",
  alternates: { canonical: "/positions/" },
};

export default async function PositionsPage() {
  const result = await getAllStormHistory();
  if (!result?.data) {
    return <FrownError />;
  }

  const counts = getGroupCounts(result.data, "position");

  return (
    <PageHeader title="Naming Positions">
      <div className="mx-auto max-w-7xl space-y-6">
        <PositionIndexGrid counts={counts} />

        <section aria-labelledby="agency-positions">
          <h2 id="agency-positions" className="mb-2 text-lg font-bold text-foreground">
            Neighbouring basins
          </h2>
          <ul className="grid gap-3 sm:grid-cols-3">
            {SPECIAL_POSITIONS.map(({ id, label }) => (
              <li key={id}>
                <IndexTile
                  href={`/positions/${getPositionSlug(id)}/`}
                  label={label}
                  count={counts[id]}
                />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </PageHeader>
  );
}
