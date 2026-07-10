import type { SearchDetail } from "@/lib/types";
import { fetchServerData } from "@/lib/utils/fetchServerData";
import InfoModal from "./InfoModal";

interface InfoModalPageProps {
  params: Promise<{ name: string }>;
}

export default async function InfoModalPage({ params }: InfoModalPageProps) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);

  const result = await fetchServerData<SearchDetail>(
    `/typhoon-names?name=${encodeURIComponent(decodedName)}`,
  );

  return <InfoModal detail={result?.data ?? null} name={decodedName} isError={result === null} />;
}
