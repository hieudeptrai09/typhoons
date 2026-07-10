import { getPositionDetails } from "@/lib/db/api/getPositionDetails";
import { getPositionTitle } from "@/lib/utils/fns";
import type { Metadata } from "next";
import PositionPageContent from "./PositionPageContent";

interface PositionPageProps {
  params: Promise<{ position: string }>;
}

const isValidPosition = (position: number): boolean =>
  Number.isInteger(position) && position >= 1 && position <= 140;

export async function generateStaticParams() {
  return Array.from({ length: 140 }, (_, i) => ({ position: String(i + 1) }));
}

export async function generateMetadata({ params }: PositionPageProps): Promise<Metadata> {
  const { position } = await params;
  const positionNum = Number(position);
  const positionTitle = getPositionTitle(positionNum);

  return {
    title: `${positionTitle} — Naming Position`,
    description: `Names, storm history, and average intensity for naming position ${positionTitle}.`,
    alternates: {
      canonical: `/positions/${positionNum}/`,
    },
  };
}

export default async function PositionPage({ params }: PositionPageProps) {
  const { position } = await params;
  const positionNum = Number(position);

  if (!isValidPosition(positionNum)) {
    return <PositionPageContent detail={null} position={positionNum} />;
  }

  const result = await getPositionDetails(positionNum);

  return (
    <PositionPageContent
      detail={result?.data ?? null}
      position={positionNum}
      isError={result === null}
    />
  );
}
