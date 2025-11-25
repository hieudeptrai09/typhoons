import { INTENSITY_RANK } from "../../../../constants";

export const getIntensityFromNumber = (avgNumber) => {
  const rounded = Math.round(avgNumber);
  if (rounded >= 5) return "5";
  if (rounded === 4) return "4";
  if (rounded === 3) return "3";
  if (rounded === 2) return "2";
  if (rounded === 1) return "1";
  if (rounded === 0) return "TS";
  if (rounded <= -1) return "TD";
  return "TD";
};

export const getPositionTitle = (position) => {
  if (position === 141) return "CPHC";
  if (position === 142) return "NHC";
  return `#${position}`;
};

export const getHighlights = (stormsData, type) => {
  // Filter storms based on highlight type
  if (type === "strongest") {
    return stormsData.filter((storm) => Boolean(Number(storm.isStrongest)));
  } else if (type === "first") {
    return stormsData.filter((storm) => Boolean(Number(storm.isFirst)));
  }
  return [];
};

export const getGroupedStorms = (stormsData, groupBy) => {
  // Group storms by specified field (position, name, or country)
  const grouped = {};
  stormsData.forEach((storm) => {
    const key = storm[groupBy];
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(storm);
  });
  return grouped;
};

export const calculateAverage = (storms) => {
  const sum = storms.reduce((acc, s) => acc + INTENSITY_RANK[s.intensity], 0);
  return sum / storms.length;
};

export const getDashboardTitle = (view, mode, filter) => {
  const parts = [];

  // Add view type
  if (view === "storms") {
    parts.push("All Storms");
  } else if (view === "highlights") {
    // Add filter detail for highlights
    if (filter === "strongest") {
      parts.push("Strongest Typhoons by Position");
    } else if (filter === "first") {
      parts.push("First Typhoons by Position");
    } else {
      parts.push("Highlights");
    }
    // Add mode for highlights
    if (mode === "list") {
      parts.push("(List View)");
    }
  } else if (view === "average") {
    // Add filter detail for average
    if (filter === "by position") {
      parts.push("Average Intensity by Position");
    } else if (filter === "by name") {
      parts.push("Average Intensity by Name");
    } else if (filter === "by country") {
      parts.push("Average Intensity by Country");
    } else {
      parts.push("Average Intensity");
    }
    // Add mode for average (only when in list mode)
    if (mode === "list") {
      parts.push("(List View)");
    }
  }

  return parts.join(" ");
};
