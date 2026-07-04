import { getNameStatusColorClass } from "@/lib/utils/colors";
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
  if (position !== undefined && (position < 1 || position > 140)) {
    return <CircleHelp className="text-slate-500" size={size} />;
  }
  const colorClass = getNameStatusColorClass({ isRetired, isLanguageProblem });
  if (isLanguageProblem === 2) {
    return <SpellCheck2 className={colorClass} size={size} />;
  }
  if (isRetired) {
    return <Skull className={colorClass} size={size} />;
  }
  return <Flame className={colorClass} size={size} />;
}
