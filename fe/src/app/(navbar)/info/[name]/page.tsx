import { Suspense } from "react";
import TyphoonSpinner from "../../../../components/components/TyphoonSpinner";
import { fetchServerData } from "../../../../containers/utils/fetchServerData";
import InfoPageContent from "./InfoPageContent";
import type { Metadata } from "next";
import type { SearchDetail } from "../../../../types";

interface InfoPageProps {
  params: Promise<{ name: string }>;
}

export async function generateMetadata({ params }: InfoPageProps): Promise<Metadata> {
  const { name } = await params;
  const raw = decodeURIComponent(name);
  const decodedName = raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
  return {
    title: `${decodedName} — Typhoon Info`,
    description: `Details and storm history for typhoon name ${decodedName}.`,
  };
}

async function InfoData({ name }: { name: string }) {
  const result = await fetchServerData<SearchDetail>(
    `/search?name=${encodeURIComponent(name)}`,
  );
  return <InfoPageContent detail={result?.data ?? null} name={name} />;
}

export default async function InfoPage({ params }: InfoPageProps) {
  const { name } = await params;

  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 flex items-center justify-center bg-stone-100">
          <TyphoonSpinner size="large" />
        </div>
      }
    >
      <InfoData name={decodeURIComponent(name)} />
    </Suspense>
  );
}
