"use client";

import { useState, useEffect } from "react";
import TyphoonGrid from "./_components/TyphoonGrid";
import ListView from "./_components/ListView";
import Navbar from "../../components/NavBar";
import fetchData from "../../containers/fetcher";

export default function TyphoonListPage() {
  const [viewMode, setViewMode] = useState(null);
  const [showMode, setShowMode] = useState("table");
  const [strongestData, setStrongestData] = useState({});
  const [firstStormData, setFirstStormData] = useState({});

  // Get parameters from URL
  useEffect(() => {
    const updateFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const type = params.get("type");
      const show = params.get("show");

      if (type === "strongest" || type === "first") {
        setViewMode(type);
      } else {
        setViewMode(null);
      }

      if (show === "list" || show === "table") {
        setShowMode(show);
      } else {
        setShowMode("table");
      }
    };

    updateFromUrl();
    window.addEventListener("popstate", updateFromUrl);
    return () => window.removeEventListener("popstate", updateFromUrl);
  }, []);

  // Fetch data from server
  useEffect(() => {
    fetchData("/storms").then((data) => {
      if (data) {
        const strongestByPosition = {};
        const firstByPosition = {};

        data.data.forEach((storm) => {
          const key = `${storm.position}`;

          // Get strongest storms - store as array to handle multiple storms at same position
          if (Boolean(Number(storm.isStrongest))) {
            if (!strongestByPosition[key]) {
              strongestByPosition[key] = [];
            }
            strongestByPosition[key].push({
              name: storm.name,
              year: storm.year,
              intensity: storm.intensity,
            });
          }

          // Get first storms - store as array to handle multiple storms at same position
          if (Boolean(Number(storm.isFirst))) {
            if (!firstByPosition[key]) {
              firstByPosition[key] = [];
            }
            firstByPosition[key].push({
              name: storm.name,
              year: storm.year,
              intensity: storm.intensity,
            });
          }
        });

        setStrongestData(strongestByPosition);
        setFirstStormData(firstByPosition);
      }
    });
  }, []);

  const getDisplayData = () => {
    if (viewMode === "strongest") return strongestData;
    if (viewMode === "first") return firstStormData;
    return {};
  };

  const updateUrl = (type, show) => {
    const params = new URLSearchParams();
    if (type) params.set("type", type);
    if (show) params.set("show", show);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, "", newUrl);
  };

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setViewMode(newType || null);
    updateUrl(newType, showMode);
  };

  const handleShowChange = (e) => {
    const newShow = e.target.value;
    setShowMode(newShow);
    updateUrl(viewMode, newShow);
  };

  return (
    <div className="min-h-screen bg-sky-100">
      <Navbar />
      <div className="p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          Statistics Data List
        </h1>

        {/* Select Boxes */}
        <div className="flex justify-center gap-6 mb-6">
          <div className="flex items-center gap-2">
            <label className="text-gray-700 font-medium">Type:</label>
            <select
              value={viewMode || ""}
              onChange={handleTypeChange}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg bg-white text-gray-700 font-medium cursor-pointer hover:border-sky-400 focus:outline-none focus:border-sky-500"
            >
              <option value="">Select...</option>
              <option value="strongest">Strongest Per Year</option>
              <option value="first">First of Season</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-gray-700 font-medium">Show:</label>
            <select
              value={showMode}
              onChange={handleShowChange}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg bg-white text-gray-700 font-medium cursor-pointer hover:border-sky-400 focus:outline-none focus:border-sky-500"
            >
              <option value="table">Table</option>
              <option value="list">List</option>
            </select>
          </div>
        </div>

        {/* Content Display */}
        {showMode === "table" ? (
          <TyphoonGrid mode={viewMode} highlightData={getDisplayData()} />
        ) : (
          <ListView data={Object.values(getDisplayData()).flat()} />
        )}
      </div>
    </div>
  );
}
