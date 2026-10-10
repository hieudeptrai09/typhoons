"use client";

import FrownError from "@/lib/components/FrownError";
import PageHeader from "@/lib/components/PageHeader";
import TyphoonSpinner from "@/lib/components/TyphoonSpinner";
import { MONTH_NAMES, TITLE_COMMON } from "@/lib/constants";
import type { DashboardParams, Storm } from "@/lib/types";
import { getPositionTitle } from "@/lib/utils/position";
import { calculateAverage, calculateGapAverage, getGroupedStorms } from "@/lib/utils/storms";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import DashboardLegend from "./_components/_legends/DashboardLegend";
import AverageModal, { type AverageModalCriteria } from "./_components/_modals/AverageModal";
import AvgDateModal from "./_components/_modals/AvgDateModal";
import DistanceModal from "./_components/_modals/DistanceModal";
import NameListModal from "./_components/_modals/NameListModal";
import StormDetailModal from "./_components/_modals/StormDetailModal";
import AverageView from "./_components/_views/AverageView";
import AvgDateView from "./_components/_views/AvgDateView";
import CalendarView from "./_components/_views/CalendarView";
import DistanceView from "./_components/_views/DistanceView";
import HighlightsView from "./_components/_views/HighlightsView";
import IntensityView from "./_components/_views/IntensityView";
import StormsView from "./_components/_views/StormsView";
import DashboardControlBar from "./_components/_widgets/DashboardControlBar";
import { getDashboardPageTitle, getDashboardTitle } from "./_utils/metadata";
import { getPanel, paramsToPath, slugToParams } from "./_utils/routing";
import { getEffectiveMonth } from "./_utils/stats";

interface SelectedData {
  title?: string;
  storms?: Storm[];
  name?: string;
  avgIntensity?: number;
  average?: number;
  criteria?: AverageModalCriteria;
}

interface DashboardPageContentProps {
  stormsData: Storm[] | null;
}

export default function DashboardPageContent({ stormsData }: DashboardPageContentProps) {
  // Read off the path, not useParams: a view switch rewrites the URL with history.pushState,
  // which Next keeps usePathname in sync with but leaves the route's params where they were.
  const slug = usePathname().split("/").filter(Boolean).slice(1);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAverageModalOpen, setIsAverageModalOpen] = useState(false);
  const [isNameListModalOpen, setIsNameListModalOpen] = useState(false);
  const [isDistanceModalOpen, setIsDistanceModalOpen] = useState(false);
  const [isAvgDateModalOpen, setIsAvgDateModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<SelectedData | null>(null);

  const currentParams: DashboardParams = slugToParams(slug);
  const { filter } = currentParams;
  const panel = getPanel(currentParams);
  const pageTitle = getDashboardPageTitle(currentParams);

  // The server titled the page it rendered; every view switched to since then is retitled here.
  useEffect(() => {
    document.title = `${pageTitle} | ${TITLE_COMMON}`;
  }, [pageTitle]);

  const averageValues =
    panel === "intensity" || panel === "all"
      ? Object.fromEntries(
          Object.entries(getGroupedStorms(stormsData || [], "position")).map(
            ([position, storms]) => [Number(position), calculateAverage(storms)],
          ),
        )
      : null;

  const handleApplyFilter = (newParams: DashboardParams) => {
    const query = newParams.view === "calendar" ? window.location.search : "";
    // Every view renders from the stormsData already here, so only the URL needs to change.
    // A router navigation would fetch the next page's payload, the same ~260 KB dataset again,
    // and each of those is billed as an ISR read.
    window.history.pushState(null, "", `${paramsToPath(newParams)}${query}`);
  };

  const handleCellClick = (data: number | string, key: string) => {
    const storms = (stormsData || []).filter((s) => s[key as keyof Storm] === data);

    // Storms view — name list mode: clicking a name row
    if (panel === "all" && key === "name") {
      const avgIntensity = calculateAverage(storms);
      setSelectedData({ name: data as string, storms, avgIntensity });
      setIsNameListModalOpen(true);
      return;
    }

    // Storms view — any table mode (position or name grid): clicking a cell
    if (panel === "all" && key === "position") {
      const title = key === "position" ? getPositionTitle(Number(data)) : String(data);
      setSelectedData({ title, storms });
      setIsDetailModalOpen(true);
      return;
    }

    if (panel === "intensity" && filter === "name") {
      setSelectedData({
        title: String(data),
        average: calculateAverage(storms),
        storms,
        criteria: "name",
      });
      setIsAverageModalOpen(true);
      return;
    }

    // Avg. Intensity / month: clicking a month row opens storm detail modal
    if (panel === "intensity" && filter === "month") {
      const monthName = MONTH_NAMES[data as number];
      const monthStorms = (stormsData || []).filter(
        (s) => getEffectiveMonth(s) === (data as number),
      );
      setSelectedData({
        title: monthName,
        storms: monthStorms,
        average: calculateAverage(monthStorms),
        criteria: "month",
      });
      setIsAverageModalOpen(true);
      return;
    }

    // Avg. Gap: clicking a position or name opens the recurrence timeline
    if (panel === "gap") {
      const title = key === "position" ? getPositionTitle(Number(data)) : String(data);
      setSelectedData({ title, storms, average: calculateGapAverage(storms) });
      setIsDistanceModalOpen(true);
      return;
    }

    // Avg. Dates: clicking any grouping row opens the seasonal date modal
    if (panel === "dates") {
      const avgDateTitles: Record<string, string> = {
        position: getPositionTitle(Number(data)),
        year: `Year ${data}`,
      };
      setSelectedData({ title: avgDateTitles[key] ?? String(data), storms });
      setIsAvgDateModalOpen(true);
      return;
    }

    const titleMap: Record<string, string> = {
      position: getPositionTitle(Number(data)),
      country: data as string,
      year: `Year ${data}`,
    };

    setSelectedData({
      title: titleMap[key],
      average: calculateAverage(storms),
      storms,
      criteria: key as AverageModalCriteria,
    });
    setIsAverageModalOpen(true);
  };

  if (!stormsData) {
    return <FrownError />;
  }

  return (
    <PageHeader title={getDashboardTitle(currentParams)}>
      <DashboardControlBar params={currentParams} onChange={handleApplyFilter} />

      {(() => {
        switch (panel) {
          case "all":
            return (
              <StormsView
                params={currentParams}
                stormsData={stormsData}
                averageValues={averageValues}
                onCellClick={handleCellClick}
              />
            );
          case "season":
            return <HighlightsView params={currentParams} stormsData={stormsData} />;
          case "category":
            return <IntensityView params={currentParams} stormsData={stormsData} />;
          case "intensity":
            return (
              <AverageView
                params={currentParams}
                stormsData={stormsData}
                averageValues={averageValues}
                onCellClick={handleCellClick}
              />
            );
          case "gap":
            return (
              <DistanceView
                params={currentParams}
                stormsData={stormsData}
                onCellClick={handleCellClick}
              />
            );
          case "dates":
            return (
              <AvgDateView
                params={currentParams}
                stormsData={stormsData}
                onCellClick={handleCellClick}
              />
            );
          case "calendar":
            return (
              <Suspense
                fallback={
                  <div className="flex justify-center py-16">
                    <TyphoonSpinner size="large" />
                  </div>
                }
              >
                <CalendarView params={currentParams} stormsData={stormsData} />
              </Suspense>
            );
          default:
            return <div className="text-center text-foreground">Select filters to view data</div>;
        }
      })()}

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
        storms={selectedData?.storms || []}
        criteria={selectedData?.criteria || "position"}
      />

      <NameListModal
        isOpen={isNameListModalOpen}
        onClose={() => setIsNameListModalOpen(false)}
        name={selectedData?.name || ""}
        storms={selectedData?.storms || []}
        avgIntensity={selectedData?.avgIntensity || 0}
      />

      <DistanceModal
        isOpen={isDistanceModalOpen}
        onClose={() => setIsDistanceModalOpen(false)}
        title={selectedData?.title || ""}
        storms={selectedData?.storms || []}
        average={selectedData?.average ?? -1}
      />

      <AvgDateModal
        isOpen={isAvgDateModalOpen}
        onClose={() => setIsAvgDateModalOpen(false)}
        title={selectedData?.title || ""}
        storms={selectedData?.storms || []}
      />

      <DashboardLegend params={currentParams} />
    </PageHeader>
  );
}
