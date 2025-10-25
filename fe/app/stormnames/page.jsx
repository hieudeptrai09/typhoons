"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Navbar from "../../components/NavBar";
import fetchData from "../../containers/fetcher";

const CurrentNamesPage = () => {
  const [names, setNames] = useState([]);
  const [selectedName, setSelectedName] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData("/typhoon-names?isRetired=0").then((data) => {
      if (data) setNames(data.data);
      setLoading(false);
    });
  }, []);

  const rows = 10;
  const cols = 14;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          Current Typhoon Names
        </h1>

        {loading ? (
          <div className="text-center py-20">Loading...</div>
        ) : (
          <table className="min-w-full bg-white border-2 border-gray-300 shadow-lg">
            <tbody>
              {[...Array(rows)].map((_, row) => (
                <tr key={row}>
                  {[...Array(cols)].map((_, col) => {
                    const position = row * cols + col + 1;
                    const dataNow = names.find((n) => n.position === position);

                    return (
                      <td key={col} className="border border-gray-300 p-0">
                        <button
                          onClick={() => dataNow && setSelectedName(dataNow)}
                          className={`w-full h-16 flex items-center justify-center transition-all ${
                            dataNow
                              ? "bg-gradient-to-br from-blue-100 to-purple-100 hover:from-blue-200 hover:to-purple-200 hover:scale-105"
                              : "bg-gray-100"
                          }`}
                        >
                          <div className="text-sm font-semibold text-gray-700">
                            {dataNow?.name || ""}
                          </div>
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedName && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setSelectedName(null)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-3xl font-bold text-blue-600">
                {selectedName.name}
              </h2>
              <button
                onClick={() => setSelectedName(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <span className="font-semibold text-gray-700">Meaning:</span>
                <p className="text-gray-600">{selectedName.meaning}</p>
              </div>

              <div>
                <span className="font-semibold text-gray-700">Position:</span>
                <span className="text-gray-600 ml-2">
                  {selectedName.position}
                </span>
              </div>

              <div>
                <span className="font-semibold text-gray-700">Country:</span>
                <span className="text-gray-600 ml-2">
                  {selectedName.country}
                </span>
              </div>

              {selectedName.language && (
                <div>
                  <span className="font-semibold text-gray-700">Language:</span>
                  <span className="text-gray-600 ml-2">
                    {selectedName.language}
                  </span>
                </div>
              )}

              {selectedName.note && (
                <div>
                  <span className="font-semibold text-gray-700">Note:</span>
                  <p className="text-gray-600">{selectedName.note}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrentNamesPage;
