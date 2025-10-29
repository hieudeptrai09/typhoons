"use client";

import { useState, useEffect } from "react";
import Navbar from "../../components/NavBar";
import fetchData from "../../containers/fetcher";
import TyphoonGrid from "./_components/TyphoonGrid";
import TyphoonModal from "./_components/TyphoonModal";

const TyphoonListPage = () => {
  const [selectedCell, setSelectedCell] = useState(null);
  const [cellHistory, setCellHistory] = useState({});

  useEffect(() => {
    fetchData("/storms").then((data) => {
      if (data) {
        const grouped = {};
        data.data.forEach((storm) => {
          const key = `${storm.position}`;
          if (!grouped[key]) grouped[key] = [];
          grouped[key].push(storm);
        });
        setCellHistory(grouped);
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-sky-100">
      <Navbar />
      <div className="p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          Typhoon History List
        </h1>

        <TyphoonGrid onCellClick={setSelectedCell} />

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
