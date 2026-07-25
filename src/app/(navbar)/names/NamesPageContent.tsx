"use client";

import FrownError from "@/lib/components/FrownError";
import PageHeader from "@/lib/components/PageHeader";
import type { RetiredName, StormHistoryEntry, SuggestionWithNameId } from "@/lib/types";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import NamesView from "./_components/_views/NamesView";
import RetiredView from "./_components/_views/RetiredView";
import type { NamesScope } from "./_components/_widgets/NamesScopeTabs";
import NamesScopeTabs from "./_components/_widgets/NamesScopeTabs";
import type { NamesDisplayPrefs } from "./_utils/displayPrefs";
import { canonicalPath, getNamesTitle, slugToParams } from "./_utils/fns";

interface NamesPageContentProps {
  allNames: RetiredName[] | null;
  stormHistory: StormHistoryEntry[];
  suggestedNames: SuggestionWithNameId[];
  displayPrefs: NamesDisplayPrefs;
}

const NamesPageContent = ({
  allNames,
  stormHistory,
  suggestedNames,
  displayPrefs,
}: NamesPageContentProps) => {
  const { slug } = useParams<{ slug?: string[] }>();
  const { view: viewMode, showName, showHistory } = slugToParams(slug);

  const retiredNames = useMemo(() => (allNames || []).filter((n) => n.isRetired), [allNames]);

  const activeScope: NamesScope =
    viewMode === "retired" ? "retired" : showHistory ? "history" : "current";

  // From the retired view there is no grid/list context to preserve, so fall back to the grid.
  const layout = viewMode === "list" ? "list" : "grid";
  const scopeShowName = viewMode === "retired" ? true : showName;

  const scopeHrefs: Record<NamesScope, string> = {
    current: canonicalPath(layout, false, scopeShowName),
    history: canonicalPath(layout, true, scopeShowName),
    retired: canonicalPath("retired", false, false),
  };

  if (!allNames) {
    return <FrownError />;
  }

  return (
    <PageHeader title={getNamesTitle(viewMode, showHistory ? "true" : "")}>
      <NamesScopeTabs activeScope={activeScope} hrefs={scopeHrefs} />

      {viewMode === "retired" ? (
        <RetiredView
          retiredNames={retiredNames}
          suggestedNames={suggestedNames}
          displayPrefs={displayPrefs}
        />
      ) : (
        <NamesView
          allNames={allNames}
          stormHistory={stormHistory}
          viewMode={viewMode}
          showName={showName}
          showHistory={showHistory}
          displayPrefs={displayPrefs}
        />
      )}
    </PageHeader>
  );
};

export default NamesPageContent;
