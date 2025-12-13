"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FilterModal } from "./_components/FilterModal";
import { StormDetailModal } from "./_components/StormDetailModal";
import { AverageModal } from "./_components/AverageModal";
import { DashboardContent } from "./_components/DashboardContent";
import FilterButton from "./_components/FilterButton";
import { INTENSITY_RANK } from "../../../constants";
import fetchData from "../../../containers/utils/fetcher";
import { getPositionTitle, getDashboardTitle } from "./_utils/fns";
import PageHeader from "../../../components/PageHeader";

export default function DashboardPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [averageModalOpen, setAverageModalOpen] = useState(false);
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

    if (
      params.view === "storms" ||
      (params.view === "average" && params.filter === "name")
    ) {
      setSelectedData({ title: getPositionTitle(data), storms });
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
    <PageHeader
      title={getDashboardTitle(params.view, params.mode, params.filter)}
    >
      <FilterButton onClick={() => setFilterModalOpen(true)} params={params} />

      <DashboardContent
        params={params}
        stormsData={stormsData}
        onCellClick={handleCellClick}
      />

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
    </PageHeader>
  );
}
