import { getNameStatusColorClass, isExternalPosition } from "@/lib/utils/colors";
import { CircleHelp, Flame, Skull, SpellCheck2 } from "lucide-react";

interface Props {
  isRetired: boolean;
  isLanguageProblem: number;
  size?: number;
  position?: number;
}

export default function NameStatusIcon({
  isRetired,
  isLanguageProblem,
  size = 20,
  position,
}: Props) {
  const isExternal = isExternalPosition(position);
  const colorClass = getNameStatusColorClass({ isRetired, isLanguageProblem, isExternal });
  if (isExternal) {
    return <CircleHelp className={colorClass} size={size} />;
  }
  if (isLanguageProblem === 2) {
    return <SpellCheck2 className={colorClass} size={size} />;
  }
  if (isRetired) {
    return <Skull className={colorClass} size={size} />;
  }
  return <Flame className={colorClass} size={size} />;
}
