"use client";

import { useState, useEffect } from "react";
import Navbar from "../../components/NavBar";
import fetchData from "../../containers/fetcher";
import TyphoonGrid from "./_components/TyphoonGrid";
import TyphoonModal from "./_components/TyphoonModal";

const TyphoonListPage = () => {
  const [selectedCell, setSelectedCell] = useState(null);
  const [cellHistory, setCellHistory] = useState({});
  const [viewMode, setViewMode] = useState("normal");
  const [strongestData, setStrongestData] = useState({});
  const [firstStormData, setFirstStormData] = useState({});

  useEffect(() => {
    fetchData("/storms").then((data) => {
      if (data) {
        const grouped = {};
        const strongestByPosition = {};
        const firstByPosition = {};

        data.data.forEach((storm) => {
          const key = `${storm.position}`;

          // Group all storms
          if (!grouped[key]) grouped[key] = [];
          grouped[key].push(storm);

          // Get strongest storms
          if (storm.isStrongest === 1) {
            strongestByPosition[key] = { name: storm.name, year: storm.year };
          }

          // Get first storms
          if (storm.isFirst === 1) {
            firstByPosition[key] = { name: storm.name, year: storm.year };
          }
        });

        setCellHistory(grouped);
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
          Typhoon History List
        </h1>

        <div className="flex justify-center gap-6 mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="viewMode"
              value="normal"
              checked={viewMode === "normal"}
              onChange={(e) => setViewMode(e.target.value)}
              className="w-4 h-4"
            />
            <span className="text-gray-700 font-medium">Normal View</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="viewMode"
              value="strongest"
              checked={viewMode === "strongest"}
              onChange={(e) => setViewMode(e.target.value)}
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
              onChange={(e) => setViewMode(e.target.value)}
              className="w-4 h-4"
            />
            <span className="text-gray-700 font-medium">First of Season</span>
          </label>
        </div>

        <TyphoonGrid
          onCellClick={setSelectedCell}
          mode={viewMode}
          highlightData={getHighlightData()}
        />

        <TyphoonModal
          selectedCell={selectedCell}
          history={cellHistory[selectedCell] || []}
          onClose={() => setSelectedCell(null)}
        />
      </div>
    </div>
  );
};

export default TyphoonListPage;
