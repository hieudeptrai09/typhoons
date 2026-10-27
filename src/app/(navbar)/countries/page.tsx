import CountryFlag, { COUNTRY_NAMES } from "@/lib/components/position/CountryFlag";
import FrownError from "@/lib/components/ui/FrownError";
import IndexTile from "@/lib/components/ui/IndexTile";
import PageHeader from "@/lib/components/ui/PageHeader";
import { getAllStormHistory } from "@/lib/db/queries/getStormHistory";
import { getCountryPositions, getCountrySlug } from "@/lib/utils/country";
import { getGroupCounts } from "@/lib/utils/storms";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Countries",
  description:
    "The 14 members of the Typhoon Committee and the storms carrying the names they contributed.",
  alternates: { canonical: "/countries/" },
};

export default async function CountriesPage() {
  const result = await getAllStormHistory();
  if (!result?.data) {
    return <FrownError />;
  }
  // A member's storms are the ones on its grid column; agency positions belong to no member.
  const counts = getGroupCounts(result.data, "position");
  const countryCount = (country: string) =>
    getCountryPositions(country).reduce((sum, position) => sum + (counts[position] ?? 0), 0);

  return (
    <PageHeader title="Countries">
      <ul className="mx-auto grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {COUNTRY_NAMES.map((country) => (
          <li key={country}>
            <IndexTile
              href={`/countries/${getCountrySlug(country)}/`}
              label={country}
              icon={<CountryFlag country={country} className="h-6 w-9 shrink-0" />}
              count={countryCount(country)}
            />
          </li>
        ))}
      </ul>
    </PageHeader>
  );
}
