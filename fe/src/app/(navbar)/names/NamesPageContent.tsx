"use client";

import FrownNotFound from "@/common/components/FrownNotFound";
import PageHeader from "@/common/components/PageHeader";
import type { RetiredName } from "@/common/types";
import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import NamesView from "./_components/_views/NamesView";
import RetiredView from "./_components/_views/RetiredView";
import { getNamesTitle, paramsToPath, slugToParams } from "./_utils/fns";

interface NamesPageContentProps {
  allNames: RetiredName[] | null;
}

const NamesPageContent = ({ allNames }: NamesPageContentProps) => {
  const router = useRouter();
  const { slug } = useParams<{ slug?: string[] }>();
  const { view: viewMode, showName, showHistory } = slugToParams(slug);

  const retiredNames = useMemo(() => (allNames || []).filter((n) => n.isRetired), [allNames]);

  const toggleView = () => {
    if (viewMode === "retired") {
      router.push(paramsToPath("current", false, true));
    } else {
      router.push(`${paramsToPath("retired")}?letter=A`);
    }
  };

  if (!allNames) {
    return <FrownNotFound />;
  }

  return (
    <PageHeader title={getNamesTitle(viewMode, showName ? "true" : "", showHistory ? "true" : "")}>
      {viewMode === "retired" ? (
        <RetiredView retiredNames={retiredNames} onToggleView={toggleView} />
      ) : (
        <NamesView
          allNames={allNames}
          viewMode={viewMode}
          showName={showName}
          showHistory={showHistory}
          onToggleView={toggleView}
        />
      )}
    </PageHeader>
  );
};

export default NamesPageContent;
