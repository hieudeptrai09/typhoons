import { getPositionDetails } from "@/lib/db/api/getPositionDetails";
import PositionModal from "./PositionModal";

interface PositionModalPageProps {
  params: Promise<{ position: string }>;
}

const isValidPosition = (position: number): boolean =>
  Number.isInteger(position) && position >= 1 && position <= 140;

export default async function PositionModalPage({ params }: PositionModalPageProps) {
  const { position } = await params;
  const positionNum = Number(position);

  if (!isValidPosition(positionNum)) {
    return <PositionModal detail={null} position={positionNum} />;
  }

  const result = await getPositionDetails(positionNum);

  return <PositionModal detail={result?.data ?? null} position={positionNum} />;
}
