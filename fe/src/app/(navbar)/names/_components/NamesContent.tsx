import NamesView from "./_views/NamesView";
import RetiredView from "./_views/RetiredView";
import type { TyphoonName, RetiredName } from "../../../../types";

interface NamesContentProps {
  viewMode: string;
  showName: boolean;
  showHistory: boolean;
  allNames: TyphoonName[];
  currentNames: TyphoonName[];
  retiredNames: RetiredName[];
  activeTab: "names" | "retired";
  onToggleView: () => void;
}

const NamesContent = ({
  viewMode,
  showName,
  showHistory,
  allNames,
  currentNames,
  retiredNames,
  activeTab,
  onToggleView,
}: NamesContentProps) => {
  if (viewMode === "retired") {
    return (
      <RetiredView retiredNames={retiredNames} activeTab={activeTab} onToggleView={onToggleView} />
    );
  }
  return (
    <NamesView
      allNames={allNames}
      currentNames={currentNames}
      viewMode={viewMode}
      showName={showName}
      showHistory={showHistory}
      activeTab={activeTab}
      onToggleView={onToggleView}
    />
  );
};

export default NamesContent;
