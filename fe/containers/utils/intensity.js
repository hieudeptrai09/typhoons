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
    TD: "#0099CC",
    TS: "#00AA00",
    STS: "#009900",
    1: "#CC9900",
    2: "#CC8800",
    3: "#CC4400",
    4: "#CC0000",
    5: "#990099",
  };
  return colors[intensity] || "#333333";
};
