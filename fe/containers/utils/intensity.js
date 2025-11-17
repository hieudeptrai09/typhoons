export const getBackground = (intensity) => {
  const colors = {
    TD: "#00CCFF",
    TS: "#00FF00",
    STS: "#C0FFC0",
    1: "#FFFF00",
    2: "#FFCC00",
    3: "#FF6600",
    4: "#FF0000",
    5: "#CC00CC",
  };
  return colors[intensity] || "#333333";
};

export const getBadgeTextcolor = (intensity) => {
  switch (intensity) {
    case "TD":
    case "TS":
    case "2":
    case "3":
    case "4":
    case "5":
      return "white"; // White for dark backgrounds
    case "STS":
    case "1":
      return "gray"; // Black for light backgrounds
    default:
      return "white";
  }
};

export const getWhiteTextcolor = (intensity) => {
  const colors = {
    TD: "#00CCFF",
    TS: "#00FF00",
    STS: "#007733",
    1: "#AA8800",
    2: "#FFCC00",
    3: "#FF6600",
    4: "#FF0000",
    5: "#CC00CC",
  };
  return colors[intensity] || "#333333";
};

export const gerRankForSorting = (intensity) => {
  const ranks = {
    5: 5,
    4: 4,
    3: 3,
    2: 2,
    1: 1,
    STS: 0,
    TS: -1,
    TD: -2,
  };
  return ranks.hasOwnProperty(intensity) ? ranks[intensity] : -3;
};

export const intensityRank = {
  5: 5,
  4: 4,
  3: 3,
  2: 2,
  1: 1,
  STS: 0,
  TS: 0,
  TD: -1,
};

export const getRank = (intensity) => {
  return intensityRank.hasOwnProperty(intensity)
    ? intensityRank[intensity]
    : -2;
};
