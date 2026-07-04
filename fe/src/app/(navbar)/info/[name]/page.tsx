import type { SearchDetail } from "@/lib/types";
import { fetchServerData } from "@/lib/utils/fetchServerData";
import type { Metadata } from "next";
import InfoPageContent from "./InfoPageContent";

interface InfoPageProps {
  params: Promise<{ name: string }>;
}

export async function generateStaticParams() {
  const result = await fetchServerData<string[]>("/search/names");
  if (!result?.data) return [];
  return result.data.map((name) => ({ name: name.toLowerCase() }));
}

export async function generateMetadata({ params }: InfoPageProps): Promise<Metadata> {
  const { name } = await params;
  const raw = decodeURIComponent(name);
  const decodedName = raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
  return {
    title: `${decodedName} — Typhoon Info`,
    description: `Details and storm history for typhoon name ${decodedName}.`,
    alternates: {
      canonical: `/info/${decodedName.toLowerCase()}/`,
    },
  };
}

export default async function InfoPage({ params }: InfoPageProps) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);

  const result = await fetchServerData<SearchDetail>(
    `/typhoon-names?name=${encodeURIComponent(decodedName)}`,
  );
  return <InfoPageContent detail={result?.data ?? null} name={decodedName} />;
}
