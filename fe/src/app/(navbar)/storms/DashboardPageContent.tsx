"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import FrownNotFound from "../../../components/components/FrownNotFound";
import PageHeader from "../../../components/components/PageHeader";
import { INTENSITY_RANK } from "../../../constants";
import { getPositionTitle } from "../../../containers/utils/fns";
import DashboardViewButton from "./_components/_components/DashboardViewButton";
import AverageModal from "./_components/_modals/AverageModal";
import DashboardModal from "./_components/_modals/DashboardModal";
import NameListModal from "./_components/_modals/NameListModal";
import StormDetailModal from "./_components/_modals/StormDetailModal";
import DashboardContent from "./_components/DashboardContent";
import { getDashboardTitle, slugToParams, paramsToPath } from "./_utils/fns";
import type { Storm, DashboardParams } from "../../../types";

interface SelectedData {
  title?: string;
  storms?: Storm[];
  name?: string;
  avgIntensity?: number;
  average?: number;
}

interface DashboardPageContentProps {
  stormsData: Storm[] | null;
}

export default function DashboardPageContent({ stormsData }: DashboardPageContentProps) {
  const router = useRouter();
  const { slug } = useParams<{ slug?: string[] }>();

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAverageModalOpen, setIsAverageModalOpen] = useState(false);
  const [isNameListModalOpen, setIsNameListModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<SelectedData | null>(null);

  const currentParams: DashboardParams = slugToParams(slug);
  const { view, mode, filter } = currentParams;

  const handleApplyFilter = (newParams: DashboardParams) => {
    setIsFilterModalOpen(false);
    router.push(paramsToPath(newParams));
  };

  const handleCellClick = (data: number | string, key: string) => {
    const storms = (stormsData || []).filter((s) => s[key as keyof Storm] === data);

    // Storms view — name list mode: clicking a name row
    if (view === "storms" && key === "name") {
      const avgIntensity =
        storms.reduce((sum, s) => sum + INTENSITY_RANK[s.intensity], 0) / storms.length;
      setSelectedData({ name: data as string, storms, avgIntensity });
      setIsNameListModalOpen(true);
      return;
    }

    // Storms view — any table mode (position or name grid): clicking a cell
    if (view === "storms" && key === "position") {
      const title = key === "position" ? getPositionTitle(Number(data)) : String(data);
      setSelectedData({ title, storms });
      setIsDetailModalOpen(true);
      return;
    }

    if (view === "average" && filter === "name") {
      const avg = storms.reduce((sum, s) => sum + INTENSITY_RANK[s.intensity], 0) / storms.length;
      setSelectedData({ title: String(data), average: avg, storms });
      setIsAverageModalOpen(true);
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

  if (!stormsData) {
    return <FrownNotFound />;
  }

  return (
    <PageHeader title={getDashboardTitle(view, mode, filter)}>
      <DashboardViewButton onClick={() => setIsFilterModalOpen(true)} params={currentParams} />

      <DashboardContent
        params={currentParams}
        stormsData={stormsData}
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
