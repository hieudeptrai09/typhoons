"use client";

import { useMemo } from "react";
import { Spin } from "antd";
import { useParams, useRouter } from "next/navigation";
import FrownNotFound from "../../../components/components/FrownNotFound";
import PageHeader from "../../../components/components/PageHeader";
import { useFetchData } from "../../../containers/hooks/useFetchData";
import NamesContent from "./_components/NamesContent";
import { getNamesTitle, slugToParams, paramsToPath } from "./_utils/fns";
import type { RetiredName } from "../../../types";

type TabKey = "names" | "retired";

const NamesPageContent = () => {
  const router = useRouter();
  const { slug } = useParams<{ slug?: string[] }>();
  const { view: viewMode, showName, showHistory } = slugToParams(slug);
  const activeTab: TabKey = viewMode === "retired" ? "retired" : "names";

  const { data: allNames, loading, error } = useFetchData<RetiredName[]>("/typhoon-names");

  const currentNames = useMemo(
    () => (allNames || []).filter((n) => !n.isRetired || n.isReplaced === 0),
    [allNames],
  );

  const retiredNames = useMemo(() => (allNames || []).filter((n) => n.isRetired), [allNames]);

  const handleTabChange = (tab: TabKey) => {
    if (tab === "names") {
      router.push(paramsToPath("grid"));
    } else {
      router.push(`${paramsToPath("retired")}?letter=A`);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-100">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <FrownNotFound />;
  }

  const toggleView = () => {
    handleTabChange(activeTab === "names" ? "retired" : "names");
  };

  return (
    <PageHeader title={getNamesTitle(viewMode, showName ? "true" : "", showHistory ? "true" : "")}>
      <NamesContent
        viewMode={viewMode}
        showName={showName}
        showHistory={showHistory}
        allNames={allNames || []}
        currentNames={currentNames}
        retiredNames={retiredNames}
        activeTab={activeTab}
        onToggleView={toggleView}
      />
    </PageHeader>
  );
};

export default NamesPageContent;
