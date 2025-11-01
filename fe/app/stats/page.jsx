"use client";

import { useState, useEffect } from "react";
import TyphoonGrid from "./_components/TyphoonGrid";
import Navbar from "../../components/NavBar";
import fetchData from "../../containers/fetcher";

export default function TyphoonListPage() {
  const [viewMode, setViewMode] = useState(null);
  const [strongestData, setStrongestData] = useState({});
  const [firstStormData, setFirstStormData] = useState({});

  // Get view mode from URL query parameter
  useEffect(() => {
    const updateViewMode = () => {
      const params = new URLSearchParams(window.location.search);
      const type = params.get("type");
      if (type === "strongest" || type === "first") {
        setViewMode(type);
      } else {
        setViewMode(null);
      }
    };

    updateViewMode();
    window.addEventListener("popstate", updateViewMode);
    return () => window.removeEventListener("popstate", updateViewMode);
  }, []);

  // Mock data for demo
  useEffect(() => {
    fetchData("/storms").then((data) => {
      if (data) {
        const strongestByPosition = {};
        const firstByPosition = {};

        data.data.forEach((storm) => {
          const key = `${storm.position}`;

          // Get strongest storms
          if (Boolean(Number(storm.isStrongest))) {
            strongestByPosition[key] = { name: storm.name, year: storm.year };
          }

          // Get first storms
          if (Boolean(Number(storm.isFirst))) {
            firstByPosition[key] = { name: storm.name, year: storm.year };
          }
        });

        setStrongestData(strongestByPosition);
        setFirstStormData(firstByPosition);
      }
    });
  }, []);

  const getHighlightData = () => {
    if (viewMode === "strongest") return strongestData;
    if (viewMode === "first") return firstStormData;
    return {};
  };

  return (
    <div className="min-h-screen bg-sky-100">
      <Navbar />
      <div className="p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          Statistics Data List
        </h1>

        {/* Radio Button Links */}
        <div className="flex justify-center gap-6 mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="viewMode"
              value="strongest"
              checked={viewMode === "strongest"}
              onChange={() => {
                const newUrl = `${window.location.pathname}?type=strongest`;
                window.history.pushState({}, "", newUrl);
                setViewMode("strongest");
              }}
              className="w-4 h-4"
            />
            <span className="text-gray-700 font-medium">
              Strongest Per Year
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="viewMode"
              value="first"
              checked={viewMode === "first"}
              onChange={() => {
                const newUrl = `${window.location.pathname}?type=first`;
                window.history.pushState({}, "", newUrl);
                setViewMode("first");
              }}
              className="w-4 h-4"
            />
            <span className="text-gray-700 font-medium">First of Season</span>
          </label>
        </div>

        <TyphoonGrid mode={viewMode} highlightData={getHighlightData()} />
      </div>
    </div>
  );
}
