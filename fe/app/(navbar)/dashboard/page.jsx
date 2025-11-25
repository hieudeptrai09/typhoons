"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Cloud,
  Star,
  BarChart3,
  Zap,
  Calendar,
  MapPin,
  Type,
  Grid3x3,
  List,
  Globe,
} from "lucide-react";
import { FilterModal } from "./_components/FilterModal";
import { StormDetailModal } from "./_components/StormDetailModal";
import { AverageModal } from "./_components/AverageModal";
import { DashboardContent } from "./_components/DashboardContent";
import fetchData from "../../../containers/utils/fetcher";
import {
  getPositionTitle,
  getGroupedStorms,
  calculateAverage,
  getDashboardTitle,
} from "./_utils/fns";

export default function Dashboard() {
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [averageModalOpen, setAverageModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [params, setParams] = useState({ view: "storms", mode: "table" });
  const [stormsData, setStormsData] = useState([]);

  // Memoize expensive calculations
  const averageByPosition = useMemo(
    () => getGroupedStorms(stormsData, "position"),
    [stormsData]
  );

  const averageByName = useMemo(
    () => getGroupedStorms(stormsData, "name"),
    [stormsData]
  );

  const averageByCountry = useMemo(
    () => getGroupedStorms(stormsData, "country"),
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

  // Update page title based on params (client-side)
  useEffect(() => {
    const titleParts = getDashboardTitle(
      params.view,
      params.mode,
      params.filter
    );
    const title = titleParts
      ? `${titleParts} | Dashboard | Typhoon Tracker`
      : "Dashboard | Typhoon Tracker";

    document.title = title;
  }, [params]);

  useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const view = urlParams.get("view") || "storms";
      const mode = urlParams.get("mode") || "table";
      const filter = urlParams.get("filter") || "";

      setParams({ view, mode, filter });
    };

    handlePopState();

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
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
    const storms = stormsData.filter((s) => s[key] === String(data));

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
    } else if (params.view === "average" && params.filter === "by country") {
      const avg = calculateAverage(storms);
      setSelectedData({
        title: data,
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

  const renderViewIcons = () => {
    const icons = [];
    const iconSize = 20;

    // View icon
    if (params.view === "storms") {
      icons.push(<Cloud key="view" size={iconSize} />);
    } else if (params.view === "highlights") {
      icons.push(<Star key="view" size={iconSize} />);
    } else if (params.view === "average") {
      icons.push(<BarChart3 key="view" size={iconSize} />);
    }

    // Filter icon (if applicable)
    if (params.filter) {
      if (params.filter === "strongest") {
        icons.push(<Zap key="filter" size={iconSize} />);
      } else if (params.filter === "first") {
        icons.push(<Calendar key="filter" size={iconSize} />);
      } else if (params.filter === "by position") {
        icons.push(<MapPin key="filter" size={iconSize} />);
      } else if (params.filter === "by name") {
        icons.push(<Type key="filter" size={iconSize} />);
      } else if (params.filter === "by country") {
        icons.push(<Globe key="filter" size={iconSize} />);
      }
    }

    // Mode icon
    if (params.mode === "table") {
      icons.push(<Grid3x3 key="mode" size={iconSize} />);
    } else if (params.mode === "list") {
      icons.push(<List key="mode" size={iconSize} />);
    }

    // Insert "/" separators between icons
    return icons.reduce((acc, icon, index) => {
      if (index > 0) {
        acc.push(
          <span key={`sep-${index}`} className="text-white mx-1">
            /
          </span>
        );
      }
      acc.push(icon);
      return acc;
    }, []);
  };

  return (
    <>
      <div className="p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          Typhoon Dashboard
        </h1>

        <div className="max-w-4xl mx-auto mb-6">
          <button
            onClick={() => setFilterModalOpen(true)}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold flex items-center gap-2 mx-auto"
          >
            {renderViewIcons()}
          </button>
        </div>

        <DashboardContent
          params={params}
          stormsData={stormsData}
          averageByPosition={averageByPosition}
          averageByName={averageByName}
          averageByCountry={averageByCountry}
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
    </>
  );
}
