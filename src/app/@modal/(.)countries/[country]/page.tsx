import { getStorms } from "@/lib/db/api/getStorms";
import { getTyphoonNames } from "@/lib/db/api/getTyphoonNames";
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

  const [stormsResult, namesResult] = await Promise.all([getStorms(), getTyphoonNames()]);
  const storms = stormsResult?.data ? getCountryStorms(stormsResult.data, country) : null;
  const names = namesResult?.data?.filter((name) => name.country === country) ?? null;

  return <CountryModal country={country} storms={storms} names={names} />;
}
