"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Navbar from "../../components/NavBar";
import fetchData from "../../containers/fetcher";

const CurrentNamesPage = () => {
  const [names, setNames] = useState([]);
  const [selectedName, setSelectedName] = useState(null);

  useEffect(() => {
    fetchData("/typhoon-names?isRetired=0").then((data) => {
      if (data) setNames(data.data);
    });
  }, []);

  const rows = 10;
  const cols = 14;

  return (
    <div className="min-h-screen bg-sky-100">
      <Navbar />
      <div className="p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          Current Typhoon Names
        </h1>

        <table className="min-w-full border-collapse">
          <tbody>
            {[...Array(rows)].map((_, row) => (
              <tr key={row}>
                {[...Array(cols)].map((_, col) => {
                  const position = row * cols + col + 1;
                  const dataNow = names.find((n) => n.position === position);

                  return (
                    <td
                      key={col}
                      className="border border-sky-200 hover:bg-sky-200 p-0"
                    >
                      <button
                        onClick={() => dataNow && setSelectedName(dataNow)}
                        className="w-full h-16 flex items-center justify-center transition-all"
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
                <span className="text-gray-600 ml-2">
                  {selectedName.meaning}
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrentNamesPage;
