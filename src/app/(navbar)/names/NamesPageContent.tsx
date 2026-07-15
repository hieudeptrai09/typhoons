"use client";

import FrownError from "@/lib/components/FrownError";
import PageHeader from "@/lib/components/PageHeader";
import type { RetiredName, StormHistoryEntry, SuggestionWithNameId } from "@/lib/types";
import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import NamesView from "./_components/_views/NamesView";
import RetiredView from "./_components/_views/RetiredView";
import type { NamesDisplayPrefs } from "./_utils/displayPrefs";
import { getNamesTitle, paramsToPath, slugToParams } from "./_utils/fns";

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
  const router = useRouter();
  const { slug } = useParams<{ slug?: string[] }>();
  const { view: viewMode, showName, showHistory } = slugToParams(slug);

  const retiredNames = useMemo(() => (allNames || []).filter((n) => n.isRetired), [allNames]);

  const toggleView = () => {
    if (viewMode === "retired") {
      router.push(paramsToPath("current", false, true));
    } else {
      router.push(paramsToPath("retired"));
    }
  };

  if (!allNames) {
    return <FrownError />;
  }

  return (
    <PageHeader title={getNamesTitle(viewMode, showHistory ? "true" : "")}>
      {viewMode === "retired" ? (
        <RetiredView
          retiredNames={retiredNames}
          suggestedNames={suggestedNames}
          onToggleView={toggleView}
        />
      ) : (
        <NamesView
          allNames={allNames}
          stormHistory={stormHistory}
          viewMode={viewMode}
          showName={showName}
          showHistory={showHistory}
          displayPrefs={displayPrefs}
          onToggleView={toggleView}
        />
      )}
    </PageHeader>
  );
};

export default NamesPageContent;
