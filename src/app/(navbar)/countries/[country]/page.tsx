import { COUNTRY_NAMES } from "@/lib/components/position/CountryFlag";
import { getPositionDetails } from "@/lib/db/queries/getPositionDetails";
import CountryPageContent from "@/lib/features/countries/components/CountryPageContent";
import {
  getCountryFromSlug,
  getCountryPositions,
  getCountrySlug,
  getCountryStorms,
} from "@/lib/utils/country";
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

interface CountryPageProps {
  params: Promise<{ country: string }>;
}

export function generateStaticParams() {
  return COUNTRY_NAMES.map((country) => ({ country: getCountrySlug(country) }));
}

export async function generateMetadata({ params }: CountryPageProps): Promise<Metadata> {
  const { country: slug } = await params;
  const country = getCountryFromSlug(decodeURIComponent(slug));

  if (country === null) {
    return {};
  }

  return {
    title: `${country} — Contributing Member`,
    description: `Storm history, average intensity and seasonal timing of the typhoon names contributed by ${country}.`,
    alternates: {
      canonical: `/countries/${getCountrySlug(country)}/`,
    },
  };
}

export default async function CountryPage({ params }: CountryPageProps) {
  const { country: slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const country = getCountryFromSlug(decodedSlug);

  if (country === null) {
    notFound();
  }

  if (getCountrySlug(country) !== decodedSlug) {
    permanentRedirect(`/countries/${getCountrySlug(country)}/`);
  }

  // Built from the member's positions, which the position pages already cache, so the page only
  // depends on those positions: an edit elsewhere in the table leaves it alone.
  const positions = await Promise.all(
    getCountryPositions(country).map((position) => getPositionDetails(position)),
  );
  const details = positions.flatMap((result) => (result?.data ? [result.data] : []));
  const storms = getCountryStorms(
    details.flatMap((detail) => detail.storms),
    country,
  ).sort((a, b) => a.year - b.year || a.position - b.position);
  const names = details.flatMap((detail) => detail.names).sort((a, b) => a.id - b.id);

  return <CountryPageContent country={country} storms={storms} names={names} />;
}
