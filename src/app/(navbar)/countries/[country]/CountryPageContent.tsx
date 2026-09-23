import CountryFlag, { COUNTRY_NAMES } from "@/lib/components/CountryFlag";
import FrownError from "@/lib/components/FrownError";
import PagePagination from "@/lib/components/PagePagination";
import StatisticsSection from "@/lib/components/StatisticsSection";
import StormNameTable from "@/lib/components/StormNameTable";
import type { RetiredName, Storm } from "@/lib/types";
import { TEXT_COLOR_WHITE_BACKGROUND } from "@/lib/utils/colors";
import { getCountrySlug } from "@/lib/utils/country";
import { calculateAverage, getIntensityFromNumber } from "@/lib/utils/storms";

interface CountryPageContentProps {
  country: string;
  storms: Storm[] | null;
  names: RetiredName[] | null;
}

function CountryPagination({ country }: { country: string }) {
  const index = COUNTRY_NAMES.indexOf(country);
  const isFirst = index === 0;
  const isLast = index === COUNTRY_NAMES.length - 1;
  const prevCountry = COUNTRY_NAMES[isFirst ? COUNTRY_NAMES.length - 1 : index - 1];
  const nextCountry = COUNTRY_NAMES[isLast ? 0 : index + 1];

  return (
    <PagePagination
      ariaLabel="Country pagination"
      prev={{
        href: `/countries/${getCountrySlug(prevCountry)}`,
        label: prevCountry,
        isWrap: isFirst,
      }}
      next={{
        href: `/countries/${getCountrySlug(nextCountry)}`,
        label: nextCountry,
        isWrap: isLast,
      }}
      current={`${index + 1} / ${COUNTRY_NAMES.length}`}
    />
  );
}

function StormsSection({ storms, names }: { storms: Storm[]; names: RetiredName[] }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-bold text-foreground">All Storms ({storms.length})</h2>
      {storms.length === 0 ? (
        <p className="py-4 text-center text-foreground">
          No storms recorded for this country&apos;s names.
        </p>
      ) : (
        // Every row is this country, so the flag column would repeat the page title.
        <StormNameTable
          storms={storms}
          names={names}
          tableKey="country-storms"
          showCountry={false}
        />
      )}
    </section>
  );
}

export default function CountryPageContent({ country, storms, names }: CountryPageContentProps) {
  if (!storms || !names) {
    return <FrownError />;
  }

  const titleColor =
    storms.length > 0
      ? TEXT_COLOR_WHITE_BACKGROUND[getIntensityFromNumber(calculateAverage(storms))]
      : "#64748b";

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-8">
      <div className="mb-8 flex items-center gap-3">
        <CountryFlag country={country} className="h-6 w-9" />
        <h1 className="text-3xl font-bold" style={{ color: titleColor }}>
          {country}
        </h1>
      </div>

      <div className="space-y-6">
        <StatisticsSection storms={storms} showRecurrence={false} />
        <StormsSection storms={storms} names={names} />
      </div>

      <CountryPagination country={country} />
    </div>
  );
}
