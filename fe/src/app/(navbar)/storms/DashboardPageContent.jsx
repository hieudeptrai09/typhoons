"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PageHeader from "../../../components/PageHeader";
import { INTENSITY_RANK } from "../../../constants";
import fetchData from "../../../containers/utils/fetcher";
import { AverageModal } from "./_components/AverageModal";
import { DashboardContent } from "./_components/DashboardContent";
import FilterButton from "./_components/FilterButton";
import { FilterModal } from "./_components/FilterModal";
import { NameListModal } from "./_components/NameListModal";
import { StormDetailModal } from "./_components/StormDetailModal";
import { getPositionTitle, getDashboardTitle } from "./_utils/fns";

export default function DashboardPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [averageModalOpen, setAverageModalOpen] = useState(false);
  const [nameListModalOpen, setNameListModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [params, setParams] = useState({ view: "storms", mode: "table" });
  const [stormsData, setStormsData] = useState([]);

  // Initialize params from URL searchParams
  useEffect(() => {
    const view = searchParams.get("view") || "storms";
    const mode = searchParams.get("mode") || "table";
    const filter = searchParams.get("filter") || "";

    setParams({ view, mode, filter });
  }, [searchParams]);

  useEffect(() => {
    const loadStorms = async () => {
      const result = await fetchData("/storms");
      setStormsData(result.data);
    };

    loadStorms();
  }, []);

  const handleApplyFilter = (newParams) => {
    setParams(newParams);
    setFilterModalOpen(false);

    const searchParams = new URLSearchParams();
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) searchParams.set(key, value);
    });
    router.push(`/storms${searchParams.toString() ? `?${searchParams}` : ""}`);
  };

  const handleCellClick = (data, key) => {
    const storms = stormsData.filter((s) => s[key] === String(data));

    // Handle storms list view - clicking on a name
    if (params.view === "storms" && params.mode === "list" && key === "name") {
      const avgIntensity =
        storms.reduce((sum, s) => {
          return sum + INTENSITY_RANK[s.intensity];
        }, 0) / storms.length;

      setSelectedData({ name: data, storms, avgIntensity });
      setNameListModalOpen(true);
      return;
    }

    if (params.view === "storms" || (params.view === "average" && params.filter === "name")) {
      setSelectedData({ title: getPositionTitle(data, params.filter), storms });
      setDetailModalOpen(true);
    } else {
      // All other routes open average modal
      const titleMap = {
        position: getPositionTitle(data),
        country: data,
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
      setAverageModalOpen(true);
    }
  };

  return (
    <PageHeader title={getDashboardTitle(params.view, params.mode, params.filter)}>
      <FilterButton onClick={() => setFilterModalOpen(true)} params={params} />

      <DashboardContent params={params} stormsData={stormsData} onCellClick={handleCellClick} />

      <FilterModal
        isOpen={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        onApply={handleApplyFilter}
        currentParams={params}
      />

      <StormDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        title={selectedData?.title || ""}
        storms={selectedData?.storms || []}
      />

      <AverageModal
        isOpen={averageModalOpen}
        onClose={() => setAverageModalOpen(false)}
        title={selectedData?.title || ""}
        average={selectedData?.average || 0}
        storms={selectedData?.storms || []}
      />

      <NameListModal
        isOpen={nameListModalOpen}
        onClose={() => setNameListModalOpen(false)}
        name={selectedData?.name || ""}
        storms={selectedData?.storms || []}
        avgIntensity={selectedData?.avgIntensity || 0}
      />
    </PageHeader>
  );
}
