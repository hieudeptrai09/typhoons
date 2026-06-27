import { Suspense } from "react";
import InfoPageContent from "./InfoPageContent";
import type { Metadata } from "next";

interface InfoPageProps {
  params: Promise<{ name: string }>;
}

export async function generateMetadata({ params }: InfoPageProps): Promise<Metadata> {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);
  return {
    title: `${decodedName} — Typhoon Info`,
    description: `Details and storm history for typhoon name ${decodedName}.`,
  };
}

export default async function InfoPage({ params }: InfoPageProps) {
  const { name } = await params;

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-stone-100">
          <div className="text-xl text-gray-700">Loading...</div>
        </div>
      }
    >
      <InfoPageContent name={decodeURIComponent(name)} />
    </Suspense>
  );
}
