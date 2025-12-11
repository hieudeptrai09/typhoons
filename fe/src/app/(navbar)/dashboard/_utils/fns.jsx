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
  if (position === 143) return "IMD";
  return `#${position}`;
};

export const getHighlights = (stormsData, type) => {
  // Filter storms based on highlight type
  if (type === "strongest") {
    return stormsData.filter((storm) => Boolean(Number(storm.isStrongest)));
  } else if (type === "first") {
    return stormsData.filter((storm) => Boolean(Number(storm.isFirst)));
  } else if (type === "last") {
    return stormsData.filter((storm) => Boolean(Number(storm.isLast)));
  }
  return [];
};

export const getGroupedStorms = (stormsData, groupBy) => {
  // Group storms by specified field (position, name, country, or year)
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
  const capitalize = (str) => str?.charAt(0).toUpperCase() + str?.slice(1);

  const viewTitles = {
    storms: "All Storms",
    highlights: `${capitalize(filter)} Typhoons by Position`,
    average: `Average Intensity by ${capitalize(filter)}`,
  };

  const title = viewTitles[view];
  return mode === "list" && view !== "storms" ? `${title} (List View)` : title;
};
