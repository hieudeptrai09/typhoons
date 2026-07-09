"use client";

import FrownError from "@/lib/components/FrownError";
import PageHeader from "@/lib/components/PageHeader";
import type { DashboardParams, Storm } from "@/lib/types";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import AverageModal from "./_components/_modals/AverageModal";
import DashboardModal from "./_components/_modals/DashboardModal";
import StormDetailModal from "./_components/_modals/StormDetailModal";
import AverageView from "./_components/_views/AverageView";
import DistanceView from "./_components/_views/DistanceView";
import HighlightsView from "./_components/_views/HighlightsView";
import StormsView from "./_components/_views/StormsView";
import DashboardViewButton from "./_components/_widgets/DashboardViewButton";
import {
  calculateAverage,
  getDashboardTitle,
  getEffectiveMonth,
  getGroupedStorms,
  paramsToPath,
  slugToParams,
} from "./_utils/fns";

interface SelectedData {
  title?: string;
  storms?: Storm[];
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
  const [selectedData, setSelectedData] = useState<SelectedData | null>(null);

  const currentParams: DashboardParams = slugToParams(slug);
  const { view, mode, filter } = currentParams;

  const averageValues =
    view === "average" || view === "storms"
      ? Object.fromEntries(
          Object.entries(getGroupedStorms(stormsData || [], "position")).map(
            ([position, storms]) => [Number(position), calculateAverage(storms)],
          ),
        )
      : null;

  const handleApplyFilter = (newParams: DashboardParams) => {
    setIsFilterModalOpen(false);
    router.push(paramsToPath(newParams));
  };

  const handleCellClick = (data: number | string, key: string) => {
    const storms = (stormsData || []).filter((s) => s[key as keyof Storm] === data);

    // Storms view — name list mode: clicking a name row opens the name's info modal
    if (view === "storms" && key === "name") {
      router.push(`/info/${encodeURIComponent((data as string).toLowerCase())}/?origin=storms`, {
        scroll: false,
      });
      return;
    }

    // Any cell keyed by position: opens the position's page/modal, in the "storms"
    // lens for storms/distance views, "average" lens everywhere else.
    if (key === "position") {
      const origin = view === "storms" || view === "distance" ? "storms" : "average";
      router.push(`/positions/${Number(data)}?origin=${origin}`, { scroll: false });
      return;
    }

    if (view === "average" && filter === "name") {
      setSelectedData({ title: String(data), average: calculateAverage(storms), storms });
      setIsAverageModalOpen(true);
      return;
    }

    // Average / month: clicking a month row opens storm detail modal
    if (view === "average" && filter === "month") {
      const monthName = new Date(2000, (data as number) - 1, 1).toLocaleString("default", {
        month: "long",
      });
      const monthStorms = (stormsData || []).filter(
        (s) => getEffectiveMonth(s) === (data as number),
      );
      setSelectedData({ title: monthName, storms: monthStorms });
      setIsAverageModalOpen(true);
      return;
    }

    // Distance view: clicking a name opens the storm detail modal
    if (view === "distance") {
      setSelectedData({ title: String(data), storms });
      setIsDetailModalOpen(true);
      return;
    }

    const titleMap: Record<string, string> = {
      country: data as string,
      year: `Year ${data}`,
    };

    setSelectedData({ title: titleMap[key], average: calculateAverage(storms), storms });
    setIsAverageModalOpen(true);
  };

  if (!stormsData) {
    return <FrownError />;
  }

  return (
    <PageHeader title={getDashboardTitle(view, mode, filter)}>
      <DashboardViewButton onClick={() => setIsFilterModalOpen(true)} params={currentParams} />

      {(() => {
        switch (view) {
          case "storms":
            return (
              <StormsView
                params={currentParams}
                stormsData={stormsData}
                averageValues={averageValues}
                onCellClick={handleCellClick}
              />
            );
          case "highlights":
            return (
              <HighlightsView
                params={currentParams}
                stormsData={stormsData}
                onCellClick={handleCellClick}
              />
            );
          case "average":
            return (
              <AverageView
                params={currentParams}
                stormsData={stormsData}
                averageValues={averageValues}
                onCellClick={handleCellClick}
              />
            );
          case "distance":
            return (
              <DistanceView
                params={currentParams}
                stormsData={stormsData}
                onCellClick={handleCellClick}
              />
            );
          default:
            return <div className="text-center text-gray-500">Select filters to view data</div>;
        }
      })()}

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
    </PageHeader>
  );
}
