"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Navbar from "../../components/NavBar";
import fetchData from "../../containers/fetcher";

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

  const getIntensityColor = (intensity) => {
    switch (intensity) {
      case "TD":
        return "#00CCFF";
      case "TS":
        return "#00FF00";
      case "STS":
        return "#C0FFC0";
      case "1":
        return "#FFFF00";
      case "2":
        return "#FFCC00";
      case "3":
        return "#FF6600";
      case "4":
        return "#FF0000";
      case "5":
        return "#CC00CC";
      default:
        return "#333333";
    }
  };

  const rows = 10;
  const cols = 14;

  return (
    <div className="min-h-screen bg-sky-100">
      <Navbar />
      <div className="p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          Typhoon History List
        </h1>

        <div className="overflow-x-auto">
          <table className="border-collapse mx-auto">
            <tbody>
              {[...Array(rows)].map((_, row) => (
                <tr key={row}>
                  {[...Array(cols)].map((_, col) => {
                    const position = row * cols + col + 1;
                    const key = `${position}`;

                    return (
                      <td
                        key={col}
                        className="relative w-24 h-24 border-2 border-gray-300 cursor-pointer"
                        onClick={() => setSelectedCell(key)}
                      >
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center text-xs font-semibold text-gray-600">
                            #{position}
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 flex justify-evenly">
            <button
              onClick={() => setSelectedCell("141")}
              className="relative w-24 h-24 border-2 border-gray-300 cursor-pointer text-center text-xs font-semibold text-gray-600"
            >
              CPHC
            </button>
            <button
              onClick={() => setSelectedCell("142")}
              className="relative w-24 h-24 border-2 border-gray-300 cursor-pointer text-center text-xs font-semibold text-gray-600"
            >
              NHC
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedCell &&
        (() => {
          const history = cellHistory[selectedCell] || [];

          return (
            <div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              onClick={() => setSelectedCell(null)}
            >
              <div
                className="bg-white rounded-lg p-6 shadow-2xl max-w-md w-full mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {"#" + selectedCell}
                  </h2>
                  <button
                    onClick={() => setSelectedCell(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="flex gap-1.5 flex-col">
                  {history.map((storm) => (
                    <div className="flex">
                      <span
                        className="text-white font-semibold w-7 h-7 flex items-center justify-center mr-1.5"
                        style={{
                          backgroundColor: getIntensityColor(storm.intensity),
                        }}
                      >
                        {storm.intensity}
                      </span>
                      <span
                        style={{ color: getIntensityColor(storm.intensity) }}
                      >
                        {`${storm.name} (${storm.year})`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
};

export default TyphoonListPage;
