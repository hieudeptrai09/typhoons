"use client";

import { useState, useEffect } from "react";
import { Settings } from "lucide-react";
import { FilterModal } from "./_components/FilterModal";
import { StormDetailModal } from "./_components/StormDetailModal";
import { AverageModal } from "./_components/AverageModal";
import { DashboardContent } from "./_components/DashboardContent";
import { intensityRank } from "./utils/fns";
import fetchData from "../../containers/utils/fetcher";
import Navbar from "../../components/NavBar";

export default function Dashboard() {
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [averageModalOpen, setAverageModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [params, setParams] = useState({ view: "storms", mode: "table" });
  const [stormsData, setStormsData] = useState([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const view = urlParams.get("view") || "storms";
    const mode = urlParams.get("mode") || "table";
    const filter = urlParams.get("filter") || "";

    setParams({ view, mode, filter });
  }, []);

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
    window.history.pushState(
      {},
      "",
      `/dashboard${searchParams.toString() ? `?${searchParams}` : ""}`
    );
  };

  const handleCellClick = (position) => {
    const storms = stormsData.filter((s) => s.position === position);

    if (params.view === "average") {
      const avg =
        storms.reduce((sum, s) => sum + (intensityRank[s.intensity] || 0), 0) /
        storms.length;
      setSelectedData({ position, average: avg, storms });
      setAverageModalOpen(true);
    } else {
      setSelectedData({ title: `#${position}`, storms });
      setDetailModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-sky-100">
      <Navbar />
      <div className="p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          Typhoon Dashboard
        </h1>

        <div className="max-w-4xl mx-auto mb-6">
          <button
            onClick={() => setFilterModalOpen(true)}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold flex items-center gap-2 mx-auto "
          >
            <Settings size={24} />
            View Options
          </button>
        </div>

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
          position={selectedData?.position}
          average={selectedData?.average || 0}
          storms={selectedData?.storms || []}
        />
      </div>
    </div>
  );
}
