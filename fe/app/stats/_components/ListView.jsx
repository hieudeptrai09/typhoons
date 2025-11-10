import { useState } from "react";
import IntensityBadge from "../../../components/IntensityBadge";

const ListView = ({ data }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const getIntensityValue = (intensity) => {
    const values = { 5: 5, 4: 4, 3: 3, 2: 2, 1: 1, STS: -1, TS: -2, TD: -3 };
    return values[intensity] || -4;
  };

  const handleSort = (key) => {
    if (sortConfig.key === key) {
      if (sortConfig.direction === "asc") {
        setSortConfig({ key, direction: "desc" });
      } else if (sortConfig.direction === "desc") {
        setSortConfig({ key: null, direction: null });
      }
    } else {
      setSortConfig({ key, direction: "asc" });
    }
  };

  const sortedData = !sortConfig.key
    ? data
    : [...data].sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Special handling for intensity
        if (sortConfig.key === "intensity") {
          aValue = getIntensityValue(aValue);
          bValue = getIntensityValue(bValue);
        }

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) {
      return <span className="ml-1 text-white">⇅</span>;
    }
    return sortConfig.direction === "asc" ? (
      <span className="ml-1">↑</span>
    ) : (
      <span className="ml-1">↓</span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-sky-600 text-white">
          <tr>
            <th
              className="px-6 py-3 text-left font-semibold cursor-pointer hover:bg-sky-700"
              onClick={() => handleSort("year")}
            >
              Year {getSortIndicator("year")}
            </th>
            <th
              className="px-6 py-3 text-left font-semibold cursor-pointer hover:bg-sky-700"
              onClick={() => handleSort("name")}
            >
              Name {getSortIndicator("name")}
            </th>
            <th
              className="px-6 py-3 text-left font-semibold cursor-pointer hover:bg-sky-700"
              onClick={() => handleSort("intensity")}
            >
              Intensity {getSortIndicator("intensity")}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((storm, index) => (
            <tr
              key={index}
              className={`border-b border-gray-200 ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
            >
              <td className="px-6 py-4 text-gray-700">{storm.year}</td>
              <td className="px-6 py-4 text-gray-700 font-medium">
                {storm.name}
              </td>
              <td className="px-6 py-4">
                <IntensityBadge intensity={storm.intensity} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListView;
