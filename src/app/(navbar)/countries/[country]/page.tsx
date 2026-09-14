import { COUNTRY_NAMES } from "@/lib/components/CountryFlag";
import { getStorms } from "@/lib/db/api/getStorms";
import { getCountryFromSlug, getCountrySlug, getCountryStorms } from "@/lib/utils/country";
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import CountryPageContent from "./CountryPageContent";

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

  const result = await getStorms();
  const storms = result?.data ? getCountryStorms(result.data, country) : null;

  return <CountryPageContent country={country} storms={storms} />;
}
