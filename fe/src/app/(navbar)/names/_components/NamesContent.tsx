import NamesView from "./_views/NamesView";
import RetiredView from "./_views/RetiredView";
import type { TyphoonName, RetiredName } from "../../../../types";

interface NamesContentProps {
  viewMode: string;
  allNames: TyphoonName[];
  currentNames: TyphoonName[];
  retiredNames: RetiredName[];
}

const NamesContent = ({
  viewMode,
  allNames,
  currentNames,
  retiredNames,
}: NamesContentProps) => {
  if (viewMode === "retired") {
    return <RetiredView retiredNames={retiredNames} />;
  }
  return <NamesView allNames={allNames} currentNames={currentNames} />;
};

export default NamesContent;
