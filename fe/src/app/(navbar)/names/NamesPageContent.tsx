"use client";

import { useMemo } from "react";
import { Spin } from "antd";
import FrownNotFound from "../../../components/components/FrownNotFound";
import PageHeader from "../../../components/components/PageHeader";
import { useFetchData } from "../../../containers/hooks/useFetchData";
import { useURLParams } from "../../../containers/hooks/useURLParams";
import NamesContent from "./_components/NamesContent";
import type { RetiredName } from "../../../types";

type TabKey = "names" | "retired";

const TABS: { key: TabKey; label: string }[] = [
  { key: "names", label: "Names" },
  { key: "retired", label: "Retired" },
];

const NamesPageContent = () => {
  const { params, updateParams } = useURLParams<{ view?: string; letter?: string }>();
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

  return (
    <PageHeader title="Typhoon Names">
      <div className="mx-auto mb-6 flex max-w-4xl justify-center gap-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`rounded-lg px-5 py-2 text-sm font-semibold transition-colors ${
              activeTab === tab.key
                ? "bg-blue-600 text-white"
                : "bg-stone-200 text-gray-700 hover:bg-stone-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <NamesContent
        viewMode={viewMode}
        allNames={allNames || []}
        currentNames={currentNames}
        retiredNames={retiredNames}
      />
    </PageHeader>
  );
};

export default NamesPageContent;
