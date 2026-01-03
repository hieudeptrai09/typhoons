"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PageHeader from "../../../components/PageHeader";
import { INTENSITY_RANK } from "../../../constants";
import fetchData from "../../../containers/utils/fetcher";
import AverageModal from "./_components/AverageModal";
import DashboardContent from "./_components/DashboardContent";
import FilterButton from "./_components/FilterButton";
import FilterModal from "./_components/FilterModal";
import NameListModal from "./_components/NameListModal";
import StormDetailModal from "./_components/StormDetailModal";
import { getPositionTitle, getDashboardTitle } from "./_utils/fns";
import { Storm, DashboardParams } from "../../../types";

interface SelectedData {
  title?: string;
  storms?: Storm[];
  name?: string;
  avgIntensity?: number;
  average?: number;
}

export default function DashboardPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAverageModalOpen, setIsAverageModalOpen] = useState(false);
  const [isNameListModalOpen, setIsNameListModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<SelectedData | null>(null);
  const [stormsData, setStormsData] = useState<Storm[]>([]);

  // Initialize params from URL searchParams
  const params: DashboardParams = {
    view: searchParams.get("view") || "storms",
    mode: searchParams.get("mode") || "table",
    filter: searchParams.get("filter") || "",
  };

  useEffect(() => {
    const loadStorms = async () => {
      const result = await fetchData<Storm[]>("/storms");
      if (result) {
        setStormsData(result.data);
      }
    };

    loadStorms();
  }, []);

  const handleApplyFilter = (newParams: DashboardParams) => {
    setIsFilterModalOpen(false);

    const searchParams = new URLSearchParams();
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) searchParams.set(key, value);
    });
    router.push(`/storms${searchParams.toString() ? `?${searchParams}` : ""}`);
  };

  const handleCellClick = (data: number | string, key: string) => {
    const storms = stormsData.filter((s) => s[key as keyof Storm] === data);

    // Handle storms list view - clicking on a name
    if (params.view === "storms" && params.mode === "list" && key === "name") {
      const avgIntensity =
        storms.reduce((sum, s) => {
          return sum + INTENSITY_RANK[s.intensity];
        }, 0) / storms.length;

      setSelectedData({ name: data as string, storms, avgIntensity });
      setIsNameListModalOpen(true);
      return;
    }

    if (params.view === "storms" || (params.view === "average" && params.filter === "name")) {
      setSelectedData({ title: getPositionTitle(data, params.filter), storms });
      setIsDetailModalOpen(true);
    } else {
      // All other routes open average modal
      const titleMap: Record<string, string> = {
        position: getPositionTitle(data),
        country: data as string,
        year: `Year ${data}`,
      };

      const avg =
        storms.reduce((sum, s) => {
          return sum + INTENSITY_RANK[s.intensity];
        }, 0) / storms.length;

      setSelectedData({
        title: titleMap[key] || getPositionTitle(data),
        average: avg,
        storms,
      });
      setIsAverageModalOpen(true);
    }
  };

  return (
    <PageHeader title={getDashboardTitle(params.view, params.mode, params.filter)}>
      <FilterButton onClick={() => setIsFilterModalOpen(true)} params={params} />

      <DashboardContent params={params} stormsData={stormsData} onCellClick={handleCellClick} />

      <FilterModal
        key={JSON.stringify(params)}
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyFilter}
        currentParams={params}
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
