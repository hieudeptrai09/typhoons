import { INTENSITY_RANK, IntensityType } from "../../../../constants";
import { Storm } from "../../../../types";

export const getIntensityFromNumber = (avgNumber: number): IntensityType => {
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

export const getPositionTitle = (position: number | string, type?: string): string => {
  const pos = typeof position === "string" ? parseInt(position) : position;

  if (pos === 141) return "CPHC";
  if (pos === 142) return "NHC";
  if (pos === 143) return "IMD";
  if (type === "name") return position.toString();
  return `#${position}`;
};

export const getHighlights = (stormsData: Storm[], type: string): Storm[] => {
  // Filter storms based on highlight type
  if (type === "strongest") {
    return stormsData.filter((storm) => Boolean(storm.isStrongest));
  } else if (type === "first") {
    return stormsData.filter((storm) => Boolean(storm.isFirst));
  } else if (type === "last") {
    return stormsData.filter((storm) => Boolean(storm.isLast));
  }
  return [];
};

export const getGroupedStorms = (stormsData: Storm[], groupBy: string): Record<string, Storm[]> => {
  // Group storms by specified field (position, name, country, or year)
  const grouped: Record<string, Storm[]> = {};
  stormsData.forEach((storm) => {
    const key = storm[groupBy as keyof Storm]?.toString() || "";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(storm);
  });
  return grouped;
};

export const calculateAverage = (storms: Storm[]): number => {
  const sum = storms.reduce((acc, s) => acc + INTENSITY_RANK[s.intensity], 0);
  return sum / storms.length;
};

export const getDashboardTitle = (view: string, mode: string, filter: string): string => {
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  if (!filter) filter = "";

  const viewTitles: Record<string, string> = {
    storms: mode === "list" ? "All Typhoon Names" : "All Storms",
    highlights: `${capitalize(filter)} Typhoons by Position`,
    average: `Average Intensity by ${capitalize(filter)}`,
  };

  const title = viewTitles[view];
  return mode === "list" && view !== "storms" ? `${title} (List View)` : title;
};

export const getDashboardDescription = (view: string, mode: string, filter: string): string => {
  if (view === "storms") {
    if (mode === "list") {
      return "Browse all typhoon names used in the Western Pacific basin. Click any name to see detailed storm history, including years, intensities, and track maps.";
    }
    return "View comprehensive typhoon storm data organized by position in the naming list. Track all typhoons that have occurred in the Western Pacific basin.";
  }

  if (view === "highlights") {
    const highlightDescriptions: Record<string, string> = {
      strongest:
        "Explore the strongest typhoons by position - discover which names have been associated with the most powerful storms in history.",
      first:
        "View the first typhoons of each season by position - track the earliest storms to receive each name in the typhoon naming sequence.",
      last: "Browse the last typhoons of each season by position - see which storms closed out their respective seasons for each name position.",
    };
    return (
      highlightDescriptions[filter] ||
      "Discover highlighted typhoons with special characteristics organized by their position in the naming sequence."
    );
  }

  if (view === "average") {
    const averageDescriptions: Record<string, string> = {
      position:
        "Analyze average typhoon intensity by position in the naming list. Compare which positions tend to produce stronger or weaker storms.",
      name: "Compare average intensity across different typhoon names. Discover which names have historically been associated with stronger storms.",
      country:
        "View average typhoon intensity statistics by contributing country. See how different countries' name contributions perform.",
      year: "Track average typhoon intensity trends by year. Analyze how storm strength has evolved over time in the Western Pacific.",
    };
    return (
      averageDescriptions[filter] ||
      "Statistical analysis of typhoon intensity data with comprehensive averaging and comparison tools."
    );
  }

  return "Comprehensive typhoon storm database with advanced filtering, analysis, and visualization tools for Western Pacific typhoons.";
};
