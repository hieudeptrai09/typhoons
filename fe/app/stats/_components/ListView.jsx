import { useState } from "react";

const ListView = ({ data }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

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

  const getIntensityValue = (intensity) => {
    const values = { 5: 5, 4: 4, 3: 3, 2: 2, 1: 1, STS: 0, TS: -1, TD: -2 };
    return values[intensity] || -3;
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;

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
      return <span className="ml-1 text-gray-400">⇅</span>;
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
                <span
                  className="px-3 py-1 rounded text-white font-semibold"
                  style={{
                    backgroundColor: getIntensityColor(storm.intensity),
                  }}
                >
                  {storm.intensity}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListView;
