"use client";

import { useState, useEffect, useMemo } from "react";
import { Settings } from "lucide-react";
import { FilterModal } from "./_components/FilterModal";
import { StormDetailModal } from "./_components/StormDetailModal";
import { AverageModal } from "./_components/AverageModal";
import { DashboardContent } from "./_components/DashboardContent";
import fetchData from "../../containers/utils/fetcher";
import Navbar from "../../components/NavBar";
import {
  getPositionTitle,
  getAverageByPosition,
  getAverageByName,
  calculateAverage,
} from "./utils/fns";

export default function Dashboard() {
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [averageModalOpen, setAverageModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [params, setParams] = useState({ view: "storms", mode: "table" });
  const [stormsData, setStormsData] = useState([]);

  // Memoize expensive calculations
  const averageByPosition = useMemo(
    () => getAverageByPosition(stormsData),
    [stormsData]
  );

  const averageByName = useMemo(
    () => getAverageByName(stormsData),
    [stormsData]
  );

  // Pre-calculate average values for positions
  const averageValues = useMemo(() => {
    const values = {};
    Object.entries(averageByPosition).forEach(([position, storms]) => {
      values[position] = calculateAverage(storms);
    });
    return values;
  }, [averageByPosition]);

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

  const handleCellClick = (data, key) => {
    const storms = stormsData.filter((s) => s[key] === data);
    if (params.view === "average" && params.filter === "by name") {
      setSelectedData({ title: data, storms });
      setDetailModalOpen(true);
    } else if (params.view === "average" && params.filter === "by position") {
      const avg = averageValues[data];
      setSelectedData({
        title: getPositionTitle(data),
        average: avg,
        storms,
      });
      setAverageModalOpen(true);
    } else {
      setSelectedData({
        title: getPositionTitle(data),
        storms,
      });
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
          averageByPosition={averageByPosition}
          averageByName={averageByName}
          averageValues={averageValues}
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
      </div>
    </div>
  );
}
