import CountryFlag, { COUNTRY_NAMES } from "@/lib/components/CountryFlag";
import FrownError from "@/lib/components/FrownError";
import IndexTile from "@/lib/components/IndexTile";
import PageHeader from "@/lib/components/PageHeader";
import { getStorms } from "@/lib/db/api/getStorms";
import { getCountrySlug, getCountryStorms } from "@/lib/utils/country";
import { calculateAverage } from "@/lib/utils/storms";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Countries",
  description:
    "The 14 members of the Typhoon Committee and the storms carrying the names they contributed.",
  alternates: { canonical: "/countries/" },
};

export default async function CountriesPage() {
  const result = await getStorms();
  if (!result?.data) {
    return <FrownError />;
  }
  const storms = result.data;

  return (
    <PageHeader title="Countries">
      <ul className="mx-auto grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {COUNTRY_NAMES.map((country) => {
          const countryStorms = getCountryStorms(storms, country);
          return (
            <li key={country}>
              <IndexTile
                href={`/countries/${getCountrySlug(country)}/`}
                label={country}
                icon={<CountryFlag country={country} className="h-6 w-9 shrink-0" />}
                summary={
                  countryStorms.length > 0
                    ? { count: countryStorms.length, average: calculateAverage(countryStorms) }
                    : undefined
                }
              />
            </li>
          );
        })}
      </ul>
    </PageHeader>
  );
}
