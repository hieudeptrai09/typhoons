"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Cloud,
  Star,
  BarChart3,
  Zap,
  Medal,
  MapPin,
  Tag,
  Grid3x3,
  List,
  Globe,
  Calendar,
} from "lucide-react";
import { FilterModal } from "./_components/FilterModal";
import { StormDetailModal } from "./_components/StormDetailModal";
import { AverageModal } from "./_components/AverageModal";
import { DashboardContent } from "./_components/DashboardContent";
import { INTENSITY_RANK, TITLE_COMMON } from "../../../constants";
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

  // Update page title based on params (client-side)
  useEffect(() => {
    const titleParts = getDashboardTitle(
      params.view,
      params.mode,
      params.filter
    );
    const title = titleParts
      ? `${titleParts} | Dashboard | ${TITLE_COMMON}`
      : `Dashboard | ${TITLE_COMMON}`;

    document.title = title;
  }, [params]);

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

    if (
      params.view === "storms" ||
      (params.view === "average" && params.filter === "name")
    ) {
      setSelectedData({ title: data, storms });
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

  const renderViewIcons = () => {
    const iconSize = 20;
    const icons = [];

    const iconMap = {
      view: {
        storms: Cloud,
        highlights: Star,
        average: BarChart3,
      },
      filter: {
        strongest: Zap,
        first: Medal,
        position: MapPin,
        name: Tag,
        country: Globe,
        year: Calendar,
      },
      mode: {
        table: Grid3x3,
        list: List,
      },
    };

    // Add view icon
    const ViewIcon = iconMap.view[params.view];
    if (ViewIcon) icons.push(<ViewIcon key="view" size={iconSize} />);

    // Add filter icon
    if (params.filter) {
      const FilterIcon = iconMap.filter[params.filter];
      if (FilterIcon) icons.push(<FilterIcon key="filter" size={iconSize} />);
    }

    // Add mode icon
    const ModeIcon = iconMap.mode[params.mode];
    if (ModeIcon) icons.push(<ModeIcon key="mode" size={iconSize} />);

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
    <PageHeader
      title={getDashboardTitle(params.view, params.mode, params.filter)}
    >
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
