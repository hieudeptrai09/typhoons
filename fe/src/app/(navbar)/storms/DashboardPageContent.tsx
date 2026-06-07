"use client";

import { useState } from "react";
import FrownNotFound from "../../../components/components/FrownNotFound";
import Loader from "../../../components/components/Loader";
import PageHeader from "../../../components/components/PageHeader";
import { INTENSITY_RANK } from "../../../constants";
import { useFetchData } from "../../../containers/hooks/useFetchData";
import { useURLParams } from "../../../containers/hooks/useURLParams";
import { getPositionTitle } from "../../../containers/utils/fns";
import AverageModal from "./_components/_modals/AverageModal";
import DashboardContent from "./_components/DashboardContent";
import DashboardViewButton from "./_components/_components/DashboardViewButton";
import DashboardModal from "./_components/_modals/DashboardModal";
import NameListModal from "./_components/_modals/NameListModal";
import StormDetailModal from "./_components/_modals/StormDetailModal";
import { getDashboardTitle } from "./_utils/fns";
import type { Storm, DashboardParams } from "../../../types";

interface SelectedData {
  title?: string;
  storms?: Storm[];
  name?: string;
  avgIntensity?: number;
  average?: number;
}

export default function DashboardPageContent() {
  const { params, updateParams } = useURLParams<DashboardParams>();
  const { data: stormsData, loading, error } = useFetchData<Storm[]>("/storms");

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAverageModalOpen, setIsAverageModalOpen] = useState(false);
  const [isNameListModalOpen, setIsNameListModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<SelectedData | null>(null);

  const view = params.view || "storms";
  const mode = params.mode || "table";
  const filter = params.filter || "";

  const currentParams: DashboardParams = { view, mode, filter };

  const handleApplyFilter = (newParams: DashboardParams) => {
    setIsFilterModalOpen(false);
    updateParams(newParams, true);
  };

  const handleCellClick = (data: number | string, key: string) => {
    const storms = (stormsData || []).filter((s) => s[key as keyof Storm] === data);

    if (view === "storms" && mode === "list" && key === "name") {
      const avgIntensity =
        storms.reduce((sum, s) => sum + INTENSITY_RANK[s.intensity], 0) / storms.length;
      setSelectedData({ name: data as string, storms, avgIntensity });
      setIsNameListModalOpen(true);
      return;
    }

    if (view === "storms" && mode === "table") {
      setSelectedData({ title: getPositionTitle(Number(data)), storms });
      setIsDetailModalOpen(true);
      return;
    }

    if (view === "average" && filter === "name") {
      setSelectedData({ title: String(data), storms });
      setIsDetailModalOpen(true);
      return;
    }

    // Distance view: clicking a position or name opens the storm detail modal
    if (view === "distance") {
      const title = key === "position" ? getPositionTitle(Number(data)) : String(data);
      setSelectedData({ title, storms });
      setIsDetailModalOpen(true);
      return;
    }

    const titleMap: Record<string, string> = {
      position: getPositionTitle(Number(data)),
      country: data as string,
      year: `Year ${data}`,
    };

    const avg = storms.reduce((sum, s) => sum + INTENSITY_RANK[s.intensity], 0) / storms.length;

    setSelectedData({ title: titleMap[key], average: avg, storms });
    setIsAverageModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-100">
        <Loader size="lg" />
      </div>
    );
  }

  if (error) {
    return <FrownNotFound />;
  }

  return (
    <PageHeader title={getDashboardTitle(view, mode, filter)}>
      <DashboardViewButton onClick={() => setIsFilterModalOpen(true)} params={currentParams} />

      <DashboardContent
        params={currentParams}
        stormsData={stormsData || []}
        onCellClick={handleCellClick}
      />

      <DashboardModal
        key={JSON.stringify(currentParams)}
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyFilter}
        currentParams={currentParams}
      />

      <StormDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={selectedData?.title || ""}
        storms={selectedData?.storms || []}
      />

      <AverageModal
        isOpen={isAverageModalOpen}
        onClose={() => setIsAverageModalOpen(false)}
        title={selectedData?.title || ""}
        average={selectedData?.average || 0}
        storms={selectedData?.storms || []}
      />

      <NameListModal
        isOpen={isNameListModalOpen}
        onClose={() => setIsNameListModalOpen(false)}
        name={selectedData?.name || ""}
        storms={selectedData?.storms || []}
        avgIntensity={selectedData?.avgIntensity || 0}
      />
    </PageHeader>
  );
}
