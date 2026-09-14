import { getStorms } from "@/lib/db/api/getStorms";
import { getCountryFromSlug, getCountryStorms } from "@/lib/utils/country";
import { notFound } from "next/navigation";
import CountryModal from "./CountryModal";

interface CountryModalPageProps {
  params: Promise<{ country: string }>;
}

export default async function CountryModalPage({ params }: CountryModalPageProps) {
  const { country: slug } = await params;
  const country = getCountryFromSlug(decodeURIComponent(slug));

  if (country === null) {
    notFound();
  }

  const result = await getStorms();
  const storms = result?.data ? getCountryStorms(result.data, country) : null;

  return <CountryModal country={country} storms={storms} />;
}
