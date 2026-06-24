"use client";

import { useMemo } from "react";
import { Spin } from "antd";
import FrownNotFound from "../../../components/components/FrownNotFound";
import PageHeader from "../../../components/components/PageHeader";
import { useFetchData } from "../../../containers/hooks/useFetchData";
import { useURLParams } from "../../../containers/hooks/useURLParams";
import NamesContent from "./_components/NamesContent";
import { getNamesTitle } from "./_utils/fns";
import type { RetiredName } from "../../../types";

type TabKey = "names" | "retired";

const NamesPageContent = () => {
  const { params, updateParams } = useURLParams<{ view?: string; letter?: string; showName?: string; showHistory?: string }>();
  const viewMode = params.view || "grid";
  const activeTab: TabKey = viewMode === "retired" ? "retired" : "names";

  const {
    data: allNames,
    loading,
    error,
  } = useFetchData<RetiredName[]>("/typhoon-names");

  const currentNames = useMemo(
    () => (allNames || []).filter((n) => !n.isRetired || n.isReplaced === 0),
    [allNames],
  );

  const retiredNames = useMemo(
    () => (allNames || []).filter((n) => n.isRetired),
    [allNames],
  );

  const handleTabChange = (tab: TabKey) => {
    if (tab === "names") {
      updateParams({ view: "grid" }, true);
    } else {
      updateParams({ view: "retired", letter: "A" }, true);
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
    <PageHeader title={getNamesTitle(viewMode, params.showName, params.showHistory)}>
      <NamesContent
        viewMode={viewMode}
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
