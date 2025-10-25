"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Navbar from "../../components/NavBar";
import fetchData from "../../containers/fetcher";

const TyphoonListPage = () => {
  const [storms, setStorms] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [cellHistory, setCellHistory] = useState({});
  const [currentIndices, setCurrentIndices] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData("/storms").then((data) => {
      if (data) {
        setStorms(data.data);
        const grouped = {};
        data.data.forEach((storm) => {
          const key = `${storm.position}`;
          if (!grouped[key]) grouped[key] = [];
          grouped[key].push(storm);
        });
        setCellHistory(grouped);

        const indices = {};
        Object.keys(grouped).forEach((key) => {
          indices[key] = 0;
        });
        setCurrentIndices(indices);
      }
      setLoading(false);
    });
  }, []);

  const handleNext = (position) => {
    const key = `${position}`;
    const history = cellHistory[key] || [];
    if (history.length > 0) {
      setCurrentIndices((prev) => ({
        ...prev,
        [key]: (prev[key] + 1) % history.length,
      }));
    }
  };

  const handlePrev = (position) => {
    const key = `${position}`;
    const history = cellHistory[key] || [];
    if (history.length > 0) {
      setCurrentIndices((prev) => ({
        ...prev,
        [key]: (prev[key] - 1 + history.length) % history.length,
      }));
    }
  };

  const getIntensityColor = (intensity) => {
    if (!intensity) return "bg-gray-100";
    if (intensity.includes("Super Typhoon")) return "bg-red-100 border-red-500";
    if (intensity.includes("Typhoon")) return "bg-orange-100 border-orange-500";
    if (intensity.includes("Severe")) return "bg-yellow-100 border-yellow-500";
    return "bg-blue-100 border-blue-500";
  };

  const rows = 10;
  const cols = 14;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          Typhoon History List
        </h1>

        {loading ? (
          <div className="text-center py-20">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="border-collapse mx-auto">
              <tbody>
                {[...Array(rows)].map((_, row) => (
                  <tr key={row}>
                    {[...Array(cols)].map((_, col) => {
                      const position = row * cols + col + 1;
                      const key = `${position}`;
                      const history = cellHistory[key] || [];
                      const currentIdx = currentIndices[key] || 0;
                      const currentStorm = history[currentIdx];

                      return (
                        <td
                          key={col}
                          className="relative w-24 h-24 border-2 border-gray-300 cursor-pointer"
                          onClick={() => currentStorm && setSelectedCell(key)}
                        >
                          <div
                            className={`w-full h-full flex items-center justify-center ${
                              currentStorm
                                ? getIntensityColor(currentStorm.intensity)
                                : "bg-gray-100"
                            }`}
                          >
                            <div className="text-center">
                              <div className="text-xs font-semibold text-gray-600">
                                #{position}
                              </div>
                              {currentStorm && (
                                <>
                                  <div className="text-sm font-bold">
                                    {currentStorm.name}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {currentStorm.country}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>

                          {history.length > 1 && (
                            <div className="absolute bottom-1 left-0 right-0 flex justify-center space-x-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePrev(position);
                                }}
                                className="bg-white rounded-full p-1 shadow hover:bg-gray-100"
                              >
                                <ChevronLeft size={12} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleNext(position);
                                }}
                                className="bg-white rounded-full p-1 shadow hover:bg-gray-100"
                              >
                                <ChevronRight size={12} />
                              </button>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedCell &&
        (() => {
          const history = cellHistory[selectedCell] || [];
          const currentIdx = currentIndices[selectedCell] || 0;
          const currentStorm = history[currentIdx];

          return (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={() => setSelectedCell(null)}
            >
              <div
                className="bg-white rounded-lg p-6 shadow-2xl max-w-md w-full mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {currentStorm.name}
                  </h2>
                  <button
                    onClick={() => setSelectedCell(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-semibold">
                      Position:
                    </span>
                    <span className="text-gray-800">
                      #{currentStorm.position}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-semibold">Year:</span>
                    <span className="text-gray-800">{currentStorm.year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-semibold">
                      Intensity:
                    </span>
                    <span className="text-gray-800">
                      {currentStorm.intensity}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-semibold">
                      Country:
                    </span>
                    <span className="text-gray-800">
                      {currentStorm.country}
                    </span>
                  </div>

                  {currentStorm.isStrongest && (
                    <div className="text-sm text-red-600 font-bold bg-red-50 p-2 rounded">
                      🏆 Strongest Typhoon
                    </div>
                  )}
                  {currentStorm.isFirst && (
                    <div className="text-sm text-blue-600 font-bold bg-blue-50 p-2 rounded">
                      ⭐ First Typhoon
                    </div>
                  )}

                  {history.length > 1 && (
                    <div className="text-sm text-gray-500 text-center pt-3 border-t">
                      Showing {currentIdx + 1} of {history.length} typhoons at
                      this position
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
};

export default TyphoonListPage;
