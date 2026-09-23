import { getNameList } from "@/lib/db/api/getNameList";
import { getTyphoonNameByName, isNameNotFound } from "@/lib/db/api/getTyphoonNameByName";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import InfoPageContent from "./InfoPageContent";

interface InfoPageProps {
  params: Promise<{ name: string }>;
}

// The name list is the complete set of valid pages, so anything else is a 404 the router
// can answer on its own — no render, and no ISR write for a URL a crawler invented.
export const dynamicParams = false;

export async function generateStaticParams() {
  const result = await getNameList();
  if (!result?.data) return [];
  return result.data.map((name) => ({ name: name.toLowerCase() }));
}

export async function generateMetadata({ params }: InfoPageProps): Promise<Metadata> {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);

  const displayName = decodedName.charAt(0).toUpperCase() + decodedName.slice(1).toLowerCase();

  return {
    title: `${displayName} — Typhoon Info`,
    description: `Details and storm history for typhoon name ${displayName}.`,
    alternates: {
      canonical: `/info/${displayName.toLowerCase()}/`,
    },
  };
}

export default async function InfoPage({ params }: InfoPageProps) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);

  const [result, nameListResult] = await Promise.all([
    getTyphoonNameByName(decodedName),
    getNameList(),
  ]);

  // Unreachable for a prerendered param — every name in the list has a row or a storm —
  // but a name dropped from the DB between builds should fall through to not-found.tsx.
  if (isNameNotFound(result)) {
    notFound();
  }

  const allNames = [...(nameListResult?.data ?? [])].sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" }),
  );

  return (
    <InfoPageContent
      detail={result?.data ?? null}
      name={decodedName}
      isError={result === null}
      allNames={allNames}
    />
  );
}
