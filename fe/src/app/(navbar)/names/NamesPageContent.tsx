"use client";

import FrownNotFound from "@/lib/components/FrownNotFound";
import PageHeader from "@/lib/components/PageHeader";
import TyphoonSpinner from "@/lib/components/TyphoonSpinner";
import { useFetchData } from "@/lib/hooks/useFetchData";
import type { RetiredName } from "@/lib/types";
import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import NamesView from "./_components/_views/NamesView";
import RetiredView from "./_components/_views/RetiredView";
import { getNamesTitle, paramsToPath, slugToParams } from "./_utils/fns";

const NamesPageContent = () => {
  const router = useRouter();
  const { slug } = useParams<{ slug?: string[] }>();
  const { view: viewMode, showName, showHistory } = slugToParams(slug);
  const { data: allNames, loading } = useFetchData<RetiredName[]>("/typhoon-names");

  const retiredNames = useMemo(() => (allNames || []).filter((n) => n.isRetired), [allNames]);

  const toggleView = () => {
    if (viewMode === "retired") {
      router.push(paramsToPath("current", false, true));
    } else {
      router.push(`${paramsToPath("retired")}?letter=A`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <TyphoonSpinner size="large" />
      </div>
    );
  }

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
