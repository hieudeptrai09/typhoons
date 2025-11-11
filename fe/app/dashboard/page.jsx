"use client";

import { useState, useEffect } from "react";
import { FilterModal } from "./_components/FilterModal";
import { StormDetailModal } from "./_components/StormDetailModal";
import { AverageModal } from "./_components/AverageModal";
import { DashboardContent } from "./_components/DashboardContent";
import { intensityRank } from "./utils/fns";
import fetchData from "../../containers/fetcher";

export default function Dashboard() {
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [averageModalOpen, setAverageModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [params, setParams] = useState({ view: "storms", mode: "table" });
  const [stormsData, setStormsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStorms = async () => {
      setLoading(true);
      setError(null);

      const result = await fetchData("/storms");

      if (result && result.data) {
        setStormsData(result.data);
      } else {
        setError("Failed to load storms data");
      }

      setLoading(false);
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
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800">
            Typhoon Dashboard
          </h1>
          <button
            onClick={() => setFilterModalOpen(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Open Filters
          </button>
        </div>

        <div className="mb-4 text-center text-sm text-gray-600">
          Current: View: <span className="font-semibold">{params.view}</span>
          {params.filter && (
            <>
              , Filter: <span className="font-semibold">{params.filter}</span>
            </>
          )}
          , Mode: <span className="font-semibold">{params.mode}</span>
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
